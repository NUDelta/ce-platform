import { Submissions } from "../../OCEManager/currentNeeds";
import { Assignments } from "../databaseHelpers";
import { getNeedObject } from "./identifier";
const util = require('util');

/**
 * Check if an experience need can run e.g. it has the required number of people.
 * This may call other functions that, for example, check for relationship, co-located, etc.
 *
 * @param updatedIncidentsAndNeeds {[object]} array of object from Availability DB
 *  [
 *    {
 *      _id: string,
 *      needUserMaps: [
 *        {
 *          needName: string,
 *          users: [
 *            {uid: uid, place: place, distance: distance}
 *          ]
 *        }
 *      ]
 *    }
 *  ]
 *
 * @returns incidentsWithUsersToRun {object} needs to run in format of
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
export const checkIfThreshold = updatedIncidentsAndNeeds => {
  //these are not needUsermaps
  // console.log('input to checkIfThreshold: ', util.inspect(updatedIncidentsAndNeeds, false, null));

  let incidentsWithUsersToRun = {};

  _.forEach(updatedIncidentsAndNeeds, incidentMapping => {
    // console.log('incidentMapping: ', util.inspect(incidentMapping, false, null));
    let assignment = Assignments.findOne(incidentMapping._id);
    // console.log('assignment: ', util.inspect(assignment, false, null));
    let usersInIncident = [].concat.apply(
      [],
      assignment.needUserMaps.map(function(needMap) {
        return needMap.users;
      })
    );
    // console.log('usersInIncident: ', util.inspect(usersInIncident, false, null));

    incidentsWithUsersToRun[incidentMapping._id] = {};
    _.forEach(incidentMapping.needUserMaps, needUserMap => {
      // get need object for current iid/current need and number of people

      let iid = incidentMapping._id;
      let needName = needUserMap.needName;
      //get need object

      let need = getNeedObject(iid, needName);

      // console.log('need: ', util.inspect(need, false, null));
      // Start by never keeping track of previous user submissions to the incident
      let previousUids = [];

      // If we are not allowing repeat contributions, then do look at previous user submissions
      if (!need.allowRepeatContributions) {
        previousUids = Submissions.find({
          iid: incidentMapping._id,
          needName: needName
        })
          .fetch()
          .map(function(x) {
            return x.uid;
          });
      }
      // console.log('previousUids: ', util.inspect(previousUids, false, null));

      let usersNotInIncident = needUserMap.users.filter(function(user) {
        return !usersInIncident.find(x => x.uid === user.uid) && !previousUids.find(uid => uid === user.uid);
      });
      // console.log('usersNotInIncident: ', util.inspect(usersNotInIncident, false, null));

      let assignmentNeed = assignment.needUserMaps.find(function(x) {
        return x.needName === needName;
      });
      // console.log('assignmentNeed: ', util.inspect(assignmentNeed, false, null));

      if (assignmentNeed.users.length === 0) {
        if (usersNotInIncident.length >= need.situation.number) {
          let newChosenUsers = chooseUsers(
            usersNotInIncident,
            iid,
            assignmentNeed
          );
          // console.log('newChoosenUsers: ', util.inspect(newChosenUsers, false, null));
          usersInIncident = usersInIncident.concat(newChosenUsers);
          incidentsWithUsersToRun[incidentMapping._id][
            needUserMap.needName
            ] = newChosenUsers;
        }
      }
    });
  });
  // console.log('incidentsWithUsersToRun', util.inspect(incidentsWithUsersToRun, false, null));
  return incidentsWithUsersToRun;
};

const chooseUsers = (availableUserMetas, iid, needUserMap) => {
  let numberPeopleNeeded = Submissions.find({
    iid: iid,
    needName: needUserMap.needName,
    uid: null
  }).count();

  let usersWeAlreadyHave = needUserMap.users;

  if (usersWeAlreadyHave.length === numberPeopleNeeded) {
    return [];
  } else if (usersWeAlreadyHave.length > numberPeopleNeeded) {
    console.log("WHY IS THIS HAPPENING ERRORRORO");
    return [];
  } else {
    let dif = numberPeopleNeeded - usersWeAlreadyHave.length;

    let chosen = availableUserMetas.splice(0, dif);
    return chosen;
  }
};
