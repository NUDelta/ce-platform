import { Meteor } from "meteor/meteor";
import { Experiences } from "../../OCEManager/OCEs/experiences";
import { Incidents } from "../../OCEManager/OCEs/experiences";
import { Locations } from "../../UserMonitor/locations/locations";

import { notifyForParticipating } from "./noticationMethods";
import { adminUpdatesForAddingUsersToIncident, updateAvailability } from "../identifier";
import { distanceBetweenLocations, userIsAvailableToParticipate} from "../../UserMonitor/locations/methods";
import { checkIfThreshold } from "./strategizer";
import { Notification_log } from "../../Logging/notification_log";
import { serverLog } from "../../logs";

/**
 * Sends notifications to the users, adds to the user's active experience list,
 *  marks in assignment DB 2b
 * @param incidentsWithUsersToRun {object} needs to run in format of
 *  { iid: { need: [uid, uid], need:[uid] }
 */
export const runNeedsWithThresholdMet = incidentsWithUsersToRun => {
  _.forEach(incidentsWithUsersToRun, (needUserMapping, iid) => {
    let incident = Incidents.findOne(iid);
    let experience = Experiences.findOne(incident.eid);

    _.forEach(needUserMapping, (uids, needName) => {
      let newUsersUids = uids.filter(function(uid) {
        return !Meteor.users.findOne(uid).profile.activeIncidents.includes(iid);
      });

      //administrative updates
      adminUpdatesForAddingUsersToIncident(newUsersUids, iid, needName);

      let route = "apiCustom/" + iid + "/" + needName;
      notifyForParticipating(newUsersUids, iid, "Event " + experience.name + " is starting!",
        experience.notificationText, route);

      _.forEach(newUsersUids, uid => {
        Notification_log.insert({
          uid: uid,
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
 * @param userAvailability {object} current availabilities as {iid: [need, need], iid: [need]}
 * @param incidentDelays {object} delay before attempting to run experiences as {iid: number}
 * @param currLocation {object} current location of user when timeout as object with latitude/longitude keys and float values.
 */
export const runCoordinatorAfterUserLocationChange = (uid, userAvailability, incidentDelays, currLocation) => {
  // bin user need availabilities by time, and send to coordinator together
  // { '10000': { 'iid1': [need1, need2], 'iid2': [need1] }, '20000': { 'iid1': ['need1'], 'iid3': ['need1'] } }
  let binnedUserAvailabilities = {};

  _.forEach(userAvailability, (needs, iid) => {
    _.forEach(needs, (individualNeed) => {
      // get current delay in ms
      let currDelay = incidentDelays[iid][individualNeed] * 1000; // delay in ms
      let currDelayStr = currDelay.toString();

      // check if current delay bin exists
      if (!(currDelayStr in binnedUserAvailabilities)) {
        binnedUserAvailabilities[currDelayStr] = {};
      }

      // check if, for current delay, iid exists
      if (!(iid in binnedUserAvailabilities[currDelayStr])) {
        binnedUserAvailabilities[currDelayStr][iid] = [];
      }

      // add need to current delay for iid
      binnedUserAvailabilities[currDelayStr][iid].push(individualNeed);
    });
  });

  serverLog.call({message: `user ${ uid } | binned availabilities: ${ JSON.stringify(binnedUserAvailabilities) }`});

  // create a timeout for each incident for the current user with the incident delay
  _.forEach(binnedUserAvailabilities, (currAvailabilities, delayString) => {
    let delayNumber = parseInt(delayString);

    // setup timeout to run coordinator
    Meteor.setTimeout(coordinatorWrapper(uid, currAvailabilities, currLocation), delayNumber);
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
 * @param availabilityDictionary {object} current availabilities as {iid: [need, need], iid: [need]}
 * @param lastLocation {object} location of user when timeout was set as object with
 *    latitude/longitude keys and float values.
 * @returns {Function}
 */
const coordinatorWrapper = (uid, availabilityDictionary, lastLocation) => () => {
  serverLog.call({message: `user ${ uid } | userAvailability: ${ JSON.stringify(availabilityDictionary) } | can participate? ${ userIsAvailableToParticipate(uid) }` });
  // get current location update of user
  let currLocation = undefined;
  let updateThreshold = 10.0; // distance between updates must be at most 10 meters

  let currLocationUpdate = Locations.findOne({ uid: uid });
  if (currLocationUpdate) {
    currLocation = {
      'latitude': currLocationUpdate.lat,
      'longitude': currLocationUpdate.lng
    };
  }

  // check if a valid last and current location update are present
  if (lastLocation && currLocation) {
    // only run coordinator update loop if:
    // (1) change in location is less than updateThreshold and
    // (2) user is available to participate
    // edge case: walking around in a place like a farmer's market will cause failure
    // edge case: being at the same place and triggering multiple updates under location alone will cause multiple timeout callbacks to be successful. once notified, however, they are no longer available to participate
    let distanceBetweenUpdates = distanceBetweenLocations(lastLocation, currLocation);
    let userCanParticipate = userIsAvailableToParticipate(uid);

    if (distanceBetweenUpdates <= updateThreshold && userCanParticipate) {
      // update availabilities of users and check if any experience incidents can be run
      let updatedAvailability = updateAvailability(uid, availabilityDictionary);
      let incidentsWithUsersToRun = checkIfThreshold(updatedAvailability);

      // add users to incidents to be run
      runNeedsWithThresholdMet(incidentsWithUsersToRun);
    }
  }
};



