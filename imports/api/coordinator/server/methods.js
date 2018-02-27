import { Meteor } from  'meteor/meteor'
import { Experiences } from "../../experiences/experiences";
import { notify } from "../../cerebro/server/methods";
import { Incidents } from "../../incidents/incidents";
import { adminUpdatesForAddingUsersToIncident, updateAvailability } from "../methods";
import { Availability } from "../availability";
import { getNeedFromIncidentId } from "../../incidents/methods";
import {Submissions} from "../../submissions/submissions";
import {Assignments} from "../assignments";

/**
 * Sends notifications to the users, adds to the user's active experience list,
 *  marks in assignment DB 2b
 * @param incidentsWithUsersToRun {object} needs to run in format of
 *  { iid: { need: [uid, uid], need:[uid] }
 */
export const runNeedsWithThresholdMet = (incidentsWithUsersToRun) => {
  _.forEach(incidentsWithUsersToRun, (needUserMapping, iid) => {
    let incident = Incidents.findOne(iid);
    let experience = Experiences.findOne(incident.eid);

    _.forEach(needUserMapping, (uids, needName) => {

      let newUsersUids = uids.filter(function(uid){
        return ! Meteor.users.findOne(uid).profile.activeIncidents.includes(iid);
      });

      //administrative updates
      adminUpdatesForAddingUsersToIncident(newUsersUids, iid, needName);

      let route = 'apiCustom/' + iid + '/' + needName;
      notify(newUsersUids, iid, 'Event ' + experience.name + ' is starting!',
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

      let iid = incidentMapping.iid;
      let needName =  needUserMap.needName;

      console.log("about to choose our users!!!");
      let chosenUsers = chooseUsers(needUserMap.uids, iid, needName);
      incidentsWithUsersToRun[incidentMapping.iid][needUserMap.needName] = chosenUsers;
      console.log("the choosen users are", chosenUsers)
    });
  });
  console.log('incidentsWithUsersToRun', incidentsWithUsersToRun);
  return incidentsWithUsersToRun; //{iid: {need: [uid, uid], need: [uid]}}
};

const chooseUsers = (availableUids, iid, needName) => {

  let numberPeopleNeeded = Submissions.find({iid: iid, needName: needName, uid: null}).count();
  let assignment = Assignments.findOne(iid);

  let needMap = assignment.needUserMaps.find(function(needMap){
    return needMap.needName === needName;
  });

  let usersWeAlreadyHave = needMap.uids;

  if (usersWeAlreadyHave.length === numberPeopleNeeded){
    console.log("we have all the users we need which is ",usersWeAlreadyHave.length,numberPeopleNeeded);
    return [];
  } else if (usersWeAlreadyHave.length > numberPeopleNeeded){
    console.log("WHY IS THIS HAPPENING ERRORRORO");
    return [];
  } else{
    let dif = numberPeopleNeeded - usersWeAlreadyHave.length;

    let newUsers = availableUids.filter(function(x){
      return !usersWeAlreadyHave.includes(x);
    });

    console.log("we need ", dif, "more people");
    console.log("new users are", newUsers);
    let chosen = newUsers.splice(0, dif);
    console.log("therefore we pick", chosen);

    return chosen;
  }
};
