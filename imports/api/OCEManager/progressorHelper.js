import { ValidatedMethod } from "meteor/mdg:validated-method";
import { SimpleSchema } from "meteor/aldeed:simple-schema";

import { Submissions } from "./currentNeeds.js";
import {
  adminUpdatesForRemovingUserToIncident,
  pullUserFromAvailabilityNeedUserMaps
} from "../OpportunisticCoordinator/server/identifier";
import { Assignments, Availability } from "../OpportunisticCoordinator/databaseHelpers";
import { Incidents } from "./OCEs/experiences.js";



/**
 * Gets the needNames/iid for all unique unfilled entries in the submission DB
 *
 * @returns {object} dictionary of iids and needs in form {iid:[need], iid:[need]}
 */
export const getUnfinishedNeedNames = function() {
  let submissions = Submissions.find(
    {
      uid: null
    },
    {
      multi: true
    }
  ).fetch();

  let unfinishedNeeds = {};

  _.forEach(submissions, sub => {
    let iid = sub.iid;
    let needName = sub.needName;
    if (iid in unfinishedNeeds) {
      if (unfinishedNeeds[iid].indexOf(needName) === -1) {
        unfinishedNeeds[iid].push(needName);
      }
    } else {
      unfinishedNeeds[iid] = [needName];
    }
  });
  return unfinishedNeeds; //{iid:[need], iid:[need]}
};

/**
 * Updates the time a user participated, remove them from the assignment db for that incident
 * Move the incident from activeIncidents to pastIncidents for the user
 *
 * @param mostRecentSub {object} submission db object that was just submitted
 */
export const adminUpdates = function(mostRecentSub) {
  Meteor.users.update(
    { _id: mostRecentSub.uid },
    {
      $set: { "profile.lastParticipated": new Date() }
    }
  );

  pullUserFromAvailabilityNeedUserMaps(mostRecentSub.iid, mostRecentSub.needName, mostRecentSub.uid);

  adminUpdatesForRemovingUserToIncident(mostRecentSub.uid, mostRecentSub.iid, mostRecentSub.needName);
}
