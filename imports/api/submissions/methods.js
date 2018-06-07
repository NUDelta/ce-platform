import { ValidatedMethod } from "meteor/mdg:validated-method";
import { SimpleSchema } from "meteor/aldeed:simple-schema";

import { Submissions } from "./submissions.js";
import { adminUpdatesForRemovingUsersToIncident } from "../coordinator/methods";
import { Availability } from "../coordinator/availability";
import { Assignments } from "../coordinator/assignments";
import { Incidents } from "../incidents/incidents";

//for the callbacks
import { addContribution } from "../incidents/methods";
import { CONSTANTS } from "../testing/testingconstants";
import { notify } from "../cerebro/server/methods";

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
function adminUpdates(mostRecentSub) {
  Meteor.users.update(
    { _id: mostRecentSub.uid },
    {
      $set: { "profile.lastParticipated": new Date() }
    }
  );

  Availability.update(
    {
      _id: mostRecentSub.iid,
      "needUserMaps.needName": mostRecentSub.needName
    },
    {
      $pull: { "needUserMaps.$.uids": mostRecentSub.uid }
    }
  );

  adminUpdatesForRemovingUsersToIncident(
    [mostRecentSub.uid],
    mostRecentSub.iid,
    mostRecentSub.needName
  );
}

const submissionsCursor = Submissions.find({});
const submissionsHandle = submissionsCursor.observe({
  //TODO: make it so we can check the submission when through completely first?
  //e.g. if a photo upload fails this will still run not matter what
  changed(submission, old) {
    adminUpdates(submission);
    runCallbacks(submission);
  }
});

Meteor.methods({
  updateSubmission(submission) {
    updateSubmission(submission);
  }
});

export const updateSubmission = function(submission) {
  Submissions.update(
    {
      eid: submission.eid,
      iid: submission.iid,
      needName: submission.needName,
      uid: null
    },
    {
      $set: {
        uid: submission.uid,
        content: submission.content,
        timestamp: submission.timestamp,
        lat: submission.lat,
        lng: submission.lng
      }
    },
    (err, docs) => {
      if (err) {
        console.log("submission not inserted", err);
      } else {
      }
    }
  );
};

//checks the triggers for the experience of the new submission and runs the appropriate callbacks 5
function runCallbacks(mostRecentSub) {
  let cb = new CallbackManager(mostRecentSub);

  let callbackArray = Incidents.findOne(mostRecentSub.iid).callbacks;

  _.forEach(callbackArray, callbackPair => {
    let trigger = callbackPair.trigger;
    let fun = callbackPair.function;
    if (eval(trigger)) {
      eval("(" + fun + "(" + JSON.stringify(mostRecentSub) + "))");
    }
  });
}

const numUnfinishedNeeds = (iid, needName) => {
  let count = Submissions.find({
    iid: iid,
    needName: needName,
    uid: null
  }).count();

  return count;
};

class CallbackManager {
  constructor(mostRecentSubmission) {
    this.submission = mostRecentSubmission;
  }

  //trigger used in callbacks: checks if the new sub was for the specified need
  newSubmission(needName) {
    console.log("new submission");
    if (needName === undefined) {
      return true;
    } else {
      return this.submission.needName === needName;
    }
  }

  //trigger used in callbacks: checks if the need is finished
  needFinished(needName) {
    return numUnfinishedNeeds(this.submission.iid, needName) === 0;
  }

  //trigger used in callbacks: checks if the experience is finished
  incidentFinished() {
    let count = Submissions.find({
      iid: this.submission.iid,
      uid: null
    }).count();
    return count === 0;
  }

  //trigger used in callbacks: returns number of submission for the need
  numberOfSubmissions(needName) {
    if (needName === undefined) {
      return Submissions.find({
        iid: this.submission.iid,
        uid: { $ne: null }
      }).count();
    } else {
      return numUnfinishedNeeds(this.submission.iid, needName);
    }
  }

  //trigger used in callbacks: returns minutes since the first need was submitted. Additionally for this trigger, in runCallbacks we need to set a timer to run the function in the future
  timeSinceFirstSubmission(need) {
    return number; //minutes
  }
}
