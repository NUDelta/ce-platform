import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random'

import { CONFIG } from '../../api/config.js';
import { Experiences, Incidents } from '../../api/OCEManager/OCEs/experiences.js';
import { Locations } from '../../api/UserMonitor/locations/locations.js';
import { Messages } from '../../api/Messages/messages.js';
import { Submissions } from "../../api/OCEManager/currentNeeds";
import { Assignments, Availability } from "../../api/OpportunisticCoordinator/databaseHelpers";
import { Images, Avatars } from '../../api/ImageUpload/images.js';
import { log } from '../../api/logs.js';

import { CONSTANTS } from "../../api/Testing/testingconstants";
import { createIncidentFromExperience, startRunningIncident } from "../../api/OCEManager/OCEs/methods.js";
import { findUserByUsername } from '../../api/UserMonitor/users/methods';
import { Detectors } from "../../api/UserMonitor/detectors/detectors";

Meteor.startup(() => {
  log.debug(`Running in mode: ${process.env.MODE}`);

  if(!(process.env.MODE === "DEV" || process.env.MODE === "PROD")){
    if(CONFIG.DEBUG){
      clearDatabase();
      createTestData();
    }
  }
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
}

function createTestExperiences(){
  for (let i = 1; i < 4; i++){
    let pairNum = "pair" + `${i}`;
    Object.values(CONSTANTS.EXPERIENCES[pairNum]).forEach(function (value) {
        Experiences.insert(value);
        let incident = createIncidentFromExperience(value);
        startRunningIncident(incident);
      });
  }
  
}

function createTestData(){
  // add test users
  Object.values(CONSTANTS.USERS).forEach(function (value) {
    Accounts.createUser(value)
  });
  log.info(`Populated ${ Meteor.users.find().count() } accounts`);

  // add detectors
  for (let i = 1; i < 4; i++){
    let pairNum = "pair" + `${i}`;
    Object.values(CONSTANTS.DETECTORS[pairNum]).forEach(function (value) {
      Detectors.insert(value);
    });
  }
  // Object.values(CONSTANTS.DETECTORS).forEach(function (pair) {
  //   pair.forEach(function (value) {
  //     Detectors.insert(value);
  //   });
  // })
  log.info(`Populated ${ Detectors.find().count() } detectors`);


  // Experiences.insert(CONSTANTS.EXPERIENCES.bumped);
  // let incident = createIncidentFromExperience(CONSTANTS.EXPERIENCES.bumped);
  // startRunningIncident(incident);

  // start experiences
  createTestExperiences();
  log.info(`Created ${ Experiences.find().count() } experiences`);

  let uid1 = findUserByUsername('zach')._id;
  let uid2 = findUserByUsername('ryan')._id;
  let uid3 = findUserByUsername('mason')._id;
  let uid4 = findUserByUsername('andrew')._id;
  let uid5 = findUserByUsername('josh')._id;
  let uid6 = findUserByUsername('nagy')._id;

  // let uid1 = findUserByUsername('sig1_mentee1')._id;
  // let uid2 = findUserByUsername('sig1_mentor')._id;
  // let uid3 = findUserByUsername('sig1_mentee2')._id;
  // let uid4 = findUserByUsername('sig2_mentee1')._id;
  // let uid5 = findUserByUsername('sig2_mentor')._id;
  // let uid6 = findUserByUsername('sig2_mentee2')._id;

  let olinuid1 = findUserByUsername('nagy')._id;
  let olinuid2 = findUserByUsername('bonnie')._id;

  Meteor.users.update({
    // everyone
  }, {
    $set: {
      "profile.experiences": [],
      "profile.subscriptions": [],
      "profile.lastParticipated": null,
      "profile.lastNotified": null,
      "profile.pastIncidents": [],
      "profile.staticAffordances": {}
    }
  }, {
    multi: true
  });

  Meteor.users.update({
    _id: {$in: [uid1]}
  }, {
    $set: { 'profile.staticAffordances': {
      "pair1":true,
      "chat": false,
      "stranger1": true
      // "imitationGameFlag": true
    } },
  }, {
    multi: true
  });

  Meteor.users.update({
    _id: {$in: [uid2]}
  }, {
    $set: { 'profile.staticAffordances': { 
      "pair1":true, 
      "chat": false, 
      // "friend": true 
    } },
  }, {
    multi: true
  });

  Meteor.users.update({
    _id: {$in: [uid3]}
  }, {
    $set: { 'profile.staticAffordances': { 
      "pair2":true, 
      "chat": false, 
    // "stranger2": true
  } },
  }, {
    multi: true
  });


  Meteor.users.update({
    _id: {$in: [uid4]}
  }, {
    $set: { 'profile.staticAffordances': { 
      "pair2":true, 
      "chat": false, 
      // "stranger": true 
    } },
  }, {
    multi: true
  });

  Meteor.users.update({
    _id: {$in: [uid5]}
  }, {
    $set: { 'profile.staticAffordances': { 
      "pair3":true, 
      "chat": false, 
      // "friend": true 
    } },
  }, {
    multi: true
  });

  Meteor.users.update({
    _id: {$in: [uid6]}
  }, {
    $set: { 'profile.staticAffordances': { 
      "pair3":true, 
      "chat": false, 
      // "stranger2": true
    } },
  }, {
    multi: true
  });


  log.debug('FOR LOCATION TESTING RUN >>>> python3 simulatelocations.py '+ uid1 + " " + uid2 + " " +  uid3+" " + uid4 + " " + uid5 + " " + uid6);
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