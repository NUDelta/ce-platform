import { _ } from 'meteor/underscore';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Accounts } from 'meteor/accounts-base';
import { Experiences } from '../OCEManager/OCEs/experiences';
import { Users } from '../UserMonitor/users/users';
import { Incidents } from '../OCEManager/OCEs/incidents';
import { CONSTANTS } from './testingconstants';
import { onLocationUpdate } from '../UserMonitor/locations/methods';
import { createIncidentFromExperience, startRunningIncident } from '../OCEManager/OCEs/methods';
import { findUserByUsername } from '../UserMonitor/users/methods';
import { Assignments } from '../OpportunisticCoordinator/databaseHelpers';
import { Random } from 'meteor/random'
import { Detectors } from "../UserMonitor/detectors/detectors";
// import {updateSubmission} from "../OCEManager/client/methods";

import "../OCEManager/progressorHelper";


let second = false;

describe('Simple End To End', function () {
  this.timeout(30000);

  let NEEDNAME = 'atFruit';
  beforeEach((done) => {

    if (second) {
      done();

    } else {
      second = true;
      resetDatabase();
      Accounts.createUser(CONSTANTS.users.a);
      Accounts.createUser(CONSTANTS.users.b);
      Accounts.createUser(CONSTANTS.users.c);

      Detectors.insert(CONSTANTS.detectors.fruit);
      Experiences.insert(CONSTANTS.experiences.atLocation, (err) => {
        if (err) {
          console.log("ERROR INSERTING EXPERIENCE", err)
        }
      });

      let incident = createIncidentFromExperience(CONSTANTS.experiences.atLocation);
      startRunningIncident(incident);

      let uid = findUserByUsername('a@gmail.com')._id;
      onLocationUpdate(uid, CONSTANTS.locations.park.lat, CONSTANTS.locations.park.lng, function () {
        done();
      });

    }

  })

  it('user gets added to experience', () => {
    let incident = Incidents.findOne({ eid: CONSTANTS.experiences.atLocation._id });
    let iid = incident._id;
    let user = findUserByUsername('a@gmail.com');

    //user has incident as an active incident
    let addedToUser = (user.profile.activeIncidents.indexOf(iid) !== -1);
    chai.assert(addedToUser, 'active incident not added to user profile');

    //assignments has user assigned
    let assignmentEntry = Assignments.findOne({ _id: iid });

    let needUserMap = assignmentEntry.needUserMaps.find((x) => {
      return x.needName === NEEDNAME;
    });

    chai.assert.typeOf(needUserMap.uids, 'array', 'no needUserMap in Assignment DB');
    chai.assert(needUserMap.uids.indexOf(user._id) !== -1, 'uid not in needUserMap in Assignment DB');
  });

  it('user participates in experience', (done) => {
    let incident = Incidents.findOne({ eid: CONSTANTS.experiences.atLocation._id });
    let iid = incident._id;
    let user = findUserByUsername('a@gmail.com');

    let submission = {
      uid: user._id,
      eid: CONSTANTS.experiences.atLocation._id,
      iid: iid,
      needName: NEEDNAME,
      content: {},
      timestamp: Date.now(),
      lat: 43,
      lng: -87,
    };

    updateSubmission(submission);

    Meteor.setTimeout(function () {
      chai.assert((user.profile.activeIncidents.indexOf(iid) === -1), 'active incident not removed from user profile');
      chai.assert((user.profile.pastIncidents.indexOf(iid) !== -1), 'past incident not added to user profile');
      done()
    }, 20 * 1000);

  });

});