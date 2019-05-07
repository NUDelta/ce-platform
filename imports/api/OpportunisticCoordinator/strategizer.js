/**
 * strategizer -- server+client side
 */
import {Assignments} from "./databaseHelpers";
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