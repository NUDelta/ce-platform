// import {Submissions} from "./submissions";
// import {adminUpdatesForRemovingUsersToIncident, removeUserAfterTheyParticipated} from "../coordinator/methods";
// import {log} from "../logs";
//
//
// //checks the triggers for the experience of the new submission and runs the approiate callbacks 5
// function runCallbacks(eid, need, mostRecentSub) {
//
// }
//
// //trigger used in callbacks: checks if the new sub was for the specified need
// function newSubmission(need) {
//
//   return bool
// }
//
// //trigger used in callbacks: checks if the need is finished
// function needFinished(need) {
//   return bool;
// }
//
// //trigger used in callbacks: checks if the experience is finished
// function experienceFinished() {
//   return bool;
// }
//
//
// //trigger used in callbacks: returns number of submission for the need
// function numberOfSubmissions(need) {
//   return number;
// }
//
// //trigger used in callbacks: returns minutes since the first need was submitted. Additionally for this trigger, in runCallbacks we need to set a timer to run the function in the future
// function timeSinceFirstSubmission(need) {
//   return number; //minutes
// }
//
//
//
// //
// // const submissionsCursor = Submissions.find();
// // const submissionsHandle = submissionsCursor.observe({
// //   //TODO: make it so we can check the submission when through completely first?
// //   //e.g. if a photo upload fails this will still run not matter what
// //   added(submission) {
// //     if (totalNumber == Submissions.find().count()) {
// //       console.log("not running received submission")
// //       return;
// //     }
// //
// //     console.log("received a submission")
// //     console.log(submission)
// //     //when a user participates add it to their past experiences
// //     Cerebro.addIncidents(submission.submitter, submission.incidentId);
// //
// //     //mark that they submitted
// //     Meteor.users.update({ _id: submission.submitter }, {
// //       $set: { "profile.lastParticipated": Date.parse(new Date()) }
// //     })
// //
// //     //remove user/experience from each other
// //     removeUserAfterTheyParticipated(submission.submitter, submission.experienceId)
// //
// //     //see if there is a callback
// //     var callbackPairs = Experiences.findOne({ _id: submission.experienceId }).callbackPair;
// //     console.log(callbackPairs)
// //     var callback = callbackPairs.filter(function (cp) {
// //       return cp.templateName == submission.contributionTemplate;
// //     });
// //
// //     if (callback.length > 1) {
// //       log.error("submissions/methods found more than one callback for the templateName " + submission.templateName + " but there should only be one. Not calling any callbacks");
// //     } else if (callback.length === 1) {
// //       console.log("we found a callback!")
// //       var callbackFunction = callback[0]["callback"];
// //       eval("(" + callbackFunction + "(" + JSON.stringify(submission) + "))")
// //     }
// //
// //     //check if the situationNeed is FINISHED
// //     var incident = Incidents.findOne({ _id: submission.incidentId });
// //     console.log("in submissions for incidnet ", incident._id)
// //     var situationNeed = incident.situationNeeds.filter(
// //       function (sn) {
// //         return sn.name == submission.situationNeed
// //       })[0];
// //     console.log("found the sit need", situationNeed)
// //     var numberSubmissionsFound = Submissions.find({
// //       incidentId: submission.incidentId,
// //       situationNeed: submission.situationNeed
// //     }).count();
// //     console.log("looked for all of them ", numberSubmissionsFound)
// //     var numberSubmissionsRequired = situationNeed.softStoppingCriteria;
// //     console.log("num we need is ", numberSubmissionsRequired)
// //
// //     if (numberSubmissionsRequired <= numberSubmissionsFound) {
// //       Incidents.update({
// //           _id: submission.incidentId,
// //           'situationNeeds.name': submission.situationNeed
// //         },
// //         {
// //           $set:
// //             { 'situationNeeds.$.done': true }
// //         });
// //     }
// //
// //     //check if the experience is done
// //     var isIncidentFinished = Incidents.find({
// //       _id: submission.incidentId,
// //       "situationNeeds.done": false
// //     }).count();
// //     console.log(isIncidentFinished)
// //     if (isIncidentFinished == 0) {
// //       log.cerebro("Experience " + submission.experienceId + " is finished!")
// //       Experiences.update({ _id: submission.experienceId },
// //         {
// //           $unset: { 'activeIncident': 0 }
// //         });
// //     }
// //   }
// // });
