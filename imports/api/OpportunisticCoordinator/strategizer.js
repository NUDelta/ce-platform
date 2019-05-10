/**
 * strategizer -- server+client side
 */
import {Assignments, Availability, ParticipatingNow} from "./databaseHelpers";
import {Submissions} from "../OCEManager/currentNeeds";


/**
 * usersAlreadyAssignedToNeed
 *
 * Returns
 * @param iid
 * @param needName
 * @return usersInNeed [Array] array of uids
 */
export const usersAlreadyAssignedToNeed = (iid, needName) => {
  let assignment = Assignments.findOne(iid);
  let assignmentNeedMap = assignment.needUserMaps.find(function (x) {
    return x.needName === needName;
  });
  return assignmentNeedMap.users;
};


/**
 * usersAlreadySubmittedToNeed
 *
 * @param iid
 * @param needName
 * @return previousUids [Array] array of uids
 */
export const usersAlreadySubmittedToNeed = (iid, needName) => {
  let previousUids = Submissions.find({
    iid: iid, needName: needName
  }).map(function (x) {
    return x.uid;
  });
  return previousUids;
};


/**
 * needAggregator
 *
 * Helper for Dynamic Loading of Exact Participate Need
 * Looks at the need.situation.detectors of an incident,
 * returns the needNames should be aggregated
 * @param incident, result of a Incident.findOne call
 */
export const needAggregator = (incident) => {
  // keys: detectors
  // values: needs
  let res = {};
  _.forEach(incident.contributionTypes, (need) => {
    if (res[need.situation.detector]) {
      res[need.situation.detector].push(need.needName);
    }
    else {
      res[need.situation.detector] = [need.needName];
    }
  });
  return res;
};

/**
 * needA will be given a higher value in the sorting, if needA has fewer submissions left
 * (e.g., a photo that needs 1 more person to complete it will be ranked higher)
 * TODO(rlouie): What about the case where some needs have 1 out of 2 more needed,
 *               while others just need 1 out of 1 submission to complete?
 * @param needA
 * @param needB
 * @return {number}
 */
export const prioritizeHalfCompletedNeeds = (needA, needB) => {
  return numberSubmissionsRemaining(this.iid, needB) - numberSubmissionsRemaining(this.iid, needA);
};

/**
 * numberSubmissionsNeeded
 *
 * @param iid
 * @param needName
 * @return {any | * | IDBRequest | void}
 */
export const numberSubmissionsRemaining = (iid, needName) => {
  let numSubsNeeded = Submissions.find({
    iid: iid,
    needName: needName,
    uid: null
  }).count();
  if (!Number.isInteger(numSubsNeeded)) {
    throw `Error in numSubmissionsNeeded: numSubsNeeded is not an Integer`;
  }
  return numSubsNeeded;
};

export const needIsAvailableToParticipateNow = (incident, needName) => {
  if (!incident.contributionTypes) {
    throw `Error in needAggregator: incident does not have contribution types\n ${JSON.stringify(incident)}`;
  }
  const needObject = incident.contributionTypes.find(need => need.needName == needName);
  const numberNeeded = numberSubmissionsRemaining(incident._id, needName);
  const semaphoreMax = needObject.numberAllowedToParticipateAtSameTime ?
    needObject.numberAllowedToParticipateAtSameTime : numberNeeded;
  const resourcesStillAvailable = numberUsersParticipatingNow(incident._id, needName) < semaphoreMax;
  return resourcesStillAvailable;
};

/**
 * numberUsersParticipatingNow
 *
 * @param iid
 * @param needName
 */
export const numberUsersParticipatingNow = (iid, needName) => {
  let participatingNowInIncident = ParticipatingNow.findOne({_id: iid});
  if (!Array.isArray(participatingNowInIncident.needUserMaps)) {
    console.error(`Error in numberUsersParticipatingNow: participatingNowInIncident.needUserMaps is not an array`);
    return;
  }
  let needMap = participatingNowInIncident.needUserMaps.find(needUserMap => needUserMap.needName == needName);
  if (!Array.isArray(needMap.users)) {
    console.error(`Error in numUsersParticipatingNow: needMap.users is not an array`);
    return;
  }
  return needMap.users.length;
};

/**
 * pushUserIntoParticipatingNowNeedUserMaps
 *
 * The list of users in each needUserMap is a counter for who has the participate route open
 * This function increments this "semaphore" like counter, or adds users
 * @param iid
 * @param needName
 * @param uid
 * @param place
 * @param distance
 */
export const pushUserIntoParticipatingNowNeedUserMaps = (iid, needName, uid) => {
  ParticipatingNow.update(
    {
      _id: iid
    },
    {
      $push: {
        // note: this object is different than {"uid": uid, "place": place, "distance": distance}
        "needUserMaps.$.users": {
          "uid": uid
        }
      }
    }
  );
};


/**
 * pullUserFromParticipatingNowNeedUserMaps
 *
 * The list of users in each needUserMap is a counter for who has the participate route open
 * This function decrements this "semaphore" like counter, or removes users
 * @param iid
 * @param needName
 * @param uid
 */
export const pullUserFromParticipatingNowNeedUserMaps = (iid, needName, uid) => {
  ParticipatingNow.update(
    {
      _id: iid
    },
    {
      $pull: { "needUserMaps.$.users": {"uid" : uid } }
    }
  );
};
