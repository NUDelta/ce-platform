import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Users } from '../UserMonitor/users/users';
import { Incidents } from "../OCEManager/OCEs/experiences";
import { CONSTANTS } from './testingconstants';
import { onLocationUpdate } from '../UserMonitor/locations/methods';
import { findUserByUsername } from "../UserMonitor/users/methods";
import { Assignments} from "../OpportunisticCoordinator/databaseHelpers";
import { Random } from 'meteor/random'
import { Detectors } from "../UserMonitor/detectors/detectors";
import { updateSubmission} from "../OCEManager/progressor";
import "../OCEManager/progressorHelper";
import {insertTestUser, startTestOCE} from "../OpportunisticCoordinator/populateDatabase";



describe('Simple End To End', function () {
  this.timeout(5*60*1000);

  let second = false;
  let OCE_NAME = 'sameSituationAwareness';
  let NEEDNAME = 'Shopping for groceries';
  let USERNAME = 'garrett';
  let DETECTOR = CONSTANTS.DETECTORS.grocery;
  let LOCATION = CONSTANTS.LOCATIONS.grocery;
  let LOCATION2 = CONSTANTS.LOCATIONS.grocery2;

  beforeEach((done) => {

    if (second) {
      done();

    } else {
      second = true;
      resetDatabase();
      insertTestUser(USERNAME);
      Detectors.insert(DETECTOR);
      startTestOCE(OCE_NAME);

      let uid = findUserByUsername(USERNAME)._id;
      let bgLocationObj = {
        "coords": {
          "latitude": LOCATION.lat,
          "longitude": LOCATION.lng
        },
        "activity": {"type": "unknown", "confidence": 100}
      };
      onLocationUpdate(uid, bgLocationObj, function() {
        done();
      });
    }
  });

  it('user gets added to experience', (done) => {
    const contributionForNeed = CONSTANTS.EXPERIENCES[OCE_NAME].contributionTypes.find(function(x) {
      return x.needName === NEEDNAME;
    });
    const notificationDelay = contributionForNeed.notificationDelay;

    // Wait to check if user.profile and assignments has changed, > notificationDelay seconds after first matching
    Meteor.setTimeout(function() {
      try {
        let incident = Incidents.findOne({ eid: CONSTANTS.EXPERIENCES[OCE_NAME]._id });
        let iid = incident._id;
        let user = findUserByUsername(USERNAME);

        console.log('user.profile.activeIncidents', user.profile.activeIncidents);
        //user has incident as an active incident
        chai.assert(user.profile.activeIncidents.includes(iid), 'active incident not added to user profile');

        //assignments has user assigned
        let assignmentEntry = Assignments.findOne({ _id: iid });

        let needUserMap = assignmentEntry.needUserMaps.find((x) => {
          return x.needName ===  NEEDNAME;
        });

        chai.assert.typeOf(needUserMap.uids, 'array', 'no needUserMap in Assignment DB');
        chai.assert(needUserMap.uids.includes(user._id), 'uid not in needUserMap in Assignment DB');

        done();
      } catch (err) { done(err); }
    }, (notificationDelay + 5) * 1000);
  });

  it('user participates in experience', (done) => {
    let incident = Incidents.findOne({ eid: CONSTANTS.EXPERIENCES[OCE_NAME]._id });
    let iid = incident._id;
    let uid = findUserByUsername(USERNAME)._id;

    let submission = {
      uid: uid,
      eid: CONSTANTS.EXPERIENCES[OCE_NAME]._id,
      iid: iid,
      needName: NEEDNAME,
      content: {},
      timestamp: Date.now(),
      lat: LOCATION.lat,
      lng: LOCATION.lng,
    };

    updateSubmission(submission);

    // Wait several seconds so the observe changes of Submissions collection can run
    Meteor.setTimeout(function () {
      try {
        let user = findUserByUsername(USERNAME);
        chai.assert.isFalse(user.profile.activeIncidents.includes(iid), 'active incident not removed from user profile');
        chai.assert(user.profile.pastIncidents.includes(iid), 'past incident not added to user profile');
        done();
      } catch (err) { done(err); }
    }, 5 * 1000);

  });

  it('user ALSO SHOULD be able to participate again, if need.allowRepeatContributions: true', (done) => {

    // wait for userParticipatedTooRecently check to expire
    Meteor.setTimeout(() => {

      // move to another situation that matches the same need
      let uid = findUserByUsername(USERNAME)._id;
      let bgLocationObj = {
        "coords": {
          "latitude": LOCATION2.lat,
          "longitude": LOCATION2.lng
        },
        "activity": {"type": "unknown", "confidence": 100}
      };
      onLocationUpdate(uid, bgLocationObj, function() {
      });

      const contributionForNeed = CONSTANTS.EXPERIENCES[OCE_NAME].contributionTypes.find(function(x) {
        return x.needName === NEEDNAME;
      });
      const notificationDelay = contributionForNeed.notificationDelay;

      // Wait to check if user.profile and assignments has changed, > notificationDelay seconds after first matching
      Meteor.setTimeout(function() {
        try {
          let incident = Incidents.findOne({ eid: CONSTANTS.EXPERIENCES[OCE_NAME]._id });
          let iid = incident._id;
          let user = findUserByUsername(USERNAME);

          console.log('user.profile.activeIncidents', user.profile.activeIncidents);
          //user has incident as an active incident
          chai.assert(user.profile.activeIncidents.includes(iid), 'active incident not added to user profile');

          //assignments has user assigned
          let assignmentEntry = Assignments.findOne({ _id: iid });

          let needUserMap = assignmentEntry.needUserMaps.find((x) => {
            return x.needName ===  NEEDNAME;
          });

          chai.assert.typeOf(needUserMap.uids, 'array', 'no needUserMap in Assignment DB');
          chai.assert(needUserMap.uids.includes(user._id), 'uid not in needUserMap in Assignment DB');

          done();
        } catch (err) { done(err); }
      }, (notificationDelay + 5) * 1000);

    // for value to wait on local, @see userParticipatedTooRecently in imports/api/UserMonitor/locations/methods.js
    }, 60 * 1000);
  });
});
