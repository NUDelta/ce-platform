import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import {Submissions} from './submissions.js';
import {adminUpdatesForRemovingUsersToIncident} from "../coordinator/methods";


/**
 * Gets the needNames/iid for all unique unfilled entries in the submission DB
 *
 * @returns {object} dictionary of iids and needs in form {iid:[need], iid:[need]}
 */
export const getUnfinishedNeedNames = function () {

  let submissions = Submissions.find({
      uid: null
    }, {
      multi: true
    }
  ).fetch();

  let unfinishedNeeds = {};

  _.forEach(submissions, (sub) => {
    let iid = sub.iid;
    let needName = sub.needName;
    if (iid in unfinishedNeeds) {
      if (unfinishedNeeds[iid].indexOf(needName) === -1) {
        unfinishedNeeds[iid].push(needName)
      }
    } else {
      unfinishedNeeds[iid] = [needName]
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
function adminUpdates(mostRecentSub) {

  Meteor.users.update({_id: mostRecentSub.uid}, {
    $set: {"profile.lastParticipated": new Date()}
  });
  console.log("going for that remove");
  adminUpdatesForRemovingUsersToIncident([mostRecentSub.uid], mostRecentSub.iid, mostRecentSub.needName);

}

const numberOfSubmissions = Submissions.find({uid: {$ne: null}}).count();

const submissionsCursor = Submissions.find({uid: {$ne: null}});
const submissionsHandle = submissionsCursor.observe({
  //TODO: make it so we can check the submission when through completely first?
  //e.g. if a photo upload fails this will still run not matter what
  added(doc){
    console.log("new submission recognzied", doc)

  },
  changed(submission, old) {
    console.log("at start of sub triggered");

    if (Submissions.find({uid: {$ne: null}}).count() <= numberOfSubmissions) {
      return;
    }
    console.log("submissions triggered", submission);
    adminUpdates(submission);

  }

});


Meteor.methods({
  updateSubmission(submission){
    console.log("update submission client", submission);
    updateSubmission(submission);
  }
});

export const updateSubmission = function (submission) {
  console.log("IN THE UPDATE SUBMISSION FUNCTION");
  Submissions.update({
    eid: submission.eid,
    iid: submission.iid,
    needName: submission.needName
  }, {
    $set: {
      uid: submission.uid,
      content: submission.submissions,
      timestamp: submission.timestamp,
      lat: submission.lat,
      lng: submission.lng
    }
  }, (err, docs) => {
    if (err) {
      console.log("submission not inserted", err);
    } else {
      console.log("submission inserted", docs, submission);

    }
  });
};




