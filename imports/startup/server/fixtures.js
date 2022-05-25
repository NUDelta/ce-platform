import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random'

import { CONFIG } from '../../api/config.js';
import { Experiences, Incidents } from '../../api/OCEManager/OCEs/experiences.js';
import { Locations } from '../../api/UserMonitor/locations/locations.js';
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

Meteor.methods({
  // important - repopulates the database with the experiences that you defined
  createTestUsers(){
    createTestData();
  },
  // important - clear the database, deletes users, experiences and all that
  freshDatabase() {
    clearDatabase();
  },
  startTestExperiences(){
    createTestExperiences();

    Object.values(CONSTANTS.DETECTORS).forEach(function (value) {
      Detectors.insert(value);
    });
    log.info(`${CONSTANTS.DETECTORS}`);
    log.info(`Populated ${ Detectors.find().count() } detectors`);
  },
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
  startSeniorFinals(){
    console.log("starting senior finals");
    let value = CONSTANTS.EXPERIENCES.surviveOrThrive;
    Experiences.insert(value);
    let incident = createIncidentFromExperience(value);
    startRunningIncident(incident);
  }
});

function clearDatabase () {
  Meteor.users.remove({});
  Experiences.remove({});
  Submissions.remove({});
  Availability.remove({});
  Assignments.remove({});
  Locations.remove({});
  Incidents.remove({});
  Detectors.remove({});
  Images.remove({});
  Avatars.remove({});
}

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

  let uid1 = findUserByUsername('jenny')._id;
  let uid2 = findUserByUsername('garretts_brother')._id;
  let uid3 = findUserByUsername('meg')._id;
  let uid4 = findUserByUsername('megs_sister')._id;
  let uid5 = findUserByUsername('josh')._id;
  let uid6 = findUserByUsername('nagy')._id;

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
    _id: {$in: [uid1, uid2]}
  }, {
    $set: { 'profile.staticAffordances': {"lovesGarrett": true } }
  }, {
    multi: true
  });

  Meteor.users.update({
    _id: {$in: [uid3, uid4]}
  }, {
    $set: { 'profile.staticAffordances': {"lovesMeg": true, "mechanismPoor": true} }
  }, {
    multi: true
  });

  Meteor.users.update({
    _id: {$in: [uid1, uid3, uid5]}
  }, {
    $set: { 'profile.staticAffordances.lovesDTR':  true }
  }, {
    multi: true
  });

  Meteor.users.update({
    _id: {$in: [uid1, uid2, olinuid1, olinuid2]}
  }, {
    $set: { 'profile.staticAffordances': { "mechanismRich": true} }
  }, {
    multi: true
  });

  Meteor.users.update({
    _id: {$in: [uid1, uid2, uid3]}
  }, {
    $set: { 'profile.staticAffordances': { "triad1": true } },
  }, {
    multi: true
  });

  Meteor.users.update({
    _id: {$in: [uid4, uid5, uid6]}
  }, {
    $set: { 'profile.staticAffordances': { "triad2": true } }
  }, {
    multi: true
  });

  log.debug('FOR LOCATION TESTING RUN >>>> python simulatelocations.py '+ uid1 + " " + uid2 + " " +  uid3+" " + uid4 + " " + uid5 + " " + uid6);
}
