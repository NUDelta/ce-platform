import { Meteor } from "meteor/meteor";
import { Experiences } from "../../OCEManager/OCEs/experiences";
import { Incidents } from "../../OCEManager/OCEs/experiences";
import { Locations } from "../../UserMonitor/locations/locations";

import { notifyForParticipating } from "./noticationMethods";
import { adminUpdatesForAddingUsersToIncident, updateAvailability } from "../identifier";
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
 */
export const runCoordinatorAfterUserLocationChange = (uid, userAvailability, incidentDelays) => {
  serverLog.call({message: `setting up timeout for ${ uid }, ${ JSON.stringify(userAvailability) }`});

  // create a timeout for each incident for the current user with the incident delay
  _.forEach(userAvailability, (needs, iid) => {
    // setup availability dict to pass in
    let currUserAvailability = {};
    currUserAvailability[iid] = needs;

    // get current delay in ms
    let currDelay = incidentDelays[iid] * 1000;

    // get the current time when the update loop is initializing
    let currLocationTimestamp = undefined;
    const userLocation = Locations.findOne({ uid: uid });

    if (userLocation) {
     currLocationTimestamp = userLocation.timestamp;
    }

    // setup timeout to run coordinator
    Meteor.setTimeout(
      coordinatorWrapper(uid, currUserAvailability, currLocationTimestamp), currDelay);
  });
};

/**
 * Anonymous function for setTimeout that allows parameters to be passed to coordinator loop
 *
 * @param uid {string} user whose location just updated
 * @param availabilityDictionary {object} current availabilities as {iid: [need, need], iid: [need]}
 * @param lastUpdateTimestamp {date} timestamp of location update when function was setup
 * @returns {Function}
 */
const coordinatorWrapper = (uid, availabilityDictionary, lastUpdateTimestamp) => () => {
  serverLog.call({message: `updating for ${ uid }, ${ JSON.stringify(availabilityDictionary) }`});

  // get current location update and see if time is valid
  let currUpdateTimestamp = undefined;
  let currLocationUpdate = Locations.findOne({ uid: uid });

  if (currLocationUpdate) {
    currUpdateTimestamp = currLocationUpdate.timestamp;
  }

  // check if timestamps are valid
  serverLog.call({ message: `lastUpdateTimestamp: ${ lastUpdateTimestamp }, currUpdateTimestamp: ${ currUpdateTimestamp }`});
  if (lastUpdateTimestamp && currUpdateTimestamp) {
    serverLog.call({ message: `lastUpdateTimestamp: ${ currUpdateTimestamp.getTime() }, currUpdateTimestamp: ${ lastUpdateTimestamp.getTime() }`});

    // only run coordinator update loop if the there hasn't been a location update
    // timestamp passed in should be the same as the timestamp just fetched
    if (currUpdateTimestamp.getTime() === lastUpdateTimestamp.getTime()) {
      serverLog.call({message: 'beginning update loop'});
      // update availabilities of users and check if any experience incidents can be run
      let updatedAvailability = updateAvailability(uid, availabilityDictionary);
      let incidentsWithUsersToRun = checkIfThreshold(updatedAvailability);

      // add users to incidents to be run
      runNeedsWithThresholdMet(incidentsWithUsersToRun);
    }
  }
};



