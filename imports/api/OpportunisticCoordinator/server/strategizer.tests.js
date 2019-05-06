import { resetDatabase } from 'meteor/xolvio:cleaner';
import {Incidents} from "../../OCEManager/OCEs/experiences";
import {Submissions} from "../../OCEManager/currentNeeds";
import {Assignments, Availability} from "../databaseHelpers";
import {checkIfThreshold, needAggregator} from "./strategizer";

describe('test checkIfThreshold. Single Need, Single UID; allowRepeatContributions: false', () => {

  const incident_id = Random.id();
  const eid = Random.id();  // doesn't really matter
  const userA = Random.id();
  const NEEDNAME = 'Coffee Time';
  const updatedIncidentsAndNeeds = [
    {
      _id: incident_id,
      needUserMaps: [
        {
          needName: NEEDNAME,
          users: [
            {uid: userA, place: 'placeA', distance: 10.0}
          ]
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
          notificationDelay: 1,
          // not including the parameter defaults to false
          // allowRepeatContributions: false
        }
      ]
    });

    // userA is available for incident.need1
    Availability.insert({
      _id: incident_id,
      needUserMaps: [
        {
          needName: NEEDNAME, users: [
            { uid: userA, place: "place1", distance: 10.0 }
          ]
        },
      ],
    });

    // userA NOT assigned to incident yet
    // runNeedsWithThresholdMet does these types of updates via adminUpdatesForAddingUserToIncident
    // and the call to this function comes after checkIfThreshold
    Assignments.insert({
      _id: incident_id,
      needUserMaps: [
        { needName: NEEDNAME, users: [] },
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

  it('user SHOULD be able to participate on the first try', () => {
    let incidentsWithUsersToRun = checkIfThreshold(updatedIncidentsAndNeeds);

    // should look something like this
    // { vPnAsWkhjv8EN6n9p: { 'Coffee Time': [ 'tDm59tFq2XBBKQZm5' ] } }
    chai.assert.isNotNull(incidentsWithUsersToRun, 'incidentsWithUsersToRun should not be empty');
    chai.assert.isNotNull(incidentsWithUsersToRun[incident_id], 'incidentsWithUsersToRun should contain incident');
    chai.assert.isNotNull(incidentsWithUsersToRun[incident_id][NEEDNAME], 'incidentsWithUsersToRun should contain needName');
    let users_for_need = incidentsWithUsersToRun[incident_id][NEEDNAME];
    let foundUser = users_for_need.find((userMeta) => userMeta.uid === userA);
    chai.assert(foundUser, 'incidentsWithUsersToRun should contain userA');
  });

  it('user SHOULD NOT be allowed to participate twice', () => {
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

    // object should be empty
    let obj = incidentsWithUsersToRun[incident_id];
    if (Object.keys(obj).length === 0 && obj.constructor === Object) {
      // TODO(rlouie): do this with multiple needs going on, or multiple users
      chai.assert(true, 'incidentsWithUsersToRun should NOT contain needName or the User');
    } else {
      chai.assert(false, 'incidentsWithUsersToRun should NOT contain needName or the User');
    }
  });

});

describe('test checkIfThreshold; Single Need, Single UID; allowRepeatContributions: true', () => {

  const incident_id = Random.id();
  const eid = Random.id();  // doesn't really matter
  const userA = Random.id();
  const NEEDNAME = 'Coffee Time';
  const updatedIncidentsAndNeeds = [
    {
      _id: incident_id,
      needUserMaps: [
        {
          needName: NEEDNAME,
          users: [
            {uid: userA, place: 'placeA', distance: 10.0}
          ]
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
          notificationDelay: 1,
          allowRepeatContributions: true
        }
      ]
    });

    // userA is available for incident.need1
    Availability.insert({
      _id: incident_id,
      needUserMaps: [
        {
          needName: NEEDNAME,
          users: [
            {uid: userA, place: 'placeA', distance: 10.0}
          ]
        },
      ],
    });

    // userA NOT assigned to incident yet
    // runNeedsWithThresholdMet does these types of updates via adminUpdatesForAddingUserToIncident
    // and the call to this function comes after checkIfThreshold
    Assignments.insert({
      _id: incident_id,
      needUserMaps: [
        { needName: NEEDNAME, users: [] },
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

  it('user SHOULD be able to participate on the first try', () => {
    let incidentsWithUsersToRun = checkIfThreshold(updatedIncidentsAndNeeds);

    // should look something like this
    // { vPnAsWkhjv8EN6n9p: { 'Coffee Time': [ 'tDm59tFq2XBBKQZm5' ] } }
    chai.assert.isNotNull(incidentsWithUsersToRun, 'incidentsWithUsersToRun should not be empty');
    chai.assert.isNotNull(incidentsWithUsersToRun[incident_id], 'incidentsWithUsersToRun should contain incident');
    chai.assert.isNotNull(incidentsWithUsersToRun[incident_id][NEEDNAME], 'incidentsWithUsersToRun should contain needName');
    let users_for_need = incidentsWithUsersToRun[incident_id][NEEDNAME];
    let foundUser = users_for_need.find((userMeta) => userMeta.uid === userA);
    chai.assert(foundUser, 'incidentsWithUsersToRun should contain userA');
  });

  it('user ALSO SHOULD be allowed to participate twice', () => {
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
    // { vPnAsWkhjv8EN6n9p: { 'Coffee Time': [ 'tDm59tFq2XBBKQZm5' ] } }
    chai.assert.isNotNull(incidentsWithUsersToRun, 'incidentsWithUsersToRun should not be empty');
    chai.assert.isNotNull(incidentsWithUsersToRun[incident_id], 'incidentsWithUsersToRun should contain incident');
    chai.assert.isNotNull(incidentsWithUsersToRun[incident_id][NEEDNAME], 'incidentsWithUsersToRun should contain needName');
    let users_for_need = incidentsWithUsersToRun[incident_id][NEEDNAME];
    let foundUser = users_for_need.find((userMeta) => userMeta.uid === userA);
    chai.assert(foundUser, 'incidentsWithUsersToRun should contain userA');
  });

});

describe('Half Half Rainy Need - with [userA, userB] matching the requirements of the need', () => {
  // TODO(rlouie): Include a link to a diagram for this test

  const incident_id = Random.id();
  const eid = Random.id();  // doesn't really matter
  const userA = Random.id();
  const userB = Random.id();
  const place = ''; // rainy doesn't need to have a place associated with it
  const distance = null;
  const needName1 = 'Rainy 1';
  const needName2 = 'Rainy 2';
  const detectorId = Random.id();
  const numberNeeded = 2;
  const halfhalfNeedTemplate = {
      needName: null,
      situation: {
        detector: detectorId,
        number: 1
      },
      numberNeeded: numberNeeded,
      notificationDelay: 1,
      allowRepeatContributions: false
  };
  // userA is available, and already is assigned to the need, but has not participated yet
  // userB triggered the coordination process, and is also available
  const updatedIncidentsAndNeeds = [
    {
      _id: incident_id,
      needUserMaps: [
        {
          needName: needName1,
          users: [
            {uid: userA, place: place, distance: distance},
            {uid: userB, place: place, distance: distance}
          ]
        },
        {
          needName: needName2,
          users: [
            {uid: userA, place: place, distance: distance},
            {uid: userB, place: place, distance: distance}
          ]
        }
      ]
    }
  ];

  beforeEach(() => {
    resetDatabase();

    let halfhalfNeed1 = JSON.parse(JSON.stringify(halfhalfNeedTemplate));
    halfhalfNeed1.needName = needName1;
    let halfhalfNeed2 = JSON.parse(JSON.stringify(halfhalfNeedTemplate));
    halfhalfNeed2.needName = needName2;
    Incidents.insert({
      _id: incident_id,
      eid: eid,
      callbacks: null, // dont need callbacks
      contributionTypes: [
        halfhalfNeed1,
        halfhalfNeed2
      ]
    });

    Availability.insert(updatedIncidentsAndNeeds[0]);

    // userA IS ALREADY assigned to incident, but has not participated
    // userB NOT assigned to incident yet
    // runNeedsWithThresholdMet does these types of updates via adminUpdatesForAddingUserToIncident
    // and the call to this function comes after checkIfThreshold
    Assignments.insert({
      _id: incident_id,
      needUserMaps: [
        {
          needName: needName1,
          users: [
            {uid: userA, place: place, distance: distance}
          ]
        },
        {
          needName: needName2,
          users: [
            {uid: userA, place: place, distance: distance},
            {uid: userB, place: place, distance: distance}
          ]
        }
      ],
    });

    // Empty submissions ready to be filled
    for (let i = 0; i < numberNeeded; ++i) {
      Submissions.insert({
        _id: Random.id(),
        eid : eid,
        iid : incident_id,
        needName : needName1,
        uid : null,
      });
      Submissions.insert({
        _id: Random.id(),
        eid : eid,
        iid : incident_id,
        needName : needName2,
        uid : null,
      });
    }
  });

  it('should allow userB to still be assigned to all open half half needs the first time', () => {
    let incidentsWithUsersToRun = checkIfThreshold(updatedIncidentsAndNeeds);

    // should look something like this
    // { vPnAsWkhjv8EN6n9p: { 'Coffee Time': [ 'tDm59tFq2XBBKQZm5' ] } }
    chai.assert.isNotNull(incidentsWithUsersToRun, 'incidentsWithUsersToRun should not be empty');
    chai.assert.isNotNull(incidentsWithUsersToRun[incident_id], 'incidentsWithUsersToRun should contain incident');
    chai.assert.isNotNull(incidentsWithUsersToRun[incident_id][needName1], `incidentsWithUsersToRun should contain ${needName1}`);
    let users_for_need1 = incidentsWithUsersToRun[incident_id][needName1];
    let foundUserForNeed1 = users_for_need1.find((userMeta) => userMeta.uid === userB);
    chai.assert(foundUserForNeed1, `incidentsWithUsersToRun, ${needName1}, should contain userB`);
    chai.assert.isNotNull(incidentsWithUsersToRun[incident_id][needName2], `incidentsWithUsersToRun should contain ${needName2}`);
    let users_for_need2 = incidentsWithUsersToRun[incident_id][needName2];
    let foundUserForNeed2 = users_for_need2.find((userMeta) => userMeta.uid === userB);
    chai.assert(foundUserForNeed2, `incidentsWithUsersToRun, ${needName2}, should contain userB`);
  });


  // it('user ALSO SHOULD be allowed to participate twice', () => {
  //   // But user has already participated in the past
  //   Submissions.insert({
  //     _id: Random.id(),
  //     eid : Random.id(),
  //     iid : incident_id,
  //     needName : NEEDNAME,
  //     uid : userA,
  //     content : {
  //       "this": "is a previous submission"
  //     }
  //   });
  //
  //   let incidentsWithUsersToRun = checkIfThreshold(updatedIncidentsAndNeeds);
  //
  //   // should look something like this
  //   // { vPnAsWkhjv8EN6n9p: { 'Coffee Time': [ 'tDm59tFq2XBBKQZm5' ] } }
  //   chai.assert.isNotNull(incidentsWithUsersToRun, 'incidentsWithUsersToRun should not be empty');
  //   chai.assert.isNotNull(incidentsWithUsersToRun[incident_id], 'incidentsWithUsersToRun should contain incident');
  //   chai.assert.isNotNull(incidentsWithUsersToRun[incident_id][NEEDNAME], 'incidentsWithUsersToRun should contain needName');
  //   let users_for_need = incidentsWithUsersToRun[incident_id][NEEDNAME];
  //   let foundUser = users_for_need.find((userMeta) => userMeta.uid === userA);
  //   chai.assert(foundUser, 'incidentsWithUsersToRun should contain userA');
  // });

});


describe('Dynamic Loading of Exact Participate Need - needAggregator', () => {

  const incident_id = Random.id();
  const eid = Random.id();  // doesn't really matter
  const needName1 = 'Rainy 1';
  const needName2 = 'Rainy 2';
  const detectorId = Random.id();
  const numberNeeded = 2;
  const halfhalfNeedTemplate = {
    needName: null,
    situation: {
      detector: detectorId,
      number: 1
    },
    numberNeeded: numberNeeded,
    notificationDelay: 1,
    allowRepeatContributions: false
  };
  let halfhalfNeed1 = JSON.parse(JSON.stringify(halfhalfNeedTemplate));
  halfhalfNeed1.needName = needName1;
  let halfhalfNeed2 = JSON.parse(JSON.stringify(halfhalfNeedTemplate));
  halfhalfNeed2.needName = needName2;

  before(() => {
    resetDatabase();

    Incidents.insert({
      _id: incident_id,
      eid: eid,
      callbacks: null, // dont need callbacks
      contributionTypes: [
        halfhalfNeed1,
        halfhalfNeed2
      ]
    });

  });

  it('should group Half Half Needs based on their common detector', () => {
    let incident = Incidents.findOne({_id: iid});
    let res = needAggregator(incident);

    chai.assert(JSON.stringify(res),
                JSON.stringify({
                  [detectorId]: [needName1, needName2]
                }))
  });
});