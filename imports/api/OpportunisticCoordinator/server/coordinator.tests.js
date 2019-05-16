import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Availability, Assignments } from '../databaseHelpers.js';
import {
  adminUpdatesForAddingUserToIncident, adminUpdatesForRemovingUserToIncident, getNeedUserMapForNeed,
  updateAvailability
} from './identifier';
import {CONSTANTS} from "../../Testing/testingconstants";
import {createIncidentFromExperience, startRunningIncident} from "../../OCEManager/OCEs/methods";
import {Experiences, Incidents} from "../../OCEManager/OCEs/experiences";
import { Submissions } from "../../OCEManager/currentNeeds";
import {insertTestOCE } from "../populateDatabase";
import {checkIfThreshold} from "./strategizer";
import { log } from "../../logs";

describe('Availability Collection Tests', function() {
  this.timeout(10*1000); // extend timeout to wait for asynch functions

  let id1 = Random.id();
  let id2 = Random.id();

  beforeEach(() => {
    resetDatabase();

    Availability.insert({
      _id: id1,
      needUserMaps: [
        {
          needName: 'need1', users: [
            {uid: '1', place: "place1", distance: 10.0},
            {uid: '2', place: "place2", distance: 20.1},
            {uid: '3', place: "place3", distance: 30.2}
          ]
        },
        {
          needName: 'need2', users: [
            {uid: '5', place: "place5", distance: 10.0},
            {uid: '3', place: "place3", distance: 20.1},
            {uid: '4', place: "place4", distance: 30.2},
            {uid: '1', place: "place1", distance: 40.3}
          ]
        }
      ],
    });
    Availability.insert({
      _id: id2,
      needUserMaps: [
        {
          needName: 'need3', users: [
            {uid: '8', place: "place8", distance: 10.0},
            {uid: '2', place: "place2", distance: 20.1},
            {uid: '5', place: "place5", distance: 30.2}
          ]
        },
        {
          needName: 'need4', users: [
            {uid: '9', place: "place9", distance: 10.0},
            {uid: '14', place: "place14", distance: 20.1},
            {uid: '5', place: "place5", distance: 30.2}
          ]
        }
      ],
    });
  });

  it('-- updateAvailability properly handles Availability Collection sideeffects', function(done) {
    let updatedAvailability = updateAvailability('1', {
      [id1]: [['place1', 'need1', 10.0]],
      [id2]: [['place3', 'need3', 20.0], ['place4', 'need4', 15.0]] });
    console.log('updatedAvailability : ' + JSON.stringify(updatedAvailability));

    // Wait for asynchronous updates to Availability Collection
    Meteor.setTimeout(function() {
      let firstEntry = Availability.findOne({ _id: id1 });
      let secondEntry = Availability.findOne({ _id: id2 });

      chai.assert(firstEntry !== undefined, 'did not find firstEntry in Availability collection');
      chai.assert(secondEntry !== undefined, 'did not find secondEntry in Availability collection');
      let firstEntryNeedNames = firstEntry.needUserMaps.map((needUserMap) => { return needUserMap.needName});
      let secondEntryNeedNames = secondEntry.needUserMaps.map((needUserMap) => { return needUserMap.needName});
      chai.assert(JSON.stringify(firstEntryNeedNames) == JSON.stringify(['need1', 'need2']),
        'updatedAvailability did not have need1 and need2');
      chai.assert(JSON.stringify(secondEntryNeedNames) == JSON.stringify(['need3', 'need4']),
        'updatedAvailability did not have need3 and need4');

      _.forEach(firstEntry.needUserMaps, (needUserMap) => {
        if (needUserMap.needName === 'need1') {
          let foundUser = needUserMap.users.find(user => user.uid === '1');
          chai.assert(foundUser, 'user not kept on to need1');
        }

        if (needUserMap.needName === 'need2') {
          let foundUser = needUserMap.users.find(user => user.uid === '1');
          chai.assert(!foundUser, 'user not removed from need2');
        }
      });

      _.forEach(secondEntry.needUserMaps, (needUserMap) => {
        if (needUserMap.needName === 'need3') {
          let foundUser = needUserMap.users.find(user => user.uid === '1');
          chai.assert(foundUser, 'user not added to need3');
        }

        if (needUserMap.needName === 'need4') {
          let foundUser = needUserMap.users.find(user => user.uid === '1');
          chai.assert(foundUser, 'user not added to need4');
        }
      });

      // wait to exit this test case until finishing the contents of the setTimeout
      done();
    }, 1*1000);
  });

  it('-- updateAvailability properly returns updatedAvailability', () => {
    let updatedAvailability = updateAvailability('1', {
      [id1]: [['place1', 'need1', undefined]],
      [id2]: [['place3', 'need3', 10.0], ['place4', 'need4', 25.0]] });
    console.log('updatedAvailability : ' + JSON.stringify(updatedAvailability));

    let firstEntry = updatedAvailability.find(doc => doc._id === id1);
    let secondEntry = updatedAvailability.find(doc => doc._id === id2);

    let firstEntryNeedNames = firstEntry.needUserMaps.map((needUserMap) => { return needUserMap.needName});
    let secondEntryNeedNames = secondEntry.needUserMaps.map((needUserMap) => { return needUserMap.needName});
    chai.assert(JSON.stringify(firstEntryNeedNames) == JSON.stringify(['need1', 'need2']),
      'updatedAvailability did not have need1 and need2');
    chai.assert(JSON.stringify(secondEntryNeedNames) == JSON.stringify(['need3', 'need4']),
      'updatedAvailability did not have need3 and need4');

    _.forEach(firstEntry.needUserMaps, (needUserMap) => {
      if (needUserMap.needName === 'need1') {
        let foundUser = needUserMap.users.find(user => user.uid === '1');
        chai.assert(foundUser, 'user not kept on to need1');
      }

      if (needUserMap.needName === 'need2') {
        let foundUser = needUserMap.users.find(user => user.uid === '1');
        chai.assert(!foundUser, 'user not removed from need2');
      }
    });

    _.forEach(secondEntry.needUserMaps, (needUserMap) => {
      if (needUserMap.needName === 'need3') {
        let foundUser = needUserMap.users.find(user => user.uid === '1');
        chai.assert(foundUser, 'user not added to need3');
      }

      if (needUserMap.needName === 'need4') {
        let foundUser = needUserMap.users.find(user => user.uid === '1');
        chai.assert(foundUser, 'user not added to need4');
      }
    });
  })

});

describe('Assignments Collection test', () => {

  const testExperience = 'halfhalf_sunny';
  var testIncident;
  beforeEach(() => {
    resetDatabase();

    // createOCE
    // NOTE: DETECTORS are unnecessary, since we will trigger the assignment to needs manually
    let exp = CONSTANTS.EXPERIENCES[testExperience];
    Experiences.insert(exp);
    testIncident = createIncidentFromExperience(exp);
    // Submissions, Availability, and Assignments are inserted here
    startRunningIncident(testIncident);
  });

  it('should add user to Assignment DB once they have been assigned to a need', () => {

    const needName = CONSTANTS.EXPERIENCES[testExperience].contributionTypes[0].needName;
    const incident = Incidents.findOne(testIncident);

    // single user participating
    const uid = Random.id();
    const beforeNeedUserMap = getNeedUserMapForNeed(incident._id, needName);
    adminUpdatesForAddingUserToIncident(uid, incident._id, needName);
    const afterNeedUserMap = getNeedUserMapForNeed(incident._id, needName);

    if (beforeNeedUserMap.users.length + 1 !== afterNeedUserMap.users.length) {
      chai.assert(false, `Number of users assigned to need should be 1 more than before it started`)
    }
  });
  it('should remove user from Assignment DB since they participated', () => {

    const needName = CONSTANTS.EXPERIENCES[testExperience].contributionTypes[0].needName;
    const incident = Incidents.findOne(testIncident);

    // Adding 3 users
    const uids_to_add = [Random.id(), Random.id(), Random.id()];
    _.forEach(uids_to_add, uid => {
      adminUpdatesForAddingUserToIncident(uid, incident._id, needName);
    });
    const beforeNeedUserMap = getNeedUserMapForNeed(incident._id, needName);

    // One user participated, so we will remove them
    const uid_to_remove = uids_to_add[0];
    adminUpdatesForRemovingUserToIncident(uid_to_remove, incident._id, needName);
    const afterNeedUserMap = getNeedUserMapForNeed(incident._id, needName);

    if (beforeNeedUserMap.users.length - 1 !== afterNeedUserMap.users.length) {
      chai.assert(false, 'One user participated, but one user was NOT removed from the assignments for this need');
    }
  });

});
