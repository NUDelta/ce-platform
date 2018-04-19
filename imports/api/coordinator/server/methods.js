import { Meteor } from "meteor/meteor";
import { Experiences } from "../../experiences/experiences";
import { notify, notifyForParticipating } from "../../cerebro/server/methods";
import { Incidents } from "../../incidents/incidents";
import {
  adminUpdatesForAddingUsersToIncident,
  getNeedObject,
  updateAvailability
} from "../methods";
import { Availability } from "../availability";
import { getNeedFromIncidentId } from "../../incidents/methods";
import { Submissions } from "../../submissions/submissions";
import { Assignments } from "../assignments";
import { Notification_log } from "../notification_log";

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
      notifyForParticipating(
        newUsersUids,
        iid,
        "Event " + experience.name + " is starting!",
        experience.notificationText,
        route
      );
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
 * Runs the coordinator after a location update has occured.
 *
 * @param uid {string} user whose location just updated
 * @param availabilityDictionary {object} current availabilities as {iid: [need, need], iid: [need]}
 */
export const runCoordinatorAfterUserLocationChange = (
  uid,
  availabilityDictionary
) => {
  // update availabilities of users and check if any experience incidents can be run
  let updatedAvailability = updateAvailability(uid, availabilityDictionary);

  let incidentsWithUsersToRun = checkIfThreshold(updatedAvailability);

  // add users to incidents to be run
  runNeedsWithThresholdMet(incidentsWithUsersToRun);
};

/**
 * Check if an experience need can run e.g. it has the required number of people.
 * This may call other functions that, for example, check for relationship, co-located, etc.
 *
 * @param updatedIncidentsAndNeeds {[object]} array of object from Availability DB
 *  [{iid: string, needs: [{needName: string, users: [uid]}]] TODO: update this description
 * @returns {{ iid: {need: [uid, uid], need: [uid] } } }
 */
const checkIfThreshold = updatedIncidentsAndNeeds => {
  //these are not needUsermaps

  let incidentsWithUsersToRun = {};

  _.forEach(updatedIncidentsAndNeeds, incidentMapping => {
    let assignment = Assignments.findOne(incidentMapping.iid);
    let usersInIncident = [].concat.apply(
      [],
      assignment.needUserMaps.map(function(needMap) {
        return needMap.uids;
      })
    );

    incidentsWithUsersToRun[incidentMapping.iid] = {};
    _.forEach(incidentMapping.needUserMaps, needUserMap => {
      // get need object for current iid/current need and number of people

      let iid = incidentMapping.iid;
      let needName = needUserMap.needName;
      //get need object

      let need = getNeedObject(iid, needName);

      let previousUsers = Submissions.find({
        iid: incidentMapping.iid,
        needName: needName
      })
        .fetch()
        .map(function(x) {
          return x.uid;
        });

      let usersNotInIncident = needUserMap.uids.filter(function(x) {
        return !usersInIncident.includes(x) && !previousUsers.includes(x);
      });

      let assignmentNeed = assignment.needUserMaps.find(function(x) {
        return x.needName === needName;
      });

      if (assignmentNeed.uids.length === 0) {
        if (usersNotInIncident.length >= need.situation.number) {
          let newChosenUsers = chooseUsers(
            usersNotInIncident,
            iid,
            assignmentNeed
          );
          usersInIncident = usersInIncident.concat(newChosenUsers);
          incidentsWithUsersToRun[incidentMapping.iid][
            needUserMap.needName
          ] = newChosenUsers;
        }
      }
    });
  });
  return incidentsWithUsersToRun; //{iid: {need: [uid, uid], need: [uid]}}
};

const chooseUsers = (availableUids, iid, needUserMap) => {
  let numberPeopleNeeded = Submissions.find({
    iid: iid,
    needName: needUserMap.needName,
    uid: null
  }).count();

  let usersWeAlreadyHave = needUserMap.uids;

  if (usersWeAlreadyHave.length === numberPeopleNeeded) {
    return [];
  } else if (usersWeAlreadyHave.length > numberPeopleNeeded) {
    console.log("WHY IS THIS HAPPENING ERRORRORO");
    return [];
  } else {
    let dif = numberPeopleNeeded - usersWeAlreadyHave.length;

    let chosen = availableUids.splice(0, dif);
    return chosen;
  }
};
