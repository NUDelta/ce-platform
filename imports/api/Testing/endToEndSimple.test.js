import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Accounts } from 'meteor/accounts-base';
import { Experiences } from '../OCEManager/OCEs/experiences';
import { Users } from '../UserMonitor/users/users';
import { Incidents } from "../OCEManager/OCEs/experiences";
import { CONSTANTS } from './testingconstants';
import { onLocationUpdate } from '../UserMonitor/locations/methods';
import { createIncidentFromExperience, startRunningIncident } from '../OCEManager/OCEs/methods';
import { findUserByUsername } from "../UserMonitor/users/methods";
import { Assignments} from "../OpportunisticCoordinator/databaseHelpers";
import { Random } from 'meteor/random'
import { Detectors } from "../UserMonitor/detectors/detectors";
import { updateSubmission} from "../OCEManager/progressor";

import "../OCEManager/progressorHelper";


let second = false;

describe('Simple End To End', function () {
  this.timeout(30000);

  let OCE_NAME = 'scavengerHunt';
  let NEEDNAME = 'greenProduce';
  let USERNAME = 'garrett';

  beforeEach((done) => {

    if (second) {
      done();

    } else {
      second = true;
      resetDatabase();
      Accounts.createUser(CONSTANTS.USERS[USERNAME]);

      Detectors.insert(CONSTANTS.DETECTORS.produce);

      // Start OCE
      let testExp = CONSTANTS.EXPERIENCES[OCE_NAME];
      Experiences.insert(testExp);
      let testIncident = createIncidentFromExperience(testExp);
      startRunningIncident(testIncident);

      let uid = findUserByUsername(USERNAME)._id;
      onLocationUpdate(uid, CONSTANTS.LOCATIONS.grocery.lat, CONSTANTS.LOCATIONS.grocery.lng, function () {
        done();
      });
    }
  });

  it('user gets added to experience', () => {
    let incident = Incidents.findOne({ eid: CONSTANTS.EXPERIENCES[OCE_NAME]._id });
    let iid = incident._id;
    let user = findUserByUsername(USERNAME);

    //user has incident as an active incident
    chai.assert(user.profile.activeIncidents.includes(iid), 'active incident not added to user profile');

    //assignments has user assigned
    let assignmentEntry = Assignments.findOne({ _id: iid });

    let needUserMap = assignmentEntry.needUserMaps.find((x) => {
      return x.needName ===  NEEDNAME;
    });

    chai.assert.typeOf(needUserMap.uids, 'array', 'no needUserMap in Assignment DB');
    chai.assert(needUserMap.uids.includes(user._id), 'uid not in needUserMap in Assignment DB');
  });

  it('user participates in experience', (done) => {
    let incident = Incidents.findOne({ eid: CONSTANTS.EXPERIENCES[OCE_NAME]._id });
    let iid = incident._id;
    let user = findUserByUsername(USERNAME);

    let submission = {
      uid: user._id,
      eid: CONSTANTS.EXPERIENCES[OCE_NAME]._id,
      iid: iid,
      needName: NEEDNAME,
      content: {},
      timestamp: Date.now(),
      lat: CONSTANTS.LOCATIONS.grocery.lat,
      lng: CONSTANTS.LOCATIONS.grocery.lng,
    };

    updateSubmission(submission);

    Meteor.setTimeout(function () {
      chai.assert.isFalse(user.profile.activeIncidents.includes(iid), 'active incident not removed from user profile');
      chai.assert(user.profile.pastIncidents.includes(iid), 'past incident not added to user profile');
      done()
    }, 20 * 1000);

  });

});