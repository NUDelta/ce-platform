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
import { createBrotliCompress } from "zlib";

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

    let anytimeStrategy = new AnytimeStrategizer(incidentMapping._id);

    incidentsWithUsersToRun[incidentMapping._id] = {};
    _.forEach(incidentMapping.needUserMaps, needUserMap => {

      let findContributionsForNeed;
      if (anytimeStrategy.isAnytimeExperience()) {
        if (anytimeStrategy.decide(needUserMap)) {
          findContributionsForNeed = true;
        } else {
          findContributionsForNeed = false;
          console.log('---- not running anytime need: ', needUserMap.needName);
        }
      } else {
        findContributionsForNeed = true;
      }
      if (findContributionsForNeed) {
        let strategyModule = new WhoToAssignToNeed(incidentMapping._id, needUserMap);
        let usersToAssignToNeed = strategyModule.decide(incidentMapping._id, needUserMap);
        console.log('these are the usersToAssignToNeed: ', util.inspect(usersToAssignToNeed, false, null));
        incidentsWithUsersToRun[incidentMapping._id][needUserMap.needName] = usersToAssignToNeed;
      }
    });
  });
  // console.log('incidentsWithUsersToRun', util.inspect(incidentsWithUsersToRun, false, null));
  return incidentsWithUsersToRun;
};

class AnytimeStrategizer {
  constructor(incidentId) {
    this.iid = incidentId;
    let eid = Incidents.findOne({_id: this.iid}, {fields: {eid: true}}).eid;
    this.experience = Experiences.findOne({_id: eid});
    this.need = getNeedObject(this.iid, this.needName);
  }

  isAnytimeExperience() {
    return this.experience.anytimeSequential !== null;
  }

  decide(needUserMap) {
    if (this.experience.anytimeSequential === null) {
      return true;
    }
    const currentBucketedNeeds = this.defineSequentialBuckets();
    // which bucket is this need in?
    const bucketIndex = currentBucketedNeeds.findIndex(bucket => bucket.includes(needUserMap.needName));
    // does this bucket have other completed needs?
    const bucketHasCompletedNeeds = currentBucketedNeeds[bucketIndex].map(needName => {
      let needWasCompleted = Submissions.find({
        iid: this.iid,
        needName: needName,
        uid: {$ne: null}
      }).count() > 0;
      return needWasCompleted;
    }).some(needWasCompleted => needWasCompleted);

    // if this bucket has completed needs, then don't get anymore
    return !bucketHasCompletedNeeds;

  }

  defineSequentialBuckets() {
    if (this.experience.anytimeSequential === null) {
      console.error('No anytime constraint defined for this experience');
      return;
    }
    // Which "day" of the experience are we in?
    let iteration = 1;
    let currentBucketedNeeds = this.defineNeedBuckets(this.experience.anytimeSequential.startingBuckets)
    while (this.bucketsAreAllFilled(currentBucketedNeeds)) {
      iteration++;
      currentBucketedNeeds = this.defineNeedBuckets(iteration * this.experience.anytimeSequential.startingBuckets);
    }
    return currentBucketedNeeds;
  }

  defineNeedBuckets(numberBuckets) {
    const needs = this.experience.contributionTypes.map(contributionType => {
      return contributionType.needName;
    })
    let bucketSize = Math.floor(needs.length / numberBuckets);
    let lastBucketSize = bucketSize;
    lastBucketSize += needs.length % bucketSize;
    let bucketedNeeds = [];
    for (let i = 0; i < numberBuckets; i++) {
      if (i === numberBuckets - 1) {
        bucketedNeeds.push(
          needs.slice(i*bucketSize, i*bucketSize + lastBucketSize))
      } else {
        bucketedNeeds.push(
          needs.slice(i*bucketSize, (i+1)*bucketSize))
      }
    }
    return bucketedNeeds;
  }

  bucketsAreAllFilled(currentBucketedNeeds) {
    // for each bucket, check if anyone completed it
    let bucketsThatAreFilled = currentBucketedNeeds.map(needsInBucket => {
      let needsHaveCompletedSubmissions = needsInBucket.map(needName => {
        return Submissions.find({
          iid: this.iid,
          needName: needName,
          uid: {$ne: null}
        }).count();
      });
      let bucketIsFilled = needsHaveCompletedSubmissions.some(numberSubmissions => numberSubmissions > 0 );
      return bucketIsFilled;
    });
    return bucketsThatAreFilled.every(bucketIsFilled => bucketIsFilled);
  }

}



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
      // console.log('newChoosenUsers: ', util.inspect(newChosenUsers, false, null));
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
      // using https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array#answer-46545530
      let chosen = availableUserMetas
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
        .splice(0, dif);
      return chosen;
    }
  };
}

