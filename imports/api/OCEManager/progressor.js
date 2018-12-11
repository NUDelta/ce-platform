// Imports needed for the callbacks
import { Incidents } from "./OCEs/experiences";
import { Submissions } from "./currentNeeds";
import {serverLog} from "../logs";
import {adminUpdates} from "./progressorHelper";
// needed because a callback uses `notify`
import {notify} from "../OpportunisticCoordinator/server/noticationMethods";
import {addContribution} from "./OCEs/methods";

const submissionsCursor = Submissions.find({});
const submissionsHandle = submissionsCursor.observe({
  //TODO: make it so we can check the submission when through completely first?
  //e.g. if a photo upload fails this will still run not matter what
  changed(submission, old) {
    serverLog.call({message: `Submissions DB Changed!`});
    serverLog.call({message: `${Object.keys(submission)}`});
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
  console.log("update submission");
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
  console.log("running runCallBacks");
  // need `cb` since all the callbacks called in the eval references this manager
  let cb = new CallbackManager(mostRecentSub);

  let callbackArray = Incidents.findOne(mostRecentSub.iid).callbacks;

  _.forEach(callbackArray, callbackPair => {
    console.log("new submission, now checking for callbacks");
    let trigger = callbackPair.trigger;
    let fun = callbackPair.function;
    if (eval(trigger)) {
    //   let chapter = callbackPair.chapter;
    //   console.log("chapter in callback is " + JSON.stringify(chapter))
    // console.log("chapter in callback 2is " + chapter)
    //   console.log ("cn flag: " + mostRecentSub.needName.substring(0,2))
    //   if (mostRecentSub.needName.substring(0,2) == "cn") {
    //     console.log ("identifed CN")
    //     console.log("fun is " + fun)
    //     eval("(" + fun + "(" + chapter + "," +JSON.stringify(mostRecentSub) + "))");
    //   }
      console.log("callback triggered");
      console.log("fun: " + "(" + fun + "(" + JSON.stringify(mostRecentSub) + "))");
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
    console.log("new submission");
    if (needName === undefined) {
      return true;
    } else {
      return this.submission.needName === needName;
    }
  }

  anyCharDead() {
    return this.submission.content["anyCharDead"];
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

  /**
   * Assumes that submission takes the schema
   * {
   *  iid:
   *  user:
   *  info: {
   *    sentence: "Fine, here is the sword."
   *    action: true
   *  }
   * }
   * @param chapterName
   */
    chapterEnd(chapterName) {
      // check if recent submission is the end of a chapter
      if (this.submission.info.action === true) {
        return true;
      }

      return false;

      // the process of searching through the database of submissions for the one with the matching iid
      // return Submissions.find({
      //   iid: this.submission.iid,
      //   needName: chapterName,
      //   uid: { $ne: null }
      // })
    }

  //trigger used in callbacks: returns minutes since the first need was submitted. Additionally for this trigger, in runCallbacks we need to set a timer to run the function in the future
  timeSinceFirstSubmission(need) {
    return number; //minutes
  }
}
