import { Experiences } from "../../experiences/experiences";
import { notify } from "../../cerebro/server/methods";
import { Incidents } from "../../incidents/incidents";
import { adminUpdatesForAddingUsersToIncident, updateAvailability } from "../methods";
import { Availability } from "../availability";
import { getNeedFromIncidentId } from "../../incidents/methods";

/**
 * Sends notifications to the users, adds to the user's active experience list,
 *  marks in assignment DB 2b
 * @param incidentsWithUsersToRun {object} needs to run in format of
 *  { iid: { need: [uid, uid], need:[uid] }
 */
export const runNeedsWithThresholdMet = (incidentsWithUsersToRun) => {
  _.forEach(incidentsWithUsersToRun, (needUserMapping, iid) => {
    console.log('needUserMapping', needUserMapping);
    console.log('iid', iid);

    let incident = Incidents.findOne(iid);
    let experience = Experiences.findOne(incident.eid);
    console.log('incidents', incident);

    _.forEach(needUserMapping, (uids, needName) => {
      //administrative updates
      adminUpdatesForAddingUsersToIncident(uids, iid, needName);

      let route = 'apiCustom/' + iid + '/' + needName;
      notify(uids, iid, 'Event ' + experience.name + ' is starting!',
        experience.notificationText, route);
    });
  });
};


/**
 * Runs the coordinator after a location update has occured.
 *
 * @param uid {string} user whose location just updated
 * @param availabilityDictionary {object} current availabilities as {iid: [need, need], iid: [need]}
 */
export const runCoordinatorAfterUserLocationChange = (uid, availabilityDictionary) => {
  // update availabilities of users and check if any experience incidents can be run
  let updatedAvailability = updateAvailability(uid, availabilityDictionary);
  console.log('updatedAvailability', updatedAvailability[0].needUserMaps);

  let incidentsWithUsersToRun = checkIfThreshold(updatedAvailability);
  console.log('incidentsWithUsersToRun', incidentsWithUsersToRun);

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
const checkIfThreshold = (updatedIncidentsAndNeeds) => {
  //these are not needUsermaps
  console.log('updatedIncidentsAndNeeds', updatedIncidentsAndNeeds[0]);

  let incidentsWithUsersToRun = {};
  _.forEach(updatedIncidentsAndNeeds, (incidentMapping) => {
    incidentsWithUsersToRun[incidentMapping.iid] = {};

    _.forEach(incidentMapping.needUserMaps, (needUserMap) => {
      // get need object for current iid/current need and number of people
      console.log('needUserMap', incidentMapping.needUserMaps);

      let needObject = getNeedFromIncidentId(incidentMapping.iid, needUserMap.needName);
      let numberPeopleNeeded = needObject.numberNeeded;
      console.log('needObject', needObject);

      console.log('numbers', needUserMap.uids.length, numberPeopleNeeded);
      if (needUserMap.uids.length > numberPeopleNeeded) {
        incidentsWithUsersToRun[incidentMapping.iid][needUserMap.needName] = needUserMap.uids.slice(numberPeopleNeeded);
      } else {
        incidentsWithUsersToRun[incidentMapping.iid][needUserMap.needName] = needUserMap.uids;
      }
    });
  });

  console.log('incidentsWithUsersToRun', incidentsWithUsersToRun);

  return incidentsWithUsersToRun; //{iid: {need: [uid, uid], need: [uid]}}
};

// //TODO: THIS IS DUMB, remove, oops...
// /**
//  * Given a set of users, it chooses a subset of the given number
//  *  based on how many other experiences users are available for.
//  *
//  * @param uids {[string]} uids available for the incident
//  * @param numberPeopleNeeded {int} number of users we need to choose for the incident
//  * @returns {[string]} uids chosen for the incident
//  */
// const chooseUsers = (uids, numberPeopleNeeded) => {
//   let userPopularityMap = {};
//   _.forEach(uids, (uid) => {
//     userPopularityMap[uid] = Availability.find({
//       'needUserMaps': {
//         '$elemMatch': {
//           'uids': uid
//         }
//       }
//     }).count();
//   });
//
//   uids.sort(function (a, b) {
//     return userPopularityMap[a] > userPopularityMap[b];
//   });
//
//   return uids.slice(0, numberPeopleNeeded);
// };
