/**
 * strategizer -- server side
 */
import {Submissions} from "../../OCEManager/currentNeeds";
import {Assignments} from "../databaseHelpers";
import {getNeedObject} from "./identifier";
import {Experiences, Incidents} from "../../OCEManager/OCEs/experiences";
import {createIncidentFromExperience, startRunningIncident} from "../../OCEManager/OCEs/methods";
import {CONSTANTS} from "../../Testing/testingconstants";
import {Meteor} from "meteor/meteor";
import {
  numberSubmissionsRemaining,
  usersAlreadyAssignedToNeed,
  usersAlreadySubmittedToIncident,
  usersAlreadySubmittedToNeed
} from "../strategizer";

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

    incidentsWithUsersToRun[incidentMapping._id] = {};
    _.forEach(incidentMapping.needUserMaps, needUserMap => {
      // get need object for current iid/current need and number of people

      let iid = incidentMapping._id;
      let needName = needUserMap.needName;
      let eid = Incidents.findOne({_id: iid}, {fields: {eid: true}}).eid;

      const exp = Experiences.findOne({_id: eid});
      let need = getNeedObject(iid, needName);
      // console.log('need: ', util.inspect(need, false, null));

      let uidsWhoSubToIncident = (exp.repeatContributionsToExperienceAfterN < 0 ?
        usersAlreadySubmittedToIncident(iid, null) :
        usersAlreadySubmittedToIncident(iid, exp.repeatContributionsToExperienceAfterN));
      // console.log('uidsWhoSubToIncident: ', util.inspect(uidsWhoSubToIncident, false, null));

      let uidsInNeed = usersAlreadyAssignedToNeed(iid, needName);
      // console.log('uidsInNeed: ', util.inspect(uidsInNeed, false, null));

      let uidsWhoSubToNeed = (need.allowRepeatContributions ? [] : usersAlreadySubmittedToNeed(iid, needName));
      // console.log('uidsWhoSubToNeed : ', util.inspect(uidsWhoSubToNeed, false, null));

      //what should really be done here is change the usersAlreadySubmittedToIncident
      //to allow the second part of the conditional to work at all times
      //but i am doing a quick hack
      let usersNotInIncident;
      if (exp.allowRepeatContributions){
      usersNotInIncident = needUserMap.users.filter(function(user) {
        return (!uidsInNeed.find(uid => uid === user.uid) &&
          !uidsWhoSubToNeed.find(uid => uid === user.uid));
        });
      } else {
        usersNotInIncident = needUserMap.users.filter(function(user) {
          return (!uidsInNeed.find(uid => uid === user.uid) &&
            !uidsWhoSubToNeed.find(uid => uid === user.uid) &&
            !uidsWhoSubToIncident.find(uid => uid === user.uid));
        });
      }

      // console.log('usersNotInIncident: ', util.inspect(usersNotInIncident, false, null));

      // check for synchronous needs (need.situation.number >= 2)
      if (usersNotInIncident.length >= need.situation.number) {
        //  incidentsWithUsersToRun[incidentMapping._id][needUserMap.needName] = usersNotInIncident;

        //  TODO(rlouie): Should revisit on being judicious about who we assign/notify; for now, let the dynamic participate
           //  manage the semaphore count of how many users can take which needs
        let assignmentNeed = assignment.needUserMaps.find(function(x) {
          return x.needName === needName;
        });
        let newChosenUsers = chooseUsers(
          usersNotInIncident,
          iid,
          assignmentNeed
        );
        console.log('newChoosenUsers: ', util.inspect(newChosenUsers, false, null));
        incidentsWithUsersToRun[incidentMapping._id][needUserMap.needName] = newChosenUsers;
      }
    });
  });
  console.log('incidentsWithUsersToRun', util.inspect(incidentsWithUsersToRun, false, null));
  return incidentsWithUsersToRun;
};

/** my mutex, but not dynamic on page load, but does it during the first assignment (for notification) **/
const chooseUsers = (availableUserMetas, iid, needUserMap) => {
  let numberPeopleNeeded = numberSubmissionsRemaining(iid, needUserMap.needName);

  let usersWeAlreadyHave = needUserMap.users;

  if (usersWeAlreadyHave.length === numberPeopleNeeded) {
    return [];
  } else if (usersWeAlreadyHave.length > numberPeopleNeeded) {
    return [];
  } else {
    let dif = numberPeopleNeeded - usersWeAlreadyHave.length;

    let chosen = availableUserMetas.splice(0, dif);
    return chosen;
  }
};
