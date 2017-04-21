import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { SyncedCron } from 'meteor/percolate:synced-cron';

import { Cerebro } from '../cerebro/server/cerebro-server.js';
import { notifyOnAffordances } from '../cerebro/server/methods.js';
import { Experiences } from '../experiences/experiences.js';
import { Schema } from '../schema.js';
import { log } from '../logs.js';
import { CONFIG } from '../config.js';

import { activateNewIncident } from '../incidents/methods.js';
import { removeFromAllActiveExperiences } from '../users/methods.js';
import { Locations } from '../locations/locations.js';
import { Users } from '../users/users.js';
import {usersAvalibleNow} from './methods.js';
import {prepareToNofityUsers} from './methods.js';

WAIT_TIME = 180000;

export const testNotification = new ValidatedMethod({
  name: 'customNotification.ctions.testNotification',
  validate: new SimpleSchema({
    experience: {
      type: Schema.Experience
    },
    notificationOptions: {
      type: Schema.NotificationOptions
    }
  }).validator(),
  run({experience, notificationOptions }) {
  }
});

export const require2users = new ValidatedMethod({
  name: 'customNotification.require2users',
  validate: new SimpleSchema({
    experience: {
      type: Schema.Experience
    },
    notificationOptions: {
      type: Schema.NotificationOptions
    }
  }).validator(),
  run({experience, notificationOptions }) {
    console.log("In require2users!");
    //create a new incident
    const activeIncident = activateNewIncident.call({
      name: experience.name,
      experienceId: experience._id,
      launcher: this.userId
    });
    console.log("added the new activeIncident");
    var send_notifications = Meteor.setInterval(function(){
      console.log("in the interval");

      let curr_experience = Experiences.findOne(experience._id);

      if(curr_experience.activeIncident == null){
        Meteor.clearInterval(send_notifications);
        console.log("meteor clearing the interval for notificaitons");
      }

      console.log("looking to notify users for " + curr_experience.name)

      console.log("available users are " + curr_experience.available_users)
      //function to return who can get a notification right now
      usersAvalibleNowIds = usersAvalibleNow(curr_experience.available_users)

      //here we could use logic to decide only some of the avalible users should participate
      usersForExperienceIds = []

      if(usersAvalibleNowIds.length > 1){
        console.log("we found two users");
        usersForExperienceIds = usersAvalibleNowIds.slice(0, 2);
      }

      //update that they have been notified
      prepareToNofityUsers(usersForExperienceIds, curr_experience, activeIncident);

      Cerebro.notify({
        userIds: usersForExperienceIds, //get the user ids of usersAvalibleNow
        experienceId: experience._id,
        subject: notificationOptions.subject,
        text: notificationOptions.text,
        route: notificationOptions.route
      });
    }, 180000);
  }
});
