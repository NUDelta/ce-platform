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
  return assignmentNeedMap.users.map( x => x.uid );
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
  if (!incident) {
    console.log('needAggregator: incident is null');
    return res;
  }
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
 * usersAlreadySubmittedToIncident
 * @param iid
 * @param limit
 * @return {null|*}
 */
export const usersAlreadySubmittedToIncident = (iid, limit) => {
  let previousUids;
  if (limit) {
    if (!Number.isInteger(limit) || limit < 0) {
      console.error(`Error in usersAlreadySubmittedToIncident: bad limit argument. Got ${limit}`);
      return null;
    }
    if (limit === 0) {
      // purposefully empty
      previousUids = [];
    }
    else {
      previousUids = Submissions.find({
        iid: iid
      }, {
        sort: { timestamp: -1 },
        limit: limit
      }).map(x => x.uid);
    }
  }
  else {
    previousUids = Submissions.find({iid: iid}).map(x => x.uid);
  }
  return previousUids;
};

/**
 * numberSubmissionsNeeded
 *
 * @param iid
 * @param needName
 * @return {any | * | IDBRequest | void}
 */
export const numberSubmissionsRemaining = (iid, needName) => {
  if (!iid) {
    console.error(`Error in numberSubmissionsRemaining: param iid undefined`)
  }
  if (!needName) {
    console.error(`Error in numberSubmissionsRemaining: param needName undefined`)
  }
  let numSubsNeeded = Submissions.find({
    iid: iid,
    needName: needName,
    uid: null
  }).count();
  if (!Number.isInteger(numSubsNeeded)) {
    console.error(`Error in numSubmissionsNeeded: numSubsNeeded is not an Integer`);
    return;
  }
  return numSubsNeeded;
};

export const needIsAvailableToParticipateNow = (incident, needName) => {
  if (!incident) {
    console.log(`Error in needAggregator: incident is null\n ${JSON.stringify(incident)}`);
    return;
  }
  if (!needName) {
    console.log(`Error in needAggregator: needName is null`);
    return;
  }
  if (!incident.contributionTypes) {
    console.log(`Error in needAggregator: incident does not have contribution types\n ${JSON.stringify(incident)}`);
    return;
  }
  console.log(incident.contributionTypes);
  console.log(needName);
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
  if (!participatingNowInIncident) {
    console.error(`Error in numberUsersParticipatingNow: no doc in ParticipatingNow found for iid ${iid}`);
    return;
  }
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

