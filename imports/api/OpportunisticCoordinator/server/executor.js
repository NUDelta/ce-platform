import { Meteor } from "meteor/meteor";
import { Experiences } from "../../OCEManager/OCEs/experiences";
import { Incidents } from "../../OCEManager/OCEs/experiences";
import { Locations } from "../../UserMonitor/locations/locations";

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
    let incident = Incidents.findOne(iid);
    let experience = Experiences.findOne(incident.eid);

    _.forEach(needUserMapping, (usersMeta, needName) => {
      let newUsersMeta = usersMeta.filter(function(userMeta) {
        return !Meteor.users.findOne(userMeta.uid).profile.activeIncidents.includes(iid);
      });

      //administrative updates
      _.forEach(newUsersMeta, (userMeta) => {
        adminUpdatesForAddingUserToIncident(userMeta.uid, iid, needName);
      });

      // S19: DO NOT FILTER BY NOTIFIED TOO RECENTLY
      // let userMetasNotNotifiedRecently = newUsersMeta.filter((userMeta) => {
      //   return !userNotifiedTooRecently(Meteor.users.findOne(userMeta.uid));
      // });

      let uidsNotNotifiedRecently = newUsersMeta.map(usermeta => usermeta.uid);
      let route = "/";
      notifyForParticipating(uidsNotNotifiedRecently, iid, `Participate in "${experience.name}"!`,
        experience.notificationText, route);

      _.forEach(newUsersMeta, usermeta => {
        Notification_log.insert({
          uid: usermeta.uid,
          iid: iid,
          needName: needName,
          timestamp: Date.now()
        });
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

  serverLog.call({message: `user ${ uid } | binned availabilities: ${ JSON.stringify(binnedUserAvailabilities) }`});

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


