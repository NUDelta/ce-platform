import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random'
import { SyncedCron } from 'meteor/percolate:synced-cron';

import { CONFIG } from '../../api/config.js';
import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';
import { Locations } from '../../api/locations/locations.js';
import { Submissions } from "../../api/submissions/submissions";
import { Availability } from "../../api/coordinator/availability";
import { Assignments } from "../../api/coordinator/assignments";
import { log } from '../../api/logs.js';

import { CONSTANTS } from "../../api/testing/testingconstants";
import { onLocationUpdate } from "../../api/locations/methods";
import { createIncidentFromExperience, startRunningIncident } from "../../api/incidents/methods";
import { findUserByEmail } from '../../api/users/methods';
import { Detectors } from "../../api/detectors/detectors";


Meteor.startup(() => {
  SyncedCron.start();
  Meteor.users.remove({});
  Experiences.remove({});
  Submissions.remove({});
  Availability.remove({});
  Assignments.remove({});
  Locations.remove({});
  Incidents.remove({});
  Detectors.remove({});


  if (Meteor.users.find().count() === 0) {
    Object.values(CONSTANTS.users).forEach(function (value) {
      Accounts.createUser(value)
    });
    log.info(`Populated ${ Meteor.users.find().count() } accounts`);

    Object.values(CONSTANTS.detectors).forEach(function (value) {
      Detectors.insert(value);
    });
    log.info(`Populated ${ Detectors.find().count() } detectors`);

    Object.values(CONSTANTS.experiences).forEach(function (value) {
      Experiences.insert(value);
      let incident = createIncidentFromExperience(value);
      startRunningIncident(incident);
    });
    log.info(`Started ${ Experiences.find().count() } experiences`);

    let uid = findUserByEmail('a@gmail.com')._id;
    onLocationUpdate(uid, CONSTANTS.locations.park.lat, CONSTANTS.locations.park.lng, function () {
      return;
    });

  }

});

