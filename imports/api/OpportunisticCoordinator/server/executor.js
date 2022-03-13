import { Meteor } from "meteor/meteor";
import { Experiences } from "../../OCEManager/OCEs/experiences";
import { Incidents } from "../../OCEManager/OCEs/experiences";
import { Locations } from "../../UserMonitor/locations/locations";
import { IncidentsCache } from "../../OCEManager/OCEs/server/experiencesCache";

import { notifyForParticipating } from "./noticationMethods";
import { adminUpdatesForAddingUserToIncident, updateAvailability } from "./identifier";
import {
  distanceBetweenLocations, userIsAvailableToParticipate,
  userNotifiedTooRecently, userParticipatedTooRecently
} from "../../UserMonitor/locations/methods";
import { checkIfThreshold } from "./strategizer";
import { Notification_log } from "../../Logging/notification_log";
import { serverLog, log } from "../../logs";
import {sustainedAvailabilities} from "../../OCEManager/OCEs/methods";
import {needAggregator} from "../strategizer";
import {setIntersection} from "../../custom/arrayHelpers";
import { CONFIG } from "../../config";

/**
 * Sends notifications to the users, adds to the user's active experience list,
 *  marks in assignment DB 2b
 * @param incidentsWithUsersToRun {object} needs to run in format of
 *  {
 *    [iid]: {
 *      [need]: [
 *        {uid: uid1, place: place1, distance: 10},
 *        {uid: uid2, place: place2, distance: 15}
 *      ],
 *      [need]:[
 *        {uid: uid3, place: place3, distance: 20}
 *      ]
 *    }
 *  }
 */
export const runNeedsWithThresholdMet = (incidentsWithUsersToRun) => {
  // admin updates for all incidents and users
  _.forEach(incidentsWithUsersToRun, (needUserMapping, iid) => {
    let incident = IncidentsCache.findOne(iid);
    if (!incident) {
      incident = Incidents.findOne(iid);
      IncidentsCache.insert(incident, (err) => { if (err) { console.log('error ', err); } });
    }

    // FIXME(rlouie): rewrite to use ExperiencesCache when notifying if this gets called too much
    // console.time('query Experiences in runNeedsWithThresholdMet | iid ' + iid);
    // let experience = Experiences.findOne(incident.eid);
    // console.timeEnd('query Experiences in runNeedsWithThresholdMet | iid ' + iid);

    // { [detectorUniqueKey]: [need1, ...], ...}
    let needNamesBinnedByDetector = needAggregator(incident);
    let assignedNeedNames = Object.keys(needUserMapping);

    _.forEach(needNamesBinnedByDetector, (commonDetectorNeedNames, detectorUniqueKey) => {

      // might have to distinguish what is logged done when its not half half vs not.
      // maybe use a "strategy" class model
      // if (commonDetectorNeedNames.length == 1) {
      //
      // }

      // before doing a dynamic strategy algorithm, make sure we are looking at the candidate needs
      let candidateNeedNames = setIntersection(commonDetectorNeedNames, assignedNeedNames);

      // TODO: send to a dynamic route endpoint
      // choose a random need from the aggregated set for now
      let needName = candidateNeedNames[0];

      let usersMeta = needUserMapping[needName];
      if (!usersMeta) {
        return;
      }

      if (CONFIG.DEBUG) {
        serverLog.call({message: `need: ${ needName } | users: ${ JSON.stringify(usersMeta) }`});
      }
      let newUsersMeta = usersMeta.filter(function(userMeta) {
        return !Meteor.users.findOne(userMeta.uid).activeIncidents().includes(iid);
      });
      if (CONFIG.DEBUG) {
        serverLog.call({message: `new users not currently active: ${ JSON.stringify(newUsersMeta) }`});
      }

      //administrative updates
      _.forEach(newUsersMeta, (userMeta) => {
        adminUpdatesForAddingUserToIncident(userMeta.uid, iid, needName);
      });

      let uidsNotNotifiedRecently = newUsersMeta.map(userMeta => userMeta.uid);
      // let uidsNotNotifiedRecently = newUsersMeta
      //   .filter((userMeta) => {!userNotifiedTooRecently(Meteor.users.findOne(userMeta.uid))})
      //   .map((userMeta) => {userMeta.uid});

      // FIXME(rlouie): should dynamically adjust based on this sunset experience, not the detectorUniqueKey
      // for now, we will give them A WORKING LINK to participate in the sunset
      // let route = "/";
      let route = `/apicustomdynamic/${iid}/${detectorUniqueKey}/`;

      // Try to notify, based on if the current need has need-specific notification info
      let needObject = incident.contributionTypes.find((need) => need.needName === needName);
      if (needObject && needObject.notificationSubject && needObject.notificationText) {
        notifyForParticipating(uidsNotNotifiedRecently, iid, needObject.notificationSubject,
          needObject.notificationText, route);
      }
      // Try to notify, based on experience-level notification info
      else if (incident.name && incident.notificationText) {
        notifyForParticipating(uidsNotNotifiedRecently, iid, `Participate in "${incident.name}"!`,
          incident.notificationText, route);
      }
      // Fail to notify, because these parameters are not defined
      else {
        log.error('notification information cannot be found in the need or experience level');
        return;
      }

      _.forEach(newUsersMeta, usermeta => {
        Notification_log.insert({
          uid: usermeta.uid,
          iid: iid,
          needName: needName,
          timestamp: Date.now()
        }, (err) => { if (err) { console.log ('error ', err); } });
      });
    });
  });
};

/**
 * Runs the OpportunisticCoordinator after a location update has occured.
 *
 * @param uid {string} user whose location just updated
 * @param userAvailability {object} object with keys as iids and values as array of matched [place, need, distance] arrays
 *    e.g., { iid : [ (place1, needName1, dist1), (place2, needName2, dist2), (place3, needName3, dist3), ... ], ... }
 * @param needDelays {object} delay before attempting to run experiences as {iid: number}
 */
//user availability = the group they are in + experience for that group
export const runCoordinatorAfterUserLocationChange = (uid, userAvailability, needDelays) => {
  // bin user need availabilities by time, and send to coordinator together
  // {
  // '10000': {
  //      'iid1': [need1, need2],
  //      'iid2': [need1]
  // },
  // '20000': {
  //      'iid1': ['need3'],
  //      'iid3': ['need1']
  // }
  // }
  let binnedUserAvailabilities = {};

  _.forEach(userAvailability, (matchingPlaceNeeds, iid) => {
    _.forEach(matchingPlaceNeeds, (individualPlace_Need_Dist) => {
      let individualNeed = individualPlace_Need_Dist[1];

      // get current delay in ms
      let currDelay = needDelays[iid][individualNeed] * 1000; // delay in ms
      let currDelayStr = currDelay.toString();

      // check if current delay bin exists
      if (!(currDelayStr in binnedUserAvailabilities)) {
        binnedUserAvailabilities[currDelayStr] = {};
      }

      // check if, for current delay, iid exists
      if (!(iid in binnedUserAvailabilities[currDelayStr])) {
        binnedUserAvailabilities[currDelayStr][iid] = [];
      }

      // add [place, need, dist] to current delay for iid
      binnedUserAvailabilities[currDelayStr][iid].push(individualPlace_Need_Dist);
    });
  });

  // create a timeout for each incident for the current user with the incident delay
  _.forEach(binnedUserAvailabilities, (currAvailabilities, delayString) => {
    let delayNumber = parseInt(delayString);

    // setup timeout to run coordinator
    Meteor.setTimeout(coordinatorWrapper(uid, currAvailabilities), delayNumber);
  });
};

/**
 * Anonymous function for setTimeout that allows parameters to be passed to coordinator loop.
 * Coordinator is only run if:
 * (1) change in location is less than updateThreshold (instead of user being stationary at location) and
 * (2) user is available to participate.
 *
 * This is due to the following edge cases:
 * - location edge case: walking around a grocery store, farmer's market, or park will cause failure if we wait for the user to be stationary, so use (1)
 * - notification edge case: being at the same place and triggering multiple updates under location alone will cause multiple timeout callbacks to be successful.
 * once notified, however, they are no longer available to participate, so check (2) when using (1) as a condition.
 *
 * @param uid {string} user whose location just updated
 * @param availabilityDictionary {object} availabilities when timeout was set as {iid: [need, need], iid: [need]}
 * @returns {Function}
 */
const coordinatorWrapper = (uid, availabilityDictionary) => () => {
  serverLog.call({message: `user ${ uid } | userAvailability: ${ JSON.stringify(availabilityDictionary) } | can participate? ${ userIsAvailableToParticipate(uid) }` });
  let currAvailabilityDictionary = undefined;

  // get latest availabilityDictionary from Locations (currentState) collection
  let currLocationUpdate = Locations.findOne({ uid: uid });
  if (currLocationUpdate) {
    currAvailabilityDictionary = currLocationUpdate.availabilityDictionary;
  }
  // get the past availabilities
  // note: stored in availabilityDictionary

  if (currAvailabilityDictionary) {
    // only run coordinator update loop if sustained match for (place, need)
    // edge case: being at the same place and triggering multiple updates under location alone will cause multiple timeout callbacks to be successful. once notified, however, they are no longer available to participate
    let userCanParticipate = userIsAvailableToParticipate(uid);
    let sustainedAvailDict = sustainedAvailabilities(availabilityDictionary, currAvailabilityDictionary);
    let somePlaceNeedsSustained = Object.keys(sustainedAvailDict).length > 0;
    if (somePlaceNeedsSustained && userCanParticipate) {
      // update availabilities of users and check if any experience incidents can be run
      let updatedAvailability = updateAvailability(uid, sustainedAvailDict);
      let incidentsWithUsersToRun = checkIfThreshold(updatedAvailability);

      // add users to incidents to be run
      runNeedsWithThresholdMet(incidentsWithUsersToRun);
    }
  }
};


