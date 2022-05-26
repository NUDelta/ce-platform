import { resetDatabase } from 'meteor/xolvio:cleaner';

import { runNeedsWithThresholdMet } from "./executor";
import {Incidents} from "../../OCEManager/OCEs/experiences";
import {Submissions} from "../../OCEManager/currentNeeds";
import {Assignments, Availability} from "../databaseHelpers";

describe('Executor - Half Half Need when User is Assigned to "Need 1" and "Need 2"', () => {

  const incident_id = Random.id();
  const eid = Random.id();  // doesn't really matter
  const userA = Random.id();
  const userB = Random.id();
  const place = ''; // rainy doesn't need to have a place associated with it
  const distance = null;
  const needName1 = 'Rainy 1';
  const needName2 = 'Rainy 2';
  const detectorUniqueKey = Random.id();
  const numberNeeded = 2;
  const halfhalfNeedTemplate = {
    needName: null,
    situation: {
      detector: detectorUniqueKey,
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

  // it()
});