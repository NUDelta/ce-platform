import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Random } from "meteor/random";

import { CONFIG } from "../../api/config.js";
import {
  Experiences,
  Incidents,
} from "../../api/OCEManager/OCEs/experiences.js";
import { Locations } from "../../api/UserMonitor/locations/locations.js";
import { Messages } from "../../api/Messages/messages.js";
import { Submissions } from "../../api/OCEManager/currentNeeds";
import {
  Assignments,
  Availability,
  ParticipatingNow,
} from "../../api/OpportunisticCoordinator/databaseHelpers";
import { Images, Avatars } from "../../api/ImageUpload/images.js";
import { log } from "../../api/logs.js";

import { CONSTANTS, CONSTANTS_EXTRA } from "../../api/Testing/testingconstants";
import {
  createIncidentFromExperience,
  startRunningIncident,
} from "../../api/OCEManager/OCEs/methods.js";
import { findUserByUsername } from "../../api/UserMonitor/users/methods";
import { Detectors } from "../../api/UserMonitor/detectors/detectors";

export const PAIR_COUNT = 5; //TEST SET UP: change it to pair count (also cmd+shift+f "PAIR_COUNT" to replace PAIR_COUNT in other files)

Meteor.startup(() => {
  log.debug(`Running in mode: ${process.env.MODE}`);

  if (!(process.env.MODE === "DEV" || process.env.MODE === "PROD")) {
    if (CONFIG.DEBUG) {
      clearDatabase();
      createTestData();
    }
  }

  // if(process.env.MODE === "PROD"){
  //   clearDatabaseProd();
  //   createTestDataProd();
  // }
});

// In chrome browser console...
// Meteor.call('freshDatabase')
// Meteor.call('createTestUsers')
Meteor.methods({
  createTestUsers() {
    createTestData();
  },
  createTestUsersExtra() {
    createTestDataExtra();
  },
  freshDatabase() {
    clearDatabase();
  },
  startTestExperiences() {
    createTestExperiences();

    // Object.values(CONSTANTS.DETECTORS).forEach(function (pair) {
    //   pair.forEach(function (value) {
    //     Detectors.insert(value);
    //   });
    // })
    // log.info(`${CONSTANTS.DETECTORS}`);
    // log.info(`Populated ${ Detectors.find().count() } detectors`);
  },
  clearSubmission() {
    Submissions.remove({});
  },
  clearEmptySubmission() {
    clearEmptySubmission();
  },
  clearDatabaseProd() {
    clearDatabaseProd();
  },
  createAdditionalTestExperiences() {
    createAdditionalTestExperiences();
  },
  startSyncedCron(){
    SyncedCron.start();
  }
});

function clearDatabase() {
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

function clearDatabaseProd() {
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
  Submissions.remove({ uid: null });
}

function createTestExperiences() {
  // add detectors
  for (let i = 1; i <= PAIR_COUNT; i++) {
    let pairNum = "pair" + `${i}`;
    Object.values(CONSTANTS.DETECTORS[pairNum]).forEach(function (value) {
      Detectors.insert(value);
    });
  }
  log.info(`Populated ${Detectors.find().count()} detectors`);
  for (let i = 1; i <= PAIR_COUNT; i++) {
    let pairNum = "pair" + `${i}`;
    Object.values(CONSTANTS.EXPERIENCES[pairNum]).forEach(function (value) {
      Experiences.insert(value);
      let incident = createIncidentFromExperience(value);
      startRunningIncident(incident);
      // log.info(`creating experiences for ${pairNum}`);
    });
  }
}

function createTestExperiencesExtra() {
  // add detectors
  for (let i = 6; i <= 10; i++) {
    let pairNum = "pair" + `${i}`;
    Object.values(CONSTANTS_EXTRA.DETECTORS[pairNum]).forEach(function (value) {
      Detectors.insert(value);
    });
  }
  log.info(`Populated ${Detectors.find().count()} detectors`);
  for (let i = 6; i <= 10; i++) {
    let pairNum = "pair" + `${i}`;
    Object.values(CONSTANTS_EXTRA.EXPERIENCES[pairNum]).forEach(function (value) {
      Experiences.insert(value);
      let incident = createIncidentFromExperience(value);
      startRunningIncident(incident);
      // log.info(`creating experiences for ${pairNum}`);
    });
  }
}

function createAdditionalTestExperiences() {
  // add detectors
  for (let i = 1; i <= PAIR_COUNT; i++) {
    let pairNum = "pair" + `${i}`;
    Object.values(CONSTANTS.DETECTORS[pairNum]).forEach(function (value) {
      if (!Detectors.findOne({ description: value.description })) {
        log.info(`new detector: ${value.description} created`);
        Detectors.insert(value);
      }
    });
  }
  log.info(`Populated ${Detectors.find().count()} detectors`);

  //update every user for initial notifications
  //add experiences
  for (let i = 1; i <= PAIR_COUNT; i++) {
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
  log.info(`Populated ${Detectors.find().count()} new experiences`);
  log.info(`Populated ${Submissions.find().count()} new submissions`);
}

function createTestData() {
  // add test users
  Object.values(CONSTANTS.USERS).forEach(function (value) {
    if (!Meteor.users.findOne({ username: value.username })) {
      log.info(
        `username: ${value.username} not found, creating new account...`
      );
      Accounts.createUser(value);
    }
  });
  log.info(`Populated ${Meteor.users.find().count()} accounts`);
  // start experiences
  createTestExperiences();
  log.info(`Created ${Experiences.find().count()} experiences`);

  let uid1 = findUserByUsername("user1")._id;
  let uid2 = findUserByUsername("user2")._id;
  let uid3 = findUserByUsername("user3")._id;
  let uid4 = findUserByUsername("user4")._id;

  let initialNotifications = {};
  let waitOnPartnerSubmission = {};
  let waitOnUserSubmission = {};
  const expKeys = Object.keys(CONSTANTS.DETECTORS["pair1"]);
  expKeys.forEach((key) => {
    initialNotifications[key.toLowerCase()] = -1;
    waitOnPartnerSubmission[key.toLowerCase()] = false;
    waitOnUserSubmission[key.toLowerCase()] = false;
  });

  Meteor.users.update(
    {
      // everyone
    },
    {
      $set: {
        "profile.experiences": [],
        "profile.subscriptions": [],
        "profile.lastParticipated": null,
        "profile.lastNotified": initialNotifications,
        "profile.waitOnPartnerSubmission": waitOnPartnerSubmission,
        "profile.pastIncidents": [],
        "profile.waitOnUserSubmission": waitOnUserSubmission,
        // "profile.staticAffordances": {}
      },
    },
    {
      multi: true,
    }
  );

  let allUserId = Meteor.users.find().fetch().map((user) => user._id);
  let simulateLocations = "FOR LOCATION TESTING RUN >>>> python3 simulatelocations.py ";
  allUserId.forEach((uid) => {
    simulateLocations += `${uid} `;
  })

  log.debug(
    simulateLocations
  );
}

function createTestDataExtra(){

  let usernames = [];

  // add test users
  Object.values(CONSTANTS_EXTRA.USERS).forEach(function (value) {
    if (!Meteor.users.findOne({ username: value.username })) {
      log.info(
        `username: ${value.username} not found, creating new account...`
      );
      Accounts.createUser(value);
      usernames.push(value.username)
    }
  });
  log.info(`new usernames: ${usernames}`)
  log.info(`Populated ${Meteor.users.find().count()} accounts`);
  // start experiences
  createTestExperiencesExtra();
  log.info(`Created ${Experiences.find().count()} experiences`);

  let initialNotifications = {};
  let waitOnPartnerSubmission = {};
  let waitOnUserSubmission = {};
  const expKeys = Object.keys(CONSTANTS.DETECTORS["pair1"]);
  expKeys.forEach((key) => {
    initialNotifications[key.toLowerCase()] = -1;
    waitOnPartnerSubmission[key.toLowerCase()] = false;
    waitOnUserSubmission[key.toLowerCase()] = false;
  });

  Meteor.users.update(
    {
      username: { $in: usernames }
    },
    {
      $set: {
        "profile.experiences": [],
        "profile.subscriptions": [],
        "profile.lastParticipated": null,
        "profile.lastNotified": initialNotifications,
        "profile.waitOnPartnerSubmission": waitOnPartnerSubmission,
        "profile.pastIncidents": [],
        "profile.waitOnUserSubmission": waitOnUserSubmission,
        // "profile.staticAffordances": {}
      },
    },
    {
      multi: true,
    }
  );

  // let allUserId = Meteor.users.find().fetch().map((user) => user._id);
  // let simulateLocations = "FOR LOCATION TESTING RUN >>>> python3 simulatelocations.py ";
  // allUserId.forEach((uid) => {
  //   simulateLocations += `${uid} `;
  // })

  // log.debug(
  //   simulateLocations
  // );

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
