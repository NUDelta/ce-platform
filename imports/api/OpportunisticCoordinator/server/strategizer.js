import { Submissions } from "../../OCEManager/currentNeeds";
import { Assignments } from "../databaseHelpers";
import { getNeedObject } from "../identifier";

/**
 * Check if an experience need can run e.g. it has the required number of people.
 * This may call other functions that, for example, check for relationship, co-located, etc.
 *
 * @param updatedIncidentsAndNeeds {[object]} array of object from Availability DB
 *  [{iid: string, needs: [{needName: string, users: [uid]}]] TODO: update this description
 * @returns {{ iid: {need: [uid, uid], need: [uid] } } }
 */
export const checkIfThreshold = updatedIncidentsAndNeeds => {
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
