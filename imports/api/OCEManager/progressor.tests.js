import { resetDatabase } from 'meteor/xolvio:cleaner';
import {numUnfinishedNeeds, runCallbacks, updateSubmission} from "./progressor";
import {createIncidentFromExperience, startRunningIncident} from "./OCEs/methods";
import {CONSTANTS} from "../Testing/testingconstants";
import {Experiences, Incidents} from "./OCEs/experiences";
import {Submissions} from "./currentNeeds";
import {adminUpdatesForAddingUsersToIncident, updateAvailability} from "../OpportunisticCoordinator/identifier";
import {findUserByUsername} from "../UserMonitor/users/methods";
import {Assignments, Availability} from "../OpportunisticCoordinator/databaseHelpers";
import {insertTestUser, startTestOCE} from "../OpportunisticCoordinator/populateDatabase";

describe('Progressor Tests - Single Submission', function() {
  this.timeout(30*1000);

  const OCE_NAME = 'halfhalfEmbodiedMimicry';
  const USERNAME = 'garrett';
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
    insertTestUser(USERNAME);
    const testUser = findUserByUsername(USERNAME);
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

    // Wait for notificationDelay seconds before submitting
    Meteor.setTimeout(function() {
      try {
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
        // Wait for several seconds so the observe changes of Submissions collection can run
        Meteor.setTimeout(function() { done(); }, 5 * 1000);
      } catch(err) { done(err); }
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
  });

  it('should remove the incident from active incidents in users profile', function() {
    const user = Meteor.users.findOne({_id: submissionObject.uid});
    chai.assert.isFalse(user.profile.activeIncidents.includes(submissionObject.iid),
      'active incident not removed from user profile');
  });

  it('should add the incident to past incidents in users profile', function() {
    const user = Meteor.users.findOne({_id: submissionObject.uid});
    chai.assert(user.profile.pastIncidents.includes(submissionObject.iid), 'past incident not added to user profile');
  });

  it('should remove the uid from the availability for that incident', function() {
    const avail = Availability.findOne({_id: submissionObject.iid});
    _.forEach(avail.needUserMaps, (needUserMap) => {
      if (needUserMap.needName === submissionObject.needName) {
        chai.assert.isFalse(needUserMap.uids.includes(submissionObject.uid),
          `user not removed from the availability for ${needUserMap.needName}`);
      }
    });
  });

  it('should remove the uid from the assignment for that incident', function() {
    const assign = Assignments.findOne({_id: submissionObject.iid});
    _.forEach(assign.needUserMaps, (needUserMap) => {
      if (needUserMap.needName === submissionObject.needName) {
        chai.assert.isFalse(needUserMap.uids.includes(submissionObject.uid),
          `user not removed from the assignments for ${needUserMap.needName}`);
      }
    });
  });

  it('should set user profile last participated approximately to the time of submission', function () {
    const user = Meteor.users.findOne({_id: submissionObject.uid});
    let epsilon = Math.abs(submissionObject.timestamp - user.profile.lastParticipated);
    chai.assert.isBelow(epsilon, 30*1000,
      'user.profile.lastParticipated was not updated properly to be within epsilon seconds of the submission');
  });
});