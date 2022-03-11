import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random'
import {SyncedCron} from 'meteor/littledata:synced-cron';

import { CONFIG } from '../../api/config.js';
import { Experiences, Incidents } from '../../api/OCEManager/OCEs/experiences.js';
import { Locations } from '../../api/UserMonitor/locations/locations.js';
import { Messages } from '../../api/Messages/messages.js';
import { Submissions } from "../../api/OCEManager/currentNeeds";
import { Assignments, Availability, ParticipatingNow } from "../../api/OpportunisticCoordinator/databaseHelpers";
import { Images, Avatars } from '../../api/ImageUpload/images.js';
import { log } from '../../api/logs.js';

import { CONSTANTS } from "../../api/Testing/testingconstants";
import { createIncidentFromExperience, startRunningIncident } from "../../api/OCEManager/OCEs/methods.js";
import { findUserByUsername } from '../../api/UserMonitor/users/methods';
import { Detectors } from "../../api/UserMonitor/detectors/detectors";
import { onTimeElapsedUpdateTimeWeatherContext, updateAllUsersTimeWeatherContext } from '../../api/UserMonitor/locations/methods';

Meteor.startup(() => {
  log.debug(`Running in mode: ${process.env.MODE}`);

  if(!(process.env.MODE === "DEV" || process.env.MODE === "PROD")){
    if(CONFIG.DEBUG){
      clearDatabase();
      createTestData();
    }
  }

  SyncedCron.add({
    name: 'Update weather and time context for all users at a set interval',
    schedule: function(parser) {
      // parser is a later.parse object
      return parser.text(`every ${CONFIG.CONTEXT_POLL_INTERVAL} min`);
    },
    job: function() {
      updateAllUsersTimeWeatherContext();
      // let usersWithLocation = Locations.find().map(location => uid);

      // locationObjects.forEach(location => {
      //   onTimeElapsedUpdateTimeWeatherContext(location.uid, function(uid) {
      //     if (CONFIG.DEBUG) {
      //       console.log(`Updated weather and time context for user ${uid}`);
      //     }
      //   });
      // });
    }
  });

  SyncedCron.start();

});

// In chrome browser console...
// Meteor.call('freshDatabase')
// Meteor.call('createTestUsers')
Meteor.methods({
  createTestUsers(){
    createTestData();
  },
  freshDatabase() {
    clearDatabase();
  },
  startTestExperiences(){
    createTestExperiences();

    Object.values(CONSTANTS.DETECTORS).forEach(function (pair) {
      pair.forEach(function (value) {
        Detectors.insert(value);
      });
    })
    log.info(`${CONSTANTS.DETECTORS}`);
    log.info(`Populated ${ Detectors.find().count() } detectors`);
  },
  clearSubmission(){
    Submissions.remove({});
  },
  clearEmptySubmission(){
    clearEmptySubmission()
  },
  clearDatabaseProd(){
    clearDatabaseProd()
  },
  createAdditionalTestExperiences(){
    createAdditionalTestExperiences()
  }

});

function clearDatabase () {
  Meteor.users.remove({});
  Experiences.remove({});
  Submissions.remove({});
  Availability.remove({});
  Messages.remove({});
  Assignments.remove({});
  Locations.remove({});
  Incidents.remove({});
  Detectors.remove({});
  Images.remove({});
  Avatars.remove({});
  ParticipatingNow.remove({});
}

function clearDatabaseProd () {
  // Meteor.users.remove({});
  Experiences.remove({});
  // Submissions.remove({});
  Availability.remove({});
  // Messages.remove({});
  Assignments.remove({});
  // Locations.remove({});
  Incidents.remove({});
  Detectors.remove({});
  // Images.remove({});
  // Avatars.remove({});
  ParticipatingNow.remove({});
}

function clearEmptySubmission() {
  Submissions.remove({uid: null})
}

// export const createNewId = (type, need) => {
//   toReplace = ["1", "I", "l", "O", "V", "U"]  //why does this somehow look like "I love you" lol
//   toReplace.forEach((c) => {
//     need = need.replace(c, "Z")
//   })
//   for (let i = need.length; i < 17; i++){
//     need = need + type;
//   }
//   return need
// }

function createTestExperiences(){
  Object.values(CONSTANTS.EXPERIENCES).forEach(function (value) {
    Experiences.insert(value);
    let incident = createIncidentFromExperience(value);
    startRunningIncident(incident);
  });
}

function createTestData(){
  // add test users
  Object.values(CONSTANTS.USERS).forEach(function (value) {
    Accounts.createUser(value)
  });
  log.info(`Populated ${ Meteor.users.find().count() } accounts`);

  // add detectors
  Object.values(CONSTANTS.DETECTORS).forEach(function (value) {
    Detectors.insert(value);
  });
  log.info(`Populated ${ Detectors.find().count() } detectors`);


  // Experiences.insert(CONSTANTS.EXPERIENCES.bumped);
  // let incident = createIncidentFromExperience(CONSTANTS.EXPERIENCES.bumped);
  // startRunningIncident(incident);

  // start experiences
  createTestExperiences();
  log.info(`Created ${ Experiences.find().count() } experiences`);

  let uid1 = findUserByUsername('cindy')._id;
  let uid2 = findUserByUsername('yvan')._id;
  let uid3 = findUserByUsername('ryan')._id;
  let uid4 = findUserByUsername('jenny')._id;
  // let uid5 = findUserByUsername('haoqi')._id;
  // let uid6 = findUserByUsername('natalie')._id;
  // let uid7 = findUserByUsername('jason')._id;
  // let uid8 = findUserByUsername('fardeem')._id;
  // let uid9 = findUserByUsername('kapil')._id;
  // let uid10 = findUserByUsername('molly')._id;
  // let uid11 = findUserByUsername('leesha')._id;
  // let uid12 = findUserByUsername('justin')._id;
  // let uid13 = findUserByUsername('harrison')._id;
  // let uid14 = findUserByUsername('jonathan')._id;
  // let uid15 = findUserByUsername('gobi')._id;
  // let uid16 = findUserByUsername('sydney')._id;
  // let uid17 = findUserByUsername('hang')._id;
  // let uid18 = findUserByUsername('parveen')._id;
  // let uid19 = findUserByUsername('isaac')._id;
  // let uid20 = findUserByUsername('izzy')._id;
  // let uid21 = findUserByUsername('richard')._id;
  // let uid22 = findUserByUsername('roxy')._id;

  Meteor.users.update({
    // everyone
  }, {
    $set: {
      "profile.experiences": [],
      "profile.subscriptions": [],
      "profile.lastParticipated": null,
      "profile.lastNotified": null,
      "profile.pastIncidents": [],
      "profile.staticAffordances": {
        betatester: true,
      }
    }
  }, {
    multi: true
  });

  log.debug('FOR LOCATION TESTING RUN >>>> python3 simulatelocations.py '+ uid1 + " " + uid2 + " " +  uid3+ " " + uid4);
}

function createTestExperiencesSelfDisclosure(){
    // add detectors
    for (let i = 1; i < 12; i++){
      let pairNum = "pair" + `${i}`;
      Object.values(CONSTANTS.DETECTORS[pairNum]).forEach(function (value) {
        // log.info(`creating detectors for ${pairNum}`);
        Detectors.insert(value);
      });
    }
  log.info(`Populated ${ Detectors.find().count() } detectors`);
  for (let i = 1; i < 12; i++){
    let pairNum = "pair" + `${i}`;
    Object.values(CONSTANTS.EXPERIENCES[pairNum]).forEach(function (value) {
      // let need = value.contributionTypes[0].needName;
      // console.log("need before: "+ need)
      // need = createNewId("e", need)
      // console.log("need after: "+ need);
      // value._id = need;
        Experiences.insert(value);
        let incident = createIncidentFromExperience(value);
        startRunningIncident(incident);
        // log.info(`creating experiences for ${pairNum}`);
      });
  }

}

function createAdditionalTestExperiences(){
  // add detectors
  for (let i = 1; i <= 11; i++){
    let pairNum = "pair" + `${i}`;
    Object.values(CONSTANTS.DETECTORS[pairNum]).forEach(function (value) {
      if (!Detectors.findOne({description: value.description})){
        log.info(`new detector: ${value.description} created`);
        Detectors.insert(value);
      }
    });
  }
log.info(`Populated ${ Detectors.find().count() } detectors`);
for (let i = 1; i <= 11; i++){
  let pairNum = "pair" + `${i}`;
  Object.values(CONSTANTS.NEW_EXPERIENCES[pairNum]).forEach(function (value) {
    // let need = value.contributionTypes[0].needName;
    // console.log("need before: "+ need)
    // need = createNewId("e", need)
    // console.log("need after: "+ need);
    // value._id = need;
      Experiences.insert(value);
      let incident = createIncidentFromExperience(value);
      startRunningIncident(incident);
    });
}
log.info(`Populated ${ Detectors.find().count() } new experiences`);
log.info(`Populated ${ Submissions.find().count()} new submissions`)
}



function createTestDataSelfDisclosure(){
  // add test users
  Object.values(CONSTANTS.USERS).forEach(function (value) {
    if (!Meteor.users.findOne({username: value.username})){
      log.info(`username: ${value.username} not found, creating new account...`)
      Accounts.createUser(value)
    }
  });
  log.info(`Populated ${ Meteor.users.find().count() } accounts`);


  // // add detectors
  // for (let i = 1; i < 7; i++){
  //   let pairNum = "pair" + `${i}`;
  //   Object.values(CONSTANTS.DETECTORS[pairNum]).forEach(function (value) {
  //     Detectors.insert(value);
  //   });
  // }
  // // Object.values(CONSTANTS.DETECTORS).forEach(function (pair) {
  // //   pair.forEach(function (value) {
  // //     Detectors.insert(value);
  // //   });
  // // })
  // log.info(`Populated ${ Detectors.find().count() } detectors`);


  // Experiences.insert(CONSTANTS.EXPERIENCES.bumped);
  // let incident = createIncidentFromExperience(CONSTANTS.EXPERIENCES.bumped);
  // startRunningIncident(incident);

  // start experiences
  createTestExperiencesSelfDisclosure();
  log.info(`Created ${ Experiences.find().count() } experiences`);

  let uid1 = findUserByUsername('cindy')._id;
  let uid2 = findUserByUsername('yvan')._id;
  let uid3 = findUserByUsername('ryan')._id;
  let uid4 = findUserByUsername('jenny')._id;
  // let uid5 = findUserByUsername('haoqi')._id;
  // let uid6 = findUserByUsername('natalie')._id;
  // let uid7 = findUserByUsername('jason')._id;
  // let uid8 = findUserByUsername('fardeem')._id;
  // let uid9 = findUserByUsername('kapil')._id;
  // let uid10 = findUserByUsername('molly')._id;
  // let uid11 = findUserByUsername('leesha')._id;
  // let uid12 = findUserByUsername('justin')._id;
  // let uid13 = findUserByUsername('harrison')._id;
  // let uid14 = findUserByUsername('jonathan')._id;
  // let uid15 = findUserByUsername('gobi')._id;
  // let uid16 = findUserByUsername('sydney')._id;
  // let uid17 = findUserByUsername('hang')._id;
  // let uid18 = findUserByUsername('parveen')._id;
  // let uid19 = findUserByUsername('isaac')._id;
  // let uid20 = findUserByUsername('izzy')._id;
  // let uid21 = findUserByUsername('richard')._id;
  // let uid22 = findUserByUsername('roxy')._id;

  Meteor.users.update({
    // everyone
  }, {
    $set: {
      "profile.experiences": [],
      "profile.subscriptions": [],
      "profile.lastParticipated": null,
      "profile.lastNotified": null,
      "profile.pastIncidents": [],
      // "profile.staticAffordances": {}
    }
  }, {
    multi: true
  });


  log.debug('FOR LOCATION TESTING RUN >>>> python3 simulatelocations.py '+ uid1 + " " + uid2 + " " +  uid3+ " " + uid4);
}

/* graveyard

startStorytime(){
    console.log("starting storytime");
    let value = CONSTANTS.EXPERIENCES.storyTime;
    Experiences.insert(value);
    let incident = createIncidentFromExperience(value);
    startRunningIncident(incident);
  },
  startBumped(){
    console.log("starting bumped");
    let value = CONSTANTS.EXPERIENCES.bumped;
    Experiences.insert(value);
    let incident = createIncidentFromExperience(value);
    startRunningIncident(incident);
  },
  startDrinksTalk(){
    console.log("starting drinks talk");
    let value = CONSTANTS.EXPERIENCES.drinksTalk;
    Experiences.insert(value);
    let incident = createIncidentFromExperience(value);
    startRunningIncident(incident);
  },
  startImitationGame() {
    console.log("starting imitation game");
    let value = CONSTANTS.EXPERIENCES.imitationGame;
    Experiences.insert(value);
    let incident = createIncidentFromExperience(value);
    startRunningIncident(incident);
  },
  startGroupCheers(){
    console.log("starting group cheers");
    let value = CONSTANTS.EXPERIENCES.groupCheers;
    Experiences.insert(value);
    let incident = createIncidentFromExperience(value);
    startRunningIncident(incident);
  },
  startScavengerHunt(){
    console.log("starting scavenger");

    let value = CONSTANTS.EXPERIENCES.scavengerHunt;
    Experiences.insert(value);
    let incident = createIncidentFromExperience(value);
    startRunningIncident(incident);
  },
  startSunset(){
    console.log("starting sunset");
    let value = CONSTANTS.EXPERIENCES.sunset;
    Experiences.insert(value);
    let incident = createIncidentFromExperience(value);
    startRunningIncident(incident);
  },
  startNature(){
    console.log("starting nature");
    let value = CONSTANTS.EXPERIENCES.natureHunt;
    Experiences.insert(value);
    let incident = createIncidentFromExperience(value);
    startRunningIncident(incident);
  },


*/