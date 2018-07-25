import { resetDatabase } from 'meteor/xolvio:cleaner';
import {numUnfinishedNeeds, runCallbacks, updateSubmission} from "./progressor";
import {createIncidentFromExperience, startRunningIncident} from "./OCEs/methods";
import {CONSTANTS} from "../Testing/testingconstants";
import {Experiences, Incidents} from "./OCEs/experiences";
import {Submissions} from "./currentNeeds";
import {adminUpdates} from "./progressorHelper";

describe('Progressor Tests', function() {

  const testExperience = 'halfhalfDay';
  let numUnfinishedBefore;
  let numSubsBefore;
  let needName;
  let experience;
  let incident;
  let submissionObject;

  before(function() {
    resetDatabase();

    // createOCE
    // NOTE: DETECTORS are unnecessary, since we will trigger the assignment to needs manually
    let testExp = CONSTANTS.EXPERIENCES[testExperience];
    Experiences.insert(testExp);
    let testIncident = createIncidentFromExperience(testExp);
    // Submissions, Availability, and Assignments are inserted here
    startRunningIncident(testIncident);

    // update Submissions
    needName = CONSTANTS.EXPERIENCES[testExperience].contributionTypes[0].needName;
    experience = Experiences.findOne(testExp);
    incident = Incidents.findOne(testIncident);
    numUnfinishedBefore = numUnfinishedNeeds(incident._id, needName);
    numSubsBefore = Submissions.find({iid: incident._id, needName: needName}).count();
    submissionObject = {
      uid: Random.id(),
      eid: experience._id,
      iid: incident._id,
      needName: needName,
      content: {}, // not important in this test
      timestamp: Date.now(),
      lat: null, // not important in this test
      lng: null, // not important in this test
    };
    // TODO(rlouie): since it seems impossible to wait for Submissions DB to change, and the observe callbacks to occur,
    // TODO(cont'd): these tests pass, but submissions might be altered at a later time in an undesirable way
    updateSubmission(submissionObject);
  });

  it('should update submissions for single user-need participation', function() {
    const justSubmitted = Submissions.findOne({
      eid: submissionObject.eid,
      iid: submissionObject.iid,
      needName: submissionObject.needName,
      uid: submissionObject.uid
    });
    const numUnfinishedAfter = numUnfinishedNeeds(incident._id, submissionObject.needName);
    const numSubsAfter = Submissions.find({iid: incident._id, needName: submissionObject.needName}).count();

    chai.assert.typeOf(justSubmitted, 'Object', 'Should have found the submission that was just updated');
    chai.assert.equal(numSubsBefore, numSubsAfter, `Number of submissions should not change, only contents of them`);
    chai.assert.equal(numUnfinishedBefore - 1, numUnfinishedAfter,
      `Before single user submission: ${numUnfinishedBefore} unfinished needs; After: ${numUnfinishedAfter}`
    );

    // @see https://wietse.loves.engineering/testing-promises-with-mocha-90df8b7d2e35
    // @see https://stackoverflow.com/questions/11235815/is-there-a-way-to-get-chai-working-with-asynchronous-mocha-tests
    // if you want this Promise/Timeout code to work
    // add `async` before callback definition i.e. `async function() {}`
    // const subUpdatedPromise = new Promise((resolve) => {
    //   setTimeout(() => {
    //     const justSubmitted = Submissions.findOne({
    //       eid: submissionObject.eid,
    //       iid: submissionObject.iid,
    //       needName: submissionObject.needName,
    //       uid: submissionObject.uid
    //     });
    //     const numUnfinishedAfter = numUnfinishedNeeds(incident._id, needName);
    //     const numSubsAfter = Submissions.find({iid: incident._id, needName: needName}).count();
    //
    //     const result = {
    //       justSubmitted: justSubmitted,
    //       numUnfinishedAfter: numUnfinishedAfter,
    //       numSubsAfter: numSubsAfter
    //     };
    //     resolve(result);
    //   }, 100);
    // });
    //
    // try {
    //   const result = await subUpdatedPromise;
    //   chai.assert.typeOf(result.justSubmitted, 'Object', 'Should have found the submission that was just updated');
    //   chai.assert.equal(numSubsBefore, result.numSubsAfter, `Number of submissions should not change, only contents of them`);
    //   chai.assert.equal(numUnfinishedBefore - 1, result.numUnfinishedAfter,
    //     `Before single user submission: ${numUnfinishedBefore} unfinished needs; After: ${result.numUnfinishedAfter}`
    //   );
    //   done();
    // } catch(err) {
    //   done(err);
    // }

  });

});