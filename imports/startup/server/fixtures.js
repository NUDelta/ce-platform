import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { SyncedCron } from 'meteor/percolate:synced-cron';

import { CONFIG } from '../../api/config.js';
import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';
import { Locations } from '../../api/locations/locations.js';
import { Images } from '../../api/images/images.js';
import { TextEntries } from '../../api/text-entries/text-entries.js';
import { Cerebro } from '../../api/cerebro/server/cerebro-server.js';
import { insertPhoto } from '../../api/images/methods.js';
import { log } from '../../api/logs.js';

import { LOCATIONS } from './data.js';



Meteor.startup(() => {


  SyncedCron.start();
  if(true){
    Meteor.users.remove({});
    // Experiences.remove({});
    // Locations.remove({});
    // Images.remove({});
    // TextEntries.remove({});
    // Incidents.remove({});
  }
  if (Meteor.users.find().count() === 0) {
  //if(true){
    const users = [
      {email: 'gotjennie@gmail.com', password: 'password'},
      {email: 'allisun.96@gmail.com', password: 'password'},
      {email: 'a@gmail.com', password: 'password'},
      {email: 'b@gmail.com', password: 'password'},
      {email: 'c@gmail.com', password: 'password'},
      {email: 'd@gmail.com', password: 'password'},
      {email: 'e@gmail.com', password: 'password'},
      {email: 'f@gmail.com', password: 'password'},
      {email: 'g@gmail.com', password: 'password'},
      {email: 'h@gmail.com', password: 'password'},
      {email: 'i@gmail.com', password: 'password'},
      {email: 'j@gmail.com', password: 'password'},
      {email: 'k@gmail.com', password: 'password'}
    ];

    users.forEach(user => Accounts.createUser(user));
    log.info(`Populated ${ Meteor.users.find().count() } accounts`);

    const jennie = findUserByEmail('j@gmail.com');
    const experiences = [
      {
        name: 'flag',
        author: jennie._id,
        description: "Let's build an American Flag!",
        startText: "Take a picture to help us build an American Flag",
        modules: ['camera'],
        requirements: [],
        optIn: false,
        parts: [{"name": "red", "description": "stripes", "affordance": "grocery", "max": 1}, {"name": "white", "description": "stripes", "affordance": "rain", "max": 1}, {"name": "blue", "description": "stars", "affordance": "beaches", "max": 1}]
      },
      {
        name: 'cheers1',
        author: jennie._id,
        description: "Raise your glass!",
        startText: "Raise your glass and cheers with someone else!",
        modules: ['camera'],
        requirements: [],
        optIn: false,
        parts: [{"name": "left","description": "", "affordance": "pubs", "max": 2}, {"name": "right", "description": "", "affordance": "pubs", "max": 2}]
      }
    ];

    //experiences.forEach(experience => Experiences.insert(experience));
    //log.info(`Populated ${ Experiences.find().count() } experiences`);
  }
});

