import {_} from 'meteor/underscore';
import {resetDatabase} from 'meteor/xolvio:cleaner';
import {Accounts} from 'meteor/accounts-base';
import {Experiences} from '../experiences/experiences';
import {Users} from '../users/users';
import {Incidents} from '../incidents/incidents';
import {CONSTANTS} from './testingconstants';
import {onLocationUpdate} from '../locations/methods';
import {createIncidentFromExperience, startRunningIncident} from '../incidents/methods';
import {findUserByEmail} from '../users/methods';
import {Assignments} from '../coordinator/assignments';
import {Random} from 'meteor/random'
import {Detectors} from "../detectors/detectors";

describe('Simple End To End', function () {
  beforeEach((done) => {
    resetDatabase();
    Accounts.createUser(CONSTANTS.users.a);

    Detectors.insert(CONSTANTS.detectors.fruit);
    Experiences.insert(CONSTANTS.experiences.atLocation, (err) => {
      if (err) {
        console.log("ERROR INSERTING EXPERIENECE", err)
      } else {
        console.log("experiecen intset works!")

      }
    });

    let incident = createIncidentFromExperience(CONSTANTS.experiences.atLocation);
    startRunningIncident(incident);

    let uid = findUserByEmail('a@gmail.com')._id;
    onLocationUpdate(uid, CONSTANTS.locations.park.lat, CONSTANTS.locations.park.lng, function(){
      done();
    });

  });

  it('user gets added to experience', () => {
    let incident = Incidents.findOne({eid: CONSTANTS.experiences.atLocation._id});
    let iid = incident._id;
    let user = findUserByEmail('a@gmail.com');
    console.log("user here", user);
    console.log("iid", iid)
    //user has incident as an active incident
    let addedToUser = (user.profile.activeIncidents.indexOf(iid) !== -1);
    chai.assert(addedToUser, 'active incident not added to user profile');

    //assignments has user assigned
    let assignmentEntry = Assignments.findOne({_id: iid});

    let needUserMap = assignmentEntry.needUserMaps.find((x) => {
      return x.needName === 'atFruit';
    });

    console.log('needUserMap', needUserMap);
    chai.assert.typeOf(needUserMap.uids, 'array', 'no needUserMap in Assignment DB');
    chai.assert(needUserMap.uids.indexOf(user._id) !== -1, 'uid not in needUserMap in Assignment DB');
  })
});