import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Availability, Assignments } from './databaseHelpers.js';
import {
  adminUpdatesForAddingUsersToIncident, adminUpdatesForRemovingUsersToIncident, getNeedUserMapForNeed,
  updateAvailability
} from './identifier';
import {CONSTANTS} from "../Testing/testingconstants";
import {createIncidentFromExperience, startRunningIncident} from "../OCEManager/OCEs/methods";
import {Experiences, Incidents} from "../OCEManager/OCEs/experiences";
import { Submissions } from "../OCEManager/currentNeeds";
import {insertTestOCE } from "./populateDatabase";
import {checkIfThreshold} from "./server/strategizer";

describe('Availability Tests', () => {
  let id1 = Random.id();
  let id2 = Random.id();

  beforeEach(() => {
    resetDatabase();

    Availability.insert({
      _id: id1,
      needUserMaps: [
        { needName: 'need1', uids: ['1', '2', '3'] },
        { needName: 'need2', uids: ['5', '3', '4', '1'] }
      ],
    });
    Availability.insert({
      _id: id2,
      needUserMaps: [
        { needName: 'need3', uids: ['8', '2', '5'] },
        { needName: 'need4', uids: ['9', '14', '5'] }
      ],
    });
  });

  it('update availability', () => {
    updateAvailability('1', { [id1]: ['need1'], [id2]: ['need3', 'need4'] });

    let firstEntry = Availability.findOne({ _id: id1 });
    let secondEntry = Availability.findOne({ _id: id2 });

    _.forEach(firstEntry.needUserMaps, (needUserMap) => {
      if (needUserMap.needName === 'need1') {
        chai.assert(needUserMap.uids.includes('1'), 'user not added to need1');
      }

      if (needUserMap.needName === 'need2') {
        chai.assert.isFalse(needUserMap.uids.includes('1'), 'user not removed from need2');
      }
    });

    _.forEach(secondEntry.needUserMaps, (needUserMap) => {
      if (needUserMap.needName === 'need3') {
        chai.assert(needUserMap.uids.includes('1'), 'user not added to need3');
      }

      if (needUserMap.needName === 'need4') {
        chai.assert(needUserMap.uids.includes('1'), 'user not added to need4');
      }
    });
  })
});

describe('Assignments test', () => {

  const testExperience = 'halfhalfDay';
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
    const uids = [Random.id()];
    const beforeNeedUserMap = getNeedUserMapForNeed(incident._id, needName);
    adminUpdatesForAddingUsersToIncident(uids, incident._id, needName);
    const afterNeedUserMap = getNeedUserMapForNeed(incident._id, needName);

    if (beforeNeedUserMap.uids.length + uids.length !== afterNeedUserMap.uids.length) {
      chai.assert(false, `Number of users assigned to need should be ${uids.length} more than before it started`)
    }
  });
  it('should remove user from Assignment DB since they participated', () => {

    const needName = CONSTANTS.EXPERIENCES[testExperience].contributionTypes[0].needName;
    const incident = Incidents.findOne(testIncident);

    // Adding 3 users
    const uids_to_add = [Random.id(), Random.id(), Random.id()];
    adminUpdatesForAddingUsersToIncident(uids_to_add, incident._id, needName);
    const beforeNeedUserMap = getNeedUserMapForNeed(incident._id, needName);

    // One user participated, so we will remove them
    const uids_to_remove = [uids_to_add[0]];
    adminUpdatesForRemovingUsersToIncident(uids_to_remove, incident._id, needName);
    const afterNeedUserMap = getNeedUserMapForNeed(incident._id, needName);

    if (beforeNeedUserMap.uids.length - 1 !== afterNeedUserMap.uids.length) {
      chai.assert(false, 'One user participated, but one user was NOT removed from the assignments for this need');
    }
  });

});

describe('Strategizer Test: Repeat Submissions to Same Incident', () => {

  const incident_id = Random.id();
  const eid = Random.id();  // doesn't really matter
  const userA = Random.id();
  const NEEDNAME = 'Coffee Time';
  const updatedIncidentsAndNeeds = [
    {
      iid: incident_id,
      needUserMaps: [
        {
          needName: NEEDNAME,
          uids: [userA]
        }
      ]
    }
  ];
  const numberNeeded = 4;
  beforeEach(() => {
    resetDatabase();

    Incidents.insert({
      _id: incident_id,
      eid: eid,
      callbacks: null, // dont need callbacks
      contributionTypes: [
        {
          needName: NEEDNAME,
          situation: {
            detector: Random.id(),
            number: 1
          },
          numberNeeded: numberNeeded,
          notificationDelay: 10 // arbitrary
        }
      ]
    });

    // userA is available for incident.need1
    Availability.insert({
      _id: incident_id,
      needUserMaps: [
        { needName: NEEDNAME, uids: [userA] },
      ],
    });

    // userA NOT assigned to incident yet
    // runNeedsWithThresholdMet does these types of updates via adminUpdatesForAddingUsersToIncident
    // and the call to this function comes after checkIfThreshold
    Assignments.insert({
      _id: incident_id,
      needUserMaps: [
        { needName: NEEDNAME, uids: [] },
      ],
    });

    // Empty submissions ready to be filled
    for (let i = 0; i < numberNeeded; ++i) {
      Submissions.insert({
        _id: Random.id(),
        eid : Random.id(),
        iid : incident_id,
        needName : NEEDNAME,
        uid : null,
      });
    }
  });

  it('user should be able to participate on the first try', () => {
    let incidentsWithUsersToRun = checkIfThreshold(updatedIncidentsAndNeeds);

    // should look something like this
    // { vPnAsWkhjv8EN6n9p: { 'Coffee Time': [ 'tDm59tFq2XBBKQZm5' ] } }
    chai.assert.isNotNull(incidentsWithUsersToRun, 'incidentsWithUsersToRun should not be empty');
    chai.assert.isNotNull(incidentsWithUsersToRun[incident_id], 'incidentsWithUsersToRun should contain incident');
    chai.assert.isNotNull(incidentsWithUsersToRun[incident_id][NEEDNAME], 'incidentsWithUsersToRun should contain needName');
    let uids_for_need = incidentsWithUsersToRun[incident_id][NEEDNAME];
    chai.assert(uids_for_need.includes(userA), 'incidentsWithUsersToRun should contain userA')
  });
  it('user should not be allowed to participate twice', () => {
    // But user has already participated in the past
    Submissions.insert({
      _id: Random.id(),
      eid : Random.id(),
      iid : incident_id,
      needName : NEEDNAME,
      uid : userA,
      content : {
        "this": "is a previous submission"
      }
    });

    let incidentsWithUsersToRun = checkIfThreshold(updatedIncidentsAndNeeds);

    // should look something like this
    // { vPnAsWkhjv8EN6n9p: {} }
    chai.assert.isNotNull(incidentsWithUsersToRun, 'incidentsWithUsersToRun should not be empty');
    chai.assert.isNotNull(incidentsWithUsersToRun[incident_id], 'incidentsWithUsersToRun should contain incident');

    chai.assert.isNil(incidentsWithUsersToRun[incident_id][NEEDNAME], 'incidentsWithUsersToRun should NOT contain needName');
  });

});
