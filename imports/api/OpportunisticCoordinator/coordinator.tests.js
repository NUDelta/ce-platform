import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Availability, Assignments } from './databaseHelpers.js';
import {
  adminUpdatesForAddingUsersToIncident, adminUpdatesForRemovingUsersToIncident, getNeedUserMapForNeed,
  updateAvailability
} from './identifier';
import {CONSTANTS} from "../Testing/testingconstants";
import {createIncidentFromExperience, startRunningIncident,
        setIntersection, sustainedAvailabilities} from "../OCEManager/OCEs/methods";
import {Experiences, Incidents} from "../OCEManager/OCEs/experiences";
import { Submissions } from "../OCEManager/currentNeeds";
import {insertTestOCE } from "./populateDatabase";
import {checkIfThreshold} from "./server/strategizer";
import { log } from "../logs";

describe('Availability Collection Tests', function() {
  this.timeout(10*1000); // extend timeout to wait for asynch functions

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

  it('-- updateAvailability properly handles Availability Collection sideeffects', function(done) {
    let updatedAvailability = updateAvailability('1', {
      [id1]: [['place1', 'need1']],
      [id2]: [['place3', 'need3'], ['place4', 'need4']] });
    // [
    //   {
    //     "iid":"9oW25j3t7iue6fQGg",
    //     "needUserMaps":[
    //       { "needName":"need1", "uids":["1","2","3"] },
    //       { "needName":"need2", "uids":["5","3","4"] }
    //     ]
    //   },
    //   {
    //     "iid":"PSQePJiPoi6hXd6nM",
    //     "needUserMaps":[
    //       { "needName":"need3","uids":["8","2","5","1"]},
    //       {"needName":"need4","uids":["9","14","5","1"]}
    //     ]
    //   }
    // ]

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
          chai.assert(needUserMap.uids.includes('1'), 'user not kept on to need1');
        }

        if (needUserMap.needName === 'need2') {
          chai.assert(!needUserMap.uids.includes('1'), 'user not removed from need2');
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

      // wait to exit this test case until finishing the contents of the setTimeout
      done();
    }, 1*1000);
  });

  it('-- updateAvailability properly returns updatedAvailability', () => {
    let updatedAvailability = updateAvailability('1', {
      [id1]: [['place1', 'need1']],
      [id2]: [['place3', 'need3'], ['place4', 'need4']] });
    // [
    //   {
    //     "iid":"9oW25j3t7iue6fQGg",
    //     "needUserMaps":[
    //       { "needName":"need1", "uids":["1","2","3"] },
    //       { "needName":"need2", "uids":["5","3","4"] }
    //     ]
    //   },
    //   {
    //     "iid":"PSQePJiPoi6hXd6nM",
    //     "needUserMaps":[
    //       { "needName":"need3","uids":["8","2","5","1"]},
    //       {"needName":"need4","uids":["9","14","5","1"]}
    //     ]
    //   }
    // ]

    console.log('updatedAvailability : ' + JSON.stringify(updatedAvailability));

    let [firstEntry, secondEntry] = updatedAvailability;

    let firstEntryNeedNames = firstEntry.needUserMaps.map((needUserMap) => { return needUserMap.needName});
    let secondEntryNeedNames = secondEntry.needUserMaps.map((needUserMap) => { return needUserMap.needName});
    chai.assert(JSON.stringify(firstEntryNeedNames) == JSON.stringify(['need1', 'need2']),
      'updatedAvailability did not have need1 and need2');
    chai.assert(JSON.stringify(secondEntryNeedNames) == JSON.stringify(['need3', 'need4']),
      'updatedAvailability did not have need3 and need4');

    _.forEach(firstEntry.needUserMaps, (needUserMap) => {
      if (needUserMap.needName === 'need1') {
        chai.assert(needUserMap.uids.includes('1'), 'user not kept on to need1');
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

describe('test checkIfThreshold. Single Need, Single UID; allowRepeatContributions: false', () => {

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

  it('user SHOULD be able to participate on the first try', () => {
    let incidentsWithUsersToRun = checkIfThreshold(updatedIncidentsAndNeeds);

    // should look something like this
    // { vPnAsWkhjv8EN6n9p: { 'Coffee Time': [ 'tDm59tFq2XBBKQZm5' ] } }
    chai.assert.isNotNull(incidentsWithUsersToRun, 'incidentsWithUsersToRun should not be empty');
    chai.assert.isNotNull(incidentsWithUsersToRun[incident_id], 'incidentsWithUsersToRun should contain incident');
    chai.assert.isNotNull(incidentsWithUsersToRun[incident_id][NEEDNAME], 'incidentsWithUsersToRun should contain needName');
    let uids_for_need = incidentsWithUsersToRun[incident_id][NEEDNAME];
    chai.assert(uids_for_need.includes(userA), 'incidentsWithUsersToRun should contain userA')
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
          notificationDelay: 1,
          allowRepeatContributions: true
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

  it('user SHOULD be able to participate on the first try', () => {
    let incidentsWithUsersToRun = checkIfThreshold(updatedIncidentsAndNeeds);

    // should look something like this
    // { vPnAsWkhjv8EN6n9p: { 'Coffee Time': [ 'tDm59tFq2XBBKQZm5' ] } }
    chai.assert.isNotNull(incidentsWithUsersToRun, 'incidentsWithUsersToRun should not be empty');
    chai.assert.isNotNull(incidentsWithUsersToRun[incident_id], 'incidentsWithUsersToRun should contain incident');
    chai.assert.isNotNull(incidentsWithUsersToRun[incident_id][NEEDNAME], 'incidentsWithUsersToRun should contain needName');
    let uids_for_need = incidentsWithUsersToRun[incident_id][NEEDNAME];
    chai.assert(uids_for_need.includes(userA), 'incidentsWithUsersToRun should contain userA');
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
    let uids_for_need = incidentsWithUsersToRun[incident_id][NEEDNAME];
    chai.assert(uids_for_need.includes(userA), 'incidentsWithUsersToRun should contain userA');

  });

});

describe('Sustained (place, need) Match for Availability Dictionary', function() {
  let availabilityDictionary = {
    "asianFoodCrawlIncident": [
      ['ramen_dojo', 'noodleNeed', 10.0],
      ['kongs_chinese', 'noodleNeed', 20.5]
    ],
    "groceryBuddiesIncident": [
      ['trader_joes', 'groceryNeed', 20.0]
    ],
    "sunsetTogether": [
      ['', 'sunsetTogetherNeed', undefined],
      ['ramen_dojo', 'sunsetTogetherNeed', undefined],
      ['kongs_chinese', 'sunsetTogetherNeed', undefined],
      ['trader_joes', 'sunsetTogetherNeed', undefined]
    ]
  };

  // sustained success - after notification delay
  let sustainedAfterAvailDict = {
    "asianFoodCrawlIncident": [
      ['ramen_dojo', 'noodleNeed', 3.0]
    ]
  };

  // sustained for not place need -- after notification delay
  let sustainedWeatherTimeNeedAfterAvailDict = {
    "sunsetTogether": [
      ['', 'sunsetTogetherNeed', undefined],
    ]
  };

  // not sustained - after notification delay
  let notSustainedAfterAvailDict = {
    "asianFoodCrawlIncident": [
      ['onsen_oden', 'noodleNeed', 25.0]
    ]
  };

  it('Sustained Incident', function() {
    let incidentIntersection = setIntersection(Object.keys(availabilityDictionary), Object.keys(sustainedAfterAvailDict));
    console.log(incidentIntersection);
    chai.assert.equal(
      JSON.stringify(incidentIntersection),
      JSON.stringify(["asianFoodCrawlIncident"]));
  });

  it('Sustained [Place, Needs]', function() {
    let incident = "asianFoodCrawlIncident";

    let beforePlacesAndNeeds = availabilityDictionary[incident].map((place_need_dist) => place_need_dist.slice(0,2));
    let afterPlacesAndNeeds = sustainedAfterAvailDict[incident].map((place_need_dist) => place_need_dist.slice(0,2));
    let place_need_intersection = setIntersection(
      beforePlacesAndNeeds, afterPlacesAndNeeds);

    chai.assert.equal(
      JSON.stringify(place_need_intersection),
      JSON.stringify([['ramen_dojo', 'noodleNeed']])
    )
  });

  // different places - after notification delay
  it('NOT Sustained [Place, Needs]', function() {
    let incident = "asianFoodCrawlIncident";

    let place_need_intersection = setIntersection(
      availabilityDictionary[incident],
      notSustainedAfterAvailDict[incident]);

    chai.assert.equal(
      JSON.stringify(place_need_intersection),
      JSON.stringify([])
    )
  });

  it('Sustained AvailDict', function() {
    let sustainedAvailDict = sustainedAvailabilities(availabilityDictionary, sustainedAfterAvailDict);
    chai.assert.equal(
      JSON.stringify(sustainedAvailDict),
      JSON.stringify({
        "asianFoodCrawlIncident": [
          ['ramen_dojo', 'noodleNeed', 3.0]
        ]
      })
    )
  });

  it('NOT Sustained AvailDict', function() {
    let sustainedAvailDict = sustainedAvailabilities(availabilityDictionary, notSustainedAfterAvailDict);
    chai.assert.equal(
      JSON.stringify(sustainedAvailDict),
      JSON.stringify({})
    );

    chai.assert.equal(Object.keys(sustainedAvailDict).length, 0);
  });

  it('Sustained NonPlace AvailDict', function() {
    let sustainedAvailDict = sustainedAvailabilities(availabilityDictionary, sustainedWeatherTimeNeedAfterAvailDict);
    chai.assert.equal(
      JSON.stringify(sustainedAvailDict),
      JSON.stringify({
        "sunsetTogether": [
          ['', 'sunsetTogetherNeed', undefined]
        ]
      })
    );
  });
});
