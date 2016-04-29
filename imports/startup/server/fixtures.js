import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { SyncedCron } from 'meteor/percolate:synced-cron';

import { Config } from './config.js';
import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';
import { Locations } from '../../api/locations/locations.js';
import { Images } from '../../api/images/images.js';
import { TextEntries } from '../../api/text-entries/text-entries.js';
import { ParticipationLocations } from '../../api/participation-locations/participation_locations.js';

import { log } from '../../api/logs.js';


import '../../api/users/users.js';

Meteor.startup(() => {
  SyncedCron.start();

  if (Meteor.isDevelopment && Config.CLEAR_USERS) {
    log.warning(`Clearing users...`);
    Meteor.users.remove({});
  }

  if (Meteor.isDevelopment && Config.CLEAR_DB) {
    log.warning(`Clearing database...`);
    Experiences.remove({});
    Locations.remove({});
    Images.remove({});
    TextEntries.remove({});
    ParticipationLocations.remove({});
  }

  if (Meteor.isDevelopment && Config.CLEAR_ACTIVE) {
    log.warning(`Clearing active experiences...`);
    Meteor.users.update({}, {
      $set: {
        'profile.activeExperiences': [],
        'profile.pastIncidents': []
      }
    }, {
      multi: true
    });
    Incidents.remove({});
  }

  if (Meteor.users.find().count() === 0) {
    const admins = [
      {
        email: 'ryanm36@gmail.com',
        password: 'password'
      },
      {
        email: 'kevinjchen94@gmail.com',
        password: 'password'
      },
      {
        email: 'shannon@shannon.com',
        password: 'password'
      }
    ];

    admins.forEach(admin => Accounts.createUser(admin));
    log.info(`Populated ${ Meteor.users.find().count() } accounts`);
  }

  if (Experiences.find().count() === 0) {
    const kevin = Meteor.users.findOne({ 'emails.0.address': 'kevinjchen94@gmail.com' });
    const shannon = Meteor.users.findOne({ 'emails.0.address': 'shannon@shannon.com' });

    const experiences = [
      {
        name: 'Telephone',
        author: kevin._id,
        description: 'Come play an online telephone game with people across the world.',
        startText: 'Telephone is about to start!',
        modules: ['chain'],
        requirements: []
      },
      {
        name: 'Storytime',
        author: kevin._id,
        description: 'Let\'s all write a story together!',
        startText: 'Storytime is about to start!',
        modules: ['chain', 'text'],
        requirements: []
      },
      {
        name: 'Nightlight',
        author: shannon._id,
        description: 'Shine your phone\'s flashlight into the night sky in solidarity with everyone walking in the dark',
        startText: 'Come be a part of Nightlight!',
        modules: ['map'],
        requirements: []
      },
      {
        name: 'Stella Time',
        author: kevin._id,
        description: 'We just want to play with Stella. Take a picture and tell a joke!',
        startText: 'Pet Stella now and take a picture!',
        modules: ['camera', 'text'],
        requirements: ['hasCamera']
      }
    ];

    experiences.forEach(experience => Experiences.insert(experience));
    log.info(`Populated ${ Experiences.find().count() } experiences`);
  }

  // TODO: simulate some submissions


  // if (ParticipationLocations.find().count() === 0) {
  //   const locationData = [
  //     {
  //       userId: 'aKr3vQs7yq3YuoBCL',
  //       lat: '42.05',
  //       lng: '-87.7'
  //     },
  //     {
  //       userId: 'aKr3vQs7yq3YuoBCL',
  //       lat: '42.060531',
  //       lng: '-87.693012'
  //     },
  //     {
  //       userId: 'aKr3vQs7yq3YuoBCL',
  //       lat: '41.93329',
  //       lng: '-87.67607'
  //     }
  //   ];
  //
  //   locationData.forEach(location => ParticipationLocations.insert(location));
  // }
});
