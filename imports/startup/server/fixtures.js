import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random'

import { CONFIG } from '../../api/config.js';
import { Experiences, Incidents } from '../../api/OCEManager/OCEs/experiences.js';
import { Locations } from '../../api/UserMonitor/locations/locations.js';
import { Submissions } from "../../api/OCEManager/currentNeeds";
import { Assignments, Availability } from "../../api/OpportunisticCoordinator/databaseHelpers";
import { Images } from '../../api/ImageUpload/images.js';
import { log } from '../../api/logs.js';

import { CONSTANTS } from "../../api/Testing/testingconstants";
import { createIncidentFromExperience, startRunningIncident } from "../../api/OCEManager/OCEs/methods.js";
import { findUserByUsername } from '../../api/UserMonitor/users/methods';
import { Detectors } from "../../api/UserMonitor/detectors/detectors";

Meteor.startup(() => {
  log.debug("Running in mode: ", process.env.MODE );
  log.debug("process.env is: ", process.env );

  if(!(process.env.MODE === "DEV" || process.env.MODE === "PROD")){
    if(CONFIG.DEBUG){
      clearDatabase();
      createTestData();
    }
  }
});

Meteor.methods({
  createTestUsers(){
    createTestData();
  },
  freshDatabase() {
    clearDatabase();
  },
  startTestExperiences(){
    createTestExperiences();

    Object.values(CONSTANTS.DETECTORS).forEach(function (value) {
      Detectors.insert(value);
    });
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

  let uid1 = findUserByUsername('garrett')._id;
  let uid2 = findUserByUsername('garretts_brother')._id;
  let uid3 = findUserByUsername('meg')._id;
  let uid4 = findUserByUsername('megs_sister')._id;
  let uid5 = findUserByUsername('josh')._id;

  Meteor.users.update({
    _id: {$in: [uid1, uid2]}
  }, {
    $set: { 'profile.staticAffordances': {"lovesGarrett": true} }
  }, {
    multi: true
  });

  Meteor.users.update({
    _id: {$in: [uid3, uid4]}
  }, {
    $set: { 'profile.staticAffordances': {"lovesMeg": true} }
  }, {
    multi: true
  });

  Meteor.users.update({
    _id: {$in: [uid1, uid3, uid5]}
  }, {
    $set: { 'profile.staticAffordances.lovesDTR':  true}
  }, {
    multi: true
  });

  log.debug('FOR LOCATION TESTING RUN >>>> python simulatelocations.py '+ uid1 + " " + uid2 + " " +  uid3+" " + uid4 + " " + uid5 );
}
