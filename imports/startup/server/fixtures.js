import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { SyncedCron } from 'meteor/percolate:synced-cron';

import { CONFIG } from '../../api/config.js';
import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';
import { Locations } from '../../api/locations/locations.js';
import { Images } from '../../api/images/images.js';
import { TextEntries } from '../../api/text-entries/text-entries.js';
import { ParticipationLocations } from '../../api/participation-locations/participation_locations.js';

import { updateLocation } from '../../api/locations/methods.js';
import { log } from '../../api/logs.js';

import { LOCATIONS } from './data.js';

function findUserByEmail(email) {
  return Meteor.users.findOne({ 'emails.0.address': email });
}

Meteor.startup(() => {
  SyncedCron.start();

  if (Meteor.isDevelopment && CONFIG.CLEAR_USERS) {
    log.warning(`Clearing users...`);
    Meteor.users.remove({});
  }

  if (Meteor.isDevelopment && CONFIG.CLEAR_DB) {
    log.warning(`Clearing database...`);
    Experiences.remove({});
    Locations.remove({});
    Images.remove({});
    TextEntries.remove({});
    ParticipationLocations.remove({});
  }

  if (Meteor.isDevelopment && CONFIG.CLEAR_ACTIVE) {
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

  if (Meteor.isDevelopment && CONFIG.CLEAR_LOCATIONS) {
    log.warning(`Clearing locations...`);
    Locations.remove({});
  }

  if (CONFIG.CLEANUP) {
    // Remove orphaned experiences
    Incidents.find().forEach((incident) => {
      const experience = Experiences.findOne(incident.experience);
      if (!experience) {
        Incidents.remove(incident._id);
      }
    });

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

    const others = [
      {
        email: 'hq@northwestern.edu',
        password: 'password'
      },
      {
        email: 'yk@u.northwestern.edu',
        password: 'password'
      },
      {
        email: 'josh@u.northwestern.edu',
        password: 'password'
      }
    ];

    admins.forEach(admin => Accounts.createUser(admin));
    others.forEach(other => Accounts.createUser(other));
    log.info(`Populated ${ Meteor.users.find().count() } accounts`);
  }

  if (Experiences.find().count() === 0) {
    const kevin = findUserByEmail('kevinjchen94@gmail.com');
    const shannon = findUserByEmail('shannon@shannon.com');

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
        author: kevin._id,
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
      },
      {
        name: 'I\'m Hungry',
        author: kevin._id,
        description: 'Take a pic of yo meal at a restaurant right now!',
        startText: 'Take a picture of your food please!',
        modules: ['camera'],
        requirements: ['hasCamera'],
        location: 'restaurants'
      }
    ];

    experiences.forEach(experience => Experiences.insert(experience));
    log.info(`Populated ${ Experiences.find().count() } experiences`);
  }

  if (Locations.find().count() === 0) {
    const kevin = findUserByEmail('kevinjchen94@gmail.com');
    const shannon = findUserByEmail('shannon@shannon.com');
    const ryan = findUserByEmail('ryanm36@gmail.com');
    const hq = findUserByEmail('hq@northwestern.edu');
    const yk = findUserByEmail('yk@u.northwestern.edu');
    const josh = findUserByEmail('josh@u.northwestern.edu');

    updateLocation.call({
      uid: josh._id,
      lat: LOCATIONS.FUNKY_MONK.lat,
      lng: LOCATIONS.FUNKY_MONK.lng
    });
    updateLocation.call({
      uid: shannon._id,
      lat: LOCATIONS.EDZOS.lat,
      lng: LOCATIONS.EDZOS.lng
    });
    updateLocation.call({
      uid: ryan._id,
      lat: LOCATIONS.TECH.lat,
      lng: LOCATIONS.TECH.lng
    });
    updateLocation.call({
      uid: hq._id,
      lat: LOCATIONS.CRISP.lat,
      lng: LOCATIONS.CRISP.lng
    });
    updateLocation.call({
      uid: yk._id,
      lat: LOCATIONS.ART_INSTITUTE.lat,
      lng: LOCATIONS.ART_INSTITUTE.lng
    });

    log.info(`There are now ${ Locations.find().count() } locations collected.`);
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
