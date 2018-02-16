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

import { LOCATIONS } from "../../api/testing/testinglocations";
import { onLocationUpdate } from "../../api/locations/methods";
import { createIncidentFromExperience, startRunningIncident } from "../../api/incidents/methods";
import { findUserByEmail } from '../../api/users/methods';


Meteor.startup(() => {
  SyncedCron.start();
  Meteor.users.remove({});
  Experiences.remove({});
  Submissions.remove({});
  Availability.remove({});
  Assignments.remove({});
  Locations.remove({});
  Incidents.remove({});

  if (Meteor.users.find().count() === 0) {
    if (true) {
      const users = [
        { email: 'gotjennie@gmail.com', password: 'password' },
        { email: 'allisun.96@gmail.com', password: 'password' },
        { email: 'a@gmail.com', password: 'password' },
        { email: 'b@gmail.com', password: 'password' },
        { email: 'c@gmail.com', password: 'password' },
        { email: 'd@gmail.com', password: 'password' },
        { email: 'e@gmail.com', password: 'password' },
        { email: 'f@gmail.com', password: 'password' },
        { email: 'g@gmail.com', password: 'password' },
        { email: 'h@gmail.com', password: 'password' },
        { email: 'i@gmail.com', password: 'password' },
        { email: 'j@gmail.com', password: 'password' },
        { email: 'k@gmail.com', password: 'password' }
      ];

      users.forEach(user => Accounts.createUser(user));
      log.info(`Populated ${ Meteor.users.find().count() } accounts`);

      // create a test experience
      let experienceOne = {
        _id: Random.id(),
        name: 'You\'re at a restaurant',
        participateTemplate: 'atLocation',
        resultsTemplate: 'photoCollage',
        contributionTypes: [
          {
            needName: 'atRestaurant', situation: {detector: 'restaurant', number: '1'},
            toPass: {item: 'restaurant'}, numberNeeded: 10
          }],
        description: 'This is a simple experience for testing',
        notificationText: 'Please participate in this test experience!',
      };

      Experiences.insert(experienceOne);
      let incident = createIncidentFromExperience(experienceOne);
      startRunningIncident(incident);

      let uid = findUserByEmail('a@gmail.com')._id;
      onLocationUpdate(uid, LOCATIONS.burgers.lat, LOCATIONS.burgers.lng);
    }
  }
});

