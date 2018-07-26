import { resetDatabase } from 'meteor/xolvio:cleaner';
import {numUnfinishedNeeds, runCallbacks, updateSubmission} from "./progressor";
import {createIncidentFromExperience, startRunningIncident} from "./OCEs/methods";
import {CONSTANTS} from "../Testing/testingconstants";
import {Experiences, Incidents} from "./OCEs/experiences";
import {Submissions} from "./currentNeeds";
import {adminUpdatesForAddingUsersToIncident, updateAvailability} from "../OpportunisticCoordinator/identifier";
import { Accounts } from 'meteor/accounts-base';
import {findUserByUsername} from "../UserMonitor/users/methods";
import {serverLog} from "../logs";

describe('Progressor Tests', function() {

  const OCE_NAME = 'halfhalfDay';
  let needIndex = 0;
  let numUnfinishedBefore;
  let numSubsBefore;
  let needName;
  let experience;
  let incident;
  let submissionObject;

  before(function(done) {
    resetDatabase();

    // Create User
    // NOTE: tried to use Account.createUser, but does not properly trigger the onCreateUser callback in time
    let user = CONSTANTS.USERS.garrett;
    user.profile = {};
    user.profile.experiences = [];
    user.profile.subscriptions = [];
    user.profile.lastParticipated = null;
    user.profile.lastNotified = null;
    user.profile.pastIncidents = [];
    user.profile.activeIncidents = [];
    user.profile.staticAffordances = user.profile.staticAffordances || {};
    Meteor.users.insert(user);
    const testUser = findUserByUsername('garrett');
    console.log(`testUser: ${Object.keys(testUser)}`);
    console.log(`testUser.profile: ${Object.keys(testUser.profile)}`);

    // Start OCE
    let testExp = CONSTANTS.EXPERIENCES[OCE_NAME];
    Experiences.insert(testExp);
    let testIncident = createIncidentFromExperience(testExp);
    startRunningIncident(testIncident);

    // Collect params for the need to be participating in
    experience = Experiences.findOne(testExp);
    incident = Incidents.findOne(testIncident);
    needName = CONSTANTS.EXPERIENCES[OCE_NAME].contributionTypes[needIndex].needName;
    const notificationDelay = CONSTANTS.EXPERIENCES[OCE_NAME].contributionTypes[needIndex].notificationDelay;

    // User is Available
    updateAvailability(testUser._id, { [incident._id]: [needName] });

    // Assign User to OCE
    adminUpdatesForAddingUsersToIncident([testUser._id], incident._id, needName);

    Meteor.setTimeout(function() {
      // update Submissions
      numUnfinishedBefore = numUnfinishedNeeds(incident._id, needName);
      numSubsBefore = Submissions.find({iid: incident._id, needName: needName}).count();
      submissionObject = {
        uid: testUser._id,
        eid: experience._id,
        iid: incident._id,
        needName: needName,
        content: {}, // not important in this test
        timestamp: Date.now(),
        lat: null, // not important in this test
        lng: null, // not important in this test
      };
      updateSubmission(submissionObject);
      done();
    }, notificationDelay * 1000);
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