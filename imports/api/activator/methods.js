//launch experience methods
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

import './custom_options.js'

var send_notifications;


export const launchCustom = new ValidatedMethod({
  name: 'launcher.custom',
  validate: new SimpleSchema({
    experience: {
      type: Schema.Experience
    },
    notificationOptions: {
      type: Schema.NotificationOptions
    }
  }).validator(),
  run({experience, notificationOptions }) {
    console.log("you are launching a custom notfication method!");
    if(experience.custom_notification){
      console.log("that method is called " + experience.custom_notification);

      Meteor.call("customNotification."+ experience.custom_notification, {
        experience: experience,
        notificationOptions: notificationOptions
      }, (err, res) => {
        if (err) { console.log(err);}
      });
    }
  }
});


WAIT_TIME = 180000;

export const usersAvalibleNow = function(possibleUserIds){
  userIdsAvalibleNow = []

  for(let i in possibleUserIds){
    userId = possibleUserIds[i]
    let user_location = Locations.findOne({uid: userId});
    if(user_location == null){
      continue;
    }

    now = Date.parse(new Date());
    if(user_location.lastNotification == null || (now - user_location.lastNotification) > WAIT_TIME){
      //they are avalible
      userIdsAvalibleNow.push(userId);
    }
  }

  return userIdsAvalibleNow;
}

export const prepareToNofityUsers = function(userIds, experience, activeIncident){
  if(userIds.length > 0){
    Cerebro.setActiveExperiences(userIds, experience._id);
    Cerebro.addIncidents(userIds, activeIncident);
    userIds.map( userId => {
      Locations.update({uid: userId}, { $set: {
        lastNotification : now
      }}, (err, docs) => {
        if (err) { console.log(err); }
        else { }
      });
    });
  }

}

export const launchContinuousExperience = new ValidatedMethod({
  name: 'launcher.continuous',
  validate: new SimpleSchema({
    experience: {
      type: Schema.Experience
    },
    notificationOptions: {
      type: Schema.NotificationOptions
    }
  }).validator(),
  run({experience, notificationOptions }) {
    console.log("starting a continous experience " + experience.name);
    //create a new incident
    const activeIncident = activateNewIncident.call({
      name: experience.name,
      experienceId: experience._id,
      launcher: this.userId
    });
    send_notifications = Meteor.setInterval(function(){

      if(experience.activeIncident == null){
        Meteor.clearInterval(send_notifications);
      }

      console.log("looking to notify for " + experience.name);
      let curr_experience = Experiences.findOne(experience._id);
      //function to return who can get a notification right now

      usersAvalibleNowIds = usersAvalibleNow(curr_experience.available_users)
      Cerebro.removeAllOldActiveExperiences(curr_experience.available_users, experience._id);

      //here we could use logic to decide only some of the avalible users should participate
      usersForExperienceIds = usersAvalibleNowIds

      //update that they have been notified
      prepareToNofityUsers(usersForExperienceIds, curr_experience, activeIncident);

      Cerebro.notify({
        userIds: usersForExperienceIds, //get the user ids of usersAvalibleNow
        experienceId: experience._id,
        subject: notificationOptions.subject,
        text: notificationOptions.text,
        route: notificationOptions.route
      });
    }, 10000);
  }
});

export const endContinuousExperience = new ValidatedMethod({
  name: 'launcher.endContinuous',
  validate: new SimpleSchema({
    experience: {
      type: Schema.Experience
    },
    notificationOptions: {
      type: Schema.NotificationOptions
    },
  }).validator(),
  run({ experience, notificationOptions }) {
    // TODO: encode some sense of who participate / should be included instead of just sending this
    console.log("ending a continuous experience " + experience.name);
    const activeIncidentId = experience.activeIncident;
    removeFromAllActiveExperiences.call({ experienceId: experience._id });
    Meteor.clearInterval(send_notifications);
    Experiences.update({
      _id: experience._id
    }, {
      $unset: { 'activeIncident': 0 }
    });
  }
});

function asyncNotifyUsers(experience, notificationOptions, activeIncident) {
  let locations = Locations.find().fetch();
  for (let location of locations){
    Meteor.call('cerebro.notifyOnAffordances', {
      lat: location.lat.toString(),
      lng: location.lng.toString(),
      uid: location.uid,
      experience: experience,
      notificationOptions, notificationOptions,
      incident: activeIncident
    }, (err, res) => {
      if (err) { console.log(err);}
    });
  }
}

function getUsersToNotify(experience) {
  let query = {};
  if (experience.location) {
    log.cerebro(`Notifying users for experience "${ experience.name }" in ${ experience.location }`);
    const atLocation = Cerebro.liveQuery(experience.location);
    query = {
      'profile.subscriptions': experience._id,
      _id: { $in: atLocation }
    };
  }
  else {
    log.cerebro(`Notifying users for experience "${ experience.name }". No location detected, so notifying everyone.`);
    query = {
      'profile.subscriptions': experience._id
    };
  }

  if (CONFIG.NOTIFY_ALL) {
    log.info('Debug enabled. Ignoring user subscriptions.');
    delete query['profile.subscriptions'];
  }

  return Meteor.users.find(query, { fields: { _id: 1 } }).fetch().map(user => user._id);
}

function endExperience(experience, userIds, notificationOptions) {
  // TODO: encode what users were in the OG experience
  const activeIncidentId = experience.activeIncident;
  removeFromAllActiveExperiences.call({ experienceId: experience._id });
  Experiences.update({
    _id: experience._id
  }, {
    $unset: { 'activeIncident': 0 }
  });
  Cerebro.notify({
    userIds: userIds,
    experienceId: activeIncidentId,
    subject: notificationOptions.subject,
    text: notificationOptions.text,
    route: notificationOptions.route
  });
}

export const launchInstantExperience = new ValidatedMethod({
  name: 'launcher.instant',
  validate: new SimpleSchema({
    experience: {
      type: Schema.Experience
    },
    notificationOptions: {
      type: Schema.NotificationOptions
    }
  }).validator(),
  run({ experience, notificationOptions }) {
    const activeIncident = activateNewIncident.call({
      name: experience.name,
      experienceId: experience._id,
      launcher: this.userId
    });
    if (experience.affordance) {
      asyncNotifyUsers(experience, notificationOptions, activeIncident);
    } else {
      const userIds = getUsersToNotify(experience);
      Cerebro.setActiveExperiences(userIds, experience._id);
      Cerebro.addIncidents(userIds, activeIncident);
      Cerebro.notify({
        userIds: userIds,
        experienceId: experience._id,
        subject: notificationOptions.subject,
        text: notificationOptions.text,
        route: notificationOptions.route
      });
    }
  }
});

export const launchDurationExperience = new ValidatedMethod({
  name: 'launcher.duration',
  validate: new SimpleSchema({
    duration: {
      // TODO: Encode within experience?
      type: Schema.Duration
    },
    experience: {
      type: Schema.Experience
    },
    notificationOptions: {
      type: Schema.NotificationOptions
    },
  }).validator(),
  run({ duration, experience, notificationOptions }) {
    const jobName = `Notifying users for experience ${ experience._id }`;
    let usersReached = [];
    let n = 1;

    const activeIncident = activateNewIncident.call({
      name: experience.name,
      experienceId: experience._id,
      launcher: this.userId
    });

    log.cerebro(`Scheduling notifications for users for experience "${ experience.name }" in ${ experience.location }`);

    // TODO: what about launching multiple incidents of the same experience??
    SyncedCron.remove(jobName);
    SyncedCron.add({
      name: jobName,
      schedule(parser) {
        const laterjsSchedule = `every ${ duration.interval } min`;
        return parser.text(laterjsSchedule);
      },
      job() {
        log.job(`Starting job ${ n } for ${ experience._id }`);

        let query = {};
        if (experience.location) {
          const options = {
            radius: experience.radius
          };
          const atLocation = Cerebro.liveQuery(experience.location, options);
          const newlyAtLocation = _.difference(atLocation, usersReached);
          query = {
            'profile.subscriptions': experience._id,
            _id: { $in: newlyAtLocation }
          };
        } else {
          query = {
            'profile.subscriptions': experience._id
          };
        }

        if (CONFIG.NOTIFY_ALL) {
          delete query['profile.subscriptions'];
        }

        const newlyReached = Meteor.users.find(
          query,
          { fields: { _id: 1 } }
        ).fetch().map(user => user._id);
        Cerebro.setActiveExperiences(newlyReached, experience._id);
        Cerebro.addIncidents(newlyReached, activeIncident);
        usersReached.push(...newlyReached);

        if (!this.isSimulation) {
          Cerebro.notify({
            userIds: newlyReached,
            experienceId: experience._id,
            subject: notificationOptions.subject,
            text: notificationOptions.text,
            route: notificationOptions.route
          });
        }
        log.debug(usersReached);

        const result = `Reached ${ newlyReached.length } new users, for a total of ${ usersReached.length } users.`;
        log.job(`Complete job ${ n } from ${ experience._id }`);
        log.job(result);

        n += 1;
        if (n > duration.counts) {
          // TODO: probably do at start of next job?
          SyncedCron.remove(jobName);
          Meteor.setTimeout(() => {
            endExperience(experience, usersReached, notificationOptions);
          }, 60 * 1000); // FIXME: 1 minute delay right now
        }

        return result;
      }
    });

    return jobName;
  }
});

export const launchChainExperience = new ValidatedMethod({
  name: 'launcher.chain',
  validate: new SimpleSchema({
    // TODO: encode in experience?
    chainLength: {
      type: Number
    },
    experience: {
      type: Schema.Experience
    },
    notificationOptions: {
      type: Schema.NotificationOptions
    }
  }).validator(),
  run({ experience, notificationOptions }) {
  }
});

export const endInstantExperience = new ValidatedMethod({
  name: 'launcher.endInstant',
  validate: new SimpleSchema({
    experience: {
      type: Schema.Experience
    },
    notificationOptions: {
      type: Schema.NotificationOptions
    },
  }).validator(),
  run({ experience, notificationOptions }) {
    // TODO: encode some sense of who participate / should be included instead of just sending this
    if (experience.activeIncident) {
      const userIds = getUsersToNotify(experience);
      endExperience(experience, userIds, notificationOptions);
    }
  }
});
