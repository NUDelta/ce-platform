// Imports needed for the callbacks
import { Incidents } from "./OCEs/experiences";
import { Submissions } from "./currentNeeds";

const submissionsCursor = Submissions.find({});
const submissionsHandle = submissionsCursor.observe({
  //TODO: make it so we can check the submission when through completely first?
  //e.g. if a photo upload fails this will still run not matter what
  changed(submission, old) {
    console.log(submission);
    if(!(submission.uid === null)){
      adminUpdates(submission);
      runCallbacks(submission);
    }
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
    (err) => {
      if (err) {
        console.log("submission not inserted", err);
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

export const numUnfinishedNeeds = (iid, needName) => {
  return Submissions.find({
    iid: iid,
    needName: needName,
    uid: null
  }).count();
};

class CallbackManager {
  constructor(mostRecentSubmission) {
    this.submission = mostRecentSubmission;
  }

  //trigger used in callbacks: checks if the new sub was for the specified need
  newSubmission(needName) {
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
      return Submissions.find({
        iid: this.submission.iid,
        needName: needName,
        uid: { $ne: null }
      }).count();
    }
  }

  //trigger used in callbacks: returns minutes since the first need was submitted. Additionally for this trigger, in runCallbacks we need to set a timer to run the function in the future
  timeSinceFirstSubmission(need) {
    return number; //minutes
  }
}
