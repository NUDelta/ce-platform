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
import { Schema } from "../../schema";

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

    incidentsWithUsersToRun[incidentMapping._id] = {};
    _.forEach(incidentMapping.needUserMaps, needUserMap => {
      let strategyModule = new WhoToAssignToNeed(incidentMapping._id, needUserMap);
      let usersToAssignToNeed = strategyModule.decide(incidentMapping._id, needUserMap);
      incidentsWithUsersToRun[incidentMapping._id][needUserMap.needName] = usersToAssignToNeed;
    });
  });
  // console.log('incidentsWithUsersToRun', util.inspect(incidentsWithUsersToRun, false, null));
  return incidentsWithUsersToRun;
};

class WhoToAssignToNeed {
  constructor(incidentId, needUserMap) {
    this.iid = incidentId;
    this.needUserMap = needUserMap;
    this.needName = needUserMap.needName;
    let eid = Incidents.findOne({_id: this.iid}, {fields: {eid: true}}).eid;
    this.experience = Experiences.findOne({_id: eid});
    this.need = getNeedObject(this.iid, this.needName);
  }

  decide() {
    const usersNotInIncident = this.getUsersNotInIncident(this.needUserMap.users);
    if (this.meetsSynchronousThreshold(usersNotInIncident)) {

      // TODO(rlouie): Should revisit on being judicious about who we assign/notify; for now, let the dynamic participate
      // manage the semaphore count of how many users can take which needs
      // UPDATE 3/8/22: Choosing an available user to assign. So dynaamic participate is not doing much of the work
      let newChosenUsers = this.chooseUsers(usersNotInIncident);
      console.log('newChoosenUsers: ', util.inspect(newChosenUsers, false, null));
      // incidentsWithUsersToRun[incidentMapping._id][needUserMap.needName] = newChosenUsers;
      return newChosenUsers;
    }
  }

  getUsersNotInIncident(users) {
    if (this.experience.allowRepeatContributions) {
      return users.filter((user) => {
        return !usersAlreadyAssignedToNeed(this.iid, this.needName).find(uid => uid === user.uid);
      });
    } else {
      let uidsWhoSubmittedTooRecently = (this.experience.repeatContributionsToExperienceAfterN < 0 ?
        usersAlreadySubmittedToIncident(this.iid, null) :
        usersAlreadySubmittedToIncident(this.iid, this.experience.repeatContributionsToExperienceAfterN));
      // console.log('uidsWhoSubToIncident: ', util.inspect(uidsWhoSubToIncident, false, null));
      return users.filter((user) => {
        return (
          !usersAlreadyAssignedToNeed(this.iid, this.needName).find(uid => uid === user.uid) &&
          !usersAlreadySubmittedToNeed(this.iid, this.needName).find(uid => uid === user.uid) &&
          !uidsWhoSubmittedTooRecently.find(uid => uid === user.uid)
        );
      });
    }
  }

  /**
   * If need.situation.number == 1, it's an asynchronous experience. Only a single user needs to be available at a time.
   * If need.situation.number > 1, it's a synchronous experience and we should check if enough people are available at the same time
   * @param {*} users
   * @returns
   */
  meetsSynchronousThreshold(users) {
    return users.length >= this.need.situation.number;
  }

  chooseUsers(availableUserMetas) {
    let assignment = Assignments.findOne(this.iid);
    // console.log('assignment: ', util.inspect(assignment, false, null));
    let assignmentNeedMap = assignment.needUserMaps.find((x) => {
      return x.needName === this.needName;
    });
    let numberPeopleNeeded = numberSubmissionsRemaining(this.iid, this.needName);
    let usersWeAlreadyHave = assignmentNeedMap.users;
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
}

