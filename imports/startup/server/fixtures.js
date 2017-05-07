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
import { Cerebro } from '../../api/cerebro/server/cerebro-server.js';

import { updateLocation } from '../../api/locations/methods.js';
import { insertPhoto } from '../../api/images/methods.js';
import { activateNewIncident } from '../../api/incidents/methods.js';
import { log } from '../../api/logs.js';

import { LOCATIONS } from './data.js';

Meteor.startup(() => {
  SyncedCron.start();
  if(false){
    Meteor.users.remove({});
    Experiences.remove({});
    Locations.remove({});
    Images.remove({});
    TextEntries.remove({});
    ParticipationLocations.remove({});
    Incidents.remove({});
  }
  if (Meteor.users.find().count() === 0) {
  //if(true){
    const users = [
      {email: 'gotjennie@gmail.com', password: 'password'},
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

    experiences.forEach(experience => Experiences.insert(experience));
    log.info(`Populated ${ Experiences.find().count() } experiences`);
  }
});

function findUserByEmail(email) {
  return Meteor.users.findOne({ 'emails.0.address': email });
}


// function findUserByEmail(email) {
//   return Meteor.users.findOne({ 'emails.0.address': email });
// }
//
// Meteor.startup(() => {
//   SyncedCron.start();
//
//   if (Meteor.isDevelopment && CONFIG.CLEAR_USERS) {
//     log.warning(`Clearing users...`);
//     Meteor.users.remove({});
//   }
//
//   if (Meteor.isDevelopment && CONFIG.CLEAR_DB) {
//     log.warning(`Clearing database...`);
//     Meteor.users.update({}, {
//       $set: {
//         'profile.activeExperiences': [],
//         'profile.pastIncidents': []
//       }
//     }, {
//       multi: true
//     });
//     Experiences.remove({});
//     Locations.remove({});
//     Images.remove({});
//     TextEntries.remove({});
//     ParticipationLocations.remove({});
//     Incidents.remove({});
//   }
//
//   if (Meteor.isDevelopment && CONFIG.CLEAR_ACTIVE) {
//     log.warning(`Clearing active experiences...`);
//     Meteor.users.update({}, {
//       $set: {
//         'profile.activeExperiences': [],
//         'profile.pastIncidents': []
//       }
//     }, {
//       multi: true
//     });
//     Incidents.remove({});
//   }
//
//   if (Meteor.isDevelopment && CONFIG.CLEAR_LOCATIONS) {
//     log.warning(`Clearing locations...`);
//     Locations.remove({});
//   }
//
//   if (Meteor.isDevelopment && CONFIG.CLEAR_SUBMISSIONS) {
//     log.warning(`Clearing submissions...`);
//     Images.remove({});
//     TextEntries.remove({});
//     ParticipationLocations.remove({});
//   }
//
//   if (CONFIG.CLEANUP) {
//     // Remove orphaned experiences
//     Incidents.find().forEach((incident) => {
//       const experience = Experiences.findOne(incident.experienceId);
//       if (!experience) {
//         Incidents.remove(incident._id);
//       }
//     });
//
//   }
//
//   if (Meteor.users.find().count() === 0) {
//     const admins = [
//       {
//         email: 'ryanm36@gmail.com',
//         password: 'password'
//       },
//       {
//         email: 'kevinjchen94@gmail.com',
//         password: 'password'
//       },
//       {
//         email: 'shannon@shannon.com',
//         password: 'password'
//       }
//     ];
//
//     const others = [
//       {
//         email: 'hq@northwestern.edu',
//         password: 'password'
//       },
//       {
//         email: 'yk@u.northwestern.edu',
//         password: 'password'
//       },
//       {
//         email: 'josh@u.northwestern.edu',
//         password: 'password'
//       }
//     ];
//
//     admins.forEach(admin => Accounts.createUser(admin));
//     others.forEach(other => Accounts.createUser(other));
//     log.info(`Populated ${ Meteor.users.find().count() } accounts`);
//   }
//
//   if (Experiences.find().count() === 0) {
//     const kevin = findUserByEmail('kevinjchen94@gmail.com');
//     const shannon = findUserByEmail('shannon@shannon.com');
//     const experiences = [
//       {
//         name: 'Telephone',
//         author: kevin._id,
//         description: 'Come play an online telephone game with people across the world.',
//         startText: 'Telephone is about to start!',
//         modules: ['chain'],
//         requirements: [],
//         optIn: false,
//         affordance: "talk"
//       },
//       {
//         name: 'Storytime',
//         author: kevin._id,
//         description: 'Let\'s all write a story together!',
//         startText: 'Storytime is about to start!',
//         modules: ['text'],
//         requirements: [],
//         optIn: false,
//         affordance: "sit",
//         custom_notification: 'require2users'
//       },
//       {
//         name: 'Nightlight',
//         author: kevin._id,
//         description: 'Shine your phone\'s flashlight into the night sky in solidarity with everyone walking in the dark',
//         startText: 'Come be a part of Nightlight!',
//         modules: ['map'],
//         requirements: [],
//         optIn: true,
//         affordance: "darkness"
//       },
//       {
//         name: 'Stella Time',
//         author: kevin._id,
//         description: 'We just want to play with Stella. Take a picture and tell a joke!',
//         startText: 'Pet Stella now and take a picture!',
//         modules: ['camera', 'text'],
//         requirements: ['hasCamera'],
//         optIn: false,
//       },
//       {
//         name: 'Sunset',
//         author: kevin._id,
//         description: 'Take a picture of the sunset!',
//         startText: 'Take a picture of the sunset to help us make a timelapse video!',
//         modules: ['camera'],
//         requirements: ['hasCamera'],
//         optIn: false,
//         route: 'sunset',
//         custom_notification: 'require2users'
//       },
//       {
//         name: 'cheers',
//         author: kevin._id,
//         description: 'cheers yay',
//         startText: 'cheers with us and take a pic',
//         modules: ['camera'],
//         requirements: ['hasCamera'],
//         optIn: false,
//         route: 'cheers',
//         // custom_notification: 'require2users'
//       }
//     ];
//
//     experiences.forEach(experience => Experiences.insert(experience));
//     log.info(`Populated ${ Experiences.find().count() } experiences`);
//   }
//
//   if (Experiences.find({route: 'button_game'}).count() === 0) {
//     const ryan = findUserByEmail('ryanm36@gmail.com');
//     const button_game = {
//       name: 'Button Game',
//       author: ryan._id,
//       description: 'Play a mysterious button game with the community!',
//       startText: 'The clock is ticking!',
//       modules: [],
//       requirements: [],
//       route: 'button_game',
//       optIn: false
//     };
//
//     Experiences.insert(button_game);
//   }
//
//   if (Meteor.isDevelopment && Locations.find().count() === 0) {
//     const kevin = findUserByEmail('kevinjchen94@gmail.com');
//     const shannon = findUserByEmail('shannon@shannon.com');
//     const ryan = findUserByEmail('ryanm36@gmail.com');
//     const hq = findUserByEmail('hq@northwestern.edu');
//     const yk = findUserByEmail('yk@u.northwestern.edu');
//     const josh = findUserByEmail('josh@u.northwestern.edu');
//
//     updateLocation.call({
//       uid: josh._id,
//       lat: LOCATIONS.FUNKY_MONK.lat,
//       lng: LOCATIONS.FUNKY_MONK.lng
//     });
//     updateLocation.call({
//       uid: shannon._id,
//       lat: LOCATIONS.EDZOS.lat,
//       lng: LOCATIONS.EDZOS.lng
//     });
//     updateLocation.call({
//       uid: ryan._id,
//       lat: LOCATIONS.TECH.lat,
//       lng: LOCATIONS.TECH.lng
//     });
//     updateLocation.call({
//       uid: hq._id,
//       lat: LOCATIONS.CRISP.lat,
//       lng: LOCATIONS.CRISP.lng
//     });
//     updateLocation.call({
//       uid: yk._id,
//       lat: LOCATIONS.ART_INSTITUTE.lat,
//       lng: LOCATIONS.ART_INSTITUTE.lng
//     });
//
//     log.info(`Populated ${ Locations.find().count() } locations`);
//   }
//
//
//   if (Meteor.isDevelopment && Images.find().count() === 0) {
//     const stellaTime = Experiences.findOne({ name: 'Stella Time' });
//     const kevin = findUserByEmail('kevinjchen94@gmail.com');
//     const incidentId = activateNewIncident.call({
//       name: stellaTime.name,
//       experienceId: stellaTime._id,
//       launcher: kevin._id
//     });
//
//     const userIds = Meteor.users.find().fetch().map(user => user._id);
//     Cerebro.setActiveExperiences(userIds, stellaTime._id);
//     Cerebro.addIncidents(userIds, incidentId);
//
//     const images = [
//       {
//         title: 'stella1.jpg',
//         url: 'fixtures/stella_time/stella1.jpg',
//         incidentId: incidentId,
//         location: LOCATIONS.TECH,
//         caption: 'Stella is asleep!'
//       },
//       {
//         title: 'stella2.jpg',
//         url: 'fixtures/stella_time/stella2.jpg',
//         incidentId: incidentId,
//         location: LOCATIONS.FUNKY_MONK,
//         caption: 'Stella at the Funky Monk'
//       },
//       {
//         title: 'stella3.jpg',
//         url: 'fixtures/stella_time/stella3.jpg',
//         incidentId: incidentId,
//         location: LOCATIONS.CRISP,
//         caption: 'i <3 stella'
//       },
//       {
//         title: 'stella4.jpg',
//         url: 'fixtures/stella_time/stella4.jpg',
//         incidentId: incidentId,
//         location: LOCATIONS.EDZOS,
//         caption: 'begging!'
//       }
//     ];
//
//     images.forEach((image) => {
//       // TODO: text entry
//       const buffer = new Buffer(Assets.getBinary(image.url));
//       insertPhoto.call({
//         incidentId: image.incidentId,
//         image: buffer.toString('base64'),
//         location: image.location,
//         caption: image.caption
//       });
//     });
//
//     log.info(`Populated ${ Images.find().count() } images`);
//   }
//   // TODO: simulate some submissions
//   // if (ParticipationLocations.find().count() === 0) {
//   //   const locationData = [
//   //     {
//   //       userId: 'aKr3vQs7yq3YuoBCL',
//   //       lat: '42.05',
//   //       lng: '-87.7'
//   //     },
//   //     {
//   //       userId: 'aKr3vQs7yq3YuoBCL',
//   //       lat: '42.060531',
//   //       lng: '-87.693012'
//   //     },
//   //     {
//   //       userId: 'aKr3vQs7yq3YuoBCL',
//   //       lat: '41.93329',
//   //       lng: '-87.67607'
//   //     }
//   //   ];
//   //
//   //   locationData.forEach(location => ParticipationLocations.insert(location));
//   // }
// });
