//user query methods
import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { SyncedCron } from 'meteor/percolate:synced-cron';

import { Cerebro } from './cerebro-server.js';
import { Experiences } from '../../experiences/experiences.js';
//import { LocationManager } from '../../locations/client/location-manager-client.js';
import { Schema } from '../../schema.js';
import { log } from '../../logs.js';

export const notify = new ValidatedMethod({
  name: 'cerebro.notify',
  validate: new SimpleSchema({
    experienceId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    subject: {
      type: String,
      optional: true
    },
    text: {
      type: String,
      optional: true
    },
    appendIncident: {
      type: Boolean
    },
    route: {
      type: String
    }
  }).validator(),
  run({ experienceId, subject, text, appendIncident, route }) {
    let experience = Experiences.findOne(experienceId),
        query;
    subject = subject || experience.name;
    text = text || experience.startText;
    if (experience.location) {
      log.cerebro(`Notifying users for experience "${ experience.name }" in ${ experience.location }`);
      let atLocation = Cerebro.liveQuery(experience.location);
      query = {
        'profile.subscriptions': experienceId,
        _id: { $in: atLocation }
      };
    }
    else {
      log.cerebro(`Notifying users for experience "${ experience.name }". No detected, so notifying everyone.`);
      query = {
        'profile.subscriptions': experienceId
      };
    }

    if (Cerebro.NOTIFY_ALL) {
      log.info('Debug enabled. Ignoring user subscriptions.');
      delete query['profile.subscriptions'];
    }

    let users = Meteor.users.find(query, { fields: { _id: 1, emails: 1 }}).fetch();
    let userIds = _.map(users, user => user._id);
    if (appendIncident) {
      Cerebro.setActiveExperiences(userIds, experience._id);
      Cerebro.addIncidents(userIds, experience.activeIncident);
    }
    Cerebro.notify(users, this, subject, text, experienceId, route);
  }
});

export const scheduleNotifications = new ValidatedMethod({
  name: 'cerebro.scheduleNotifications',
  validate: new SimpleSchema({
    experienceId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    subject: {
      type: String,
      optional: true
    },
    text: {
      type: String,
      optional: true
    },
    schedule: {
      type: String
    },
    appendIncident: {
      type: Boolean
    }
  }).validator(),
  run({ experienceId, subject, text, schedule, appendIncident }) {
    let n = 0,
      server = this,
      usersReached = [],
      experience = Experiences.findOne(experienceId),
      name = `Notifying users for experience ${experienceId}`;

    log.cerebro(`Scheduling notifications for users for experience "${ experience.name }" in ${ experience.location }`);

    subject = subject || experience.name;
    text = text || experience.startText;

    SyncedCron.remove(name);
    SyncedCron.add({
      name: name,
      schedule: function(parser) {
        return parser.text(schedule);
      },
      job: function() {
        log.job(`Starting job ${n} for ${experienceId}`);
        n += 1;
        if (n === 60) {
          SyncedCron.remove(name);
        }

        let query = {};
        if (experience.location) {
          let atLocation = Cerebro.liveQuery(experience.location);
          let newlyAtLocation = _.difference(atLocation, usersReached);
          query = {
            'profile.subscriptions': experienceId,
            _id: { $in: newlyAtLocation }
          };
        } else {
          query = {
            'profile.subscriptions': experienceId
          };
        }

        if (Cerebro.NOTIFY_ALL) {
          delete query.profile;
        }

        const newUsers = Meteor.users.find(
          query,
          { fields: { _id: 1, emails: 1 }}
        ).fetch().map(user => user._id);
        Cerebro.notify(newUsers, server, subject, text, 'participate');
        if (appendIncident) {
          Cerebro.setActiveExperiences(newUsers, experience._id);
          Cerebro.addIncidents(newUsers, experience.activeIncident);
        }
        usersReached.push(...newUsers);

        log.job(`Completed job ${n} for ${experienceId}`);
        return n;
      }
    });
  }
});

export const startChain = new ValidatedMethod({
  name: 'cerebro.startChain',
  validate: new SimpleSchema({
    experienceId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    subject: {
      type: String,
      optional: true
    },
    text: {
      type: String,
      optional: true
    },
    chainLength: {
      type: Number,
      optional: true
    }
  }).validator(),
  run({ experienceId, subject, text, chainLength }) {
    let userChain = [];
    let userSet = Meteor.users.find({ 'profile.subscriptions': experienceId }).fetch();

    if (Cerebro.NOTIFY_ALL) {
      userSet = Meteor.users.find().fetch();
    }

    const experience = Experiences.findOne(experienceId);
    const cronName = `${ experienceId } chain notifications`;

    subject = subject || experience.name;
    text = text || experience.startText;
    chainLength = chainLength || userSet.length;
    log.cerebro(`Schedule chain notifications for "${ experience.name }"`);
    log.cerebro(`Chain is expected to go for ${ chainLength } runs over ${ userSet.length } users`);

    SyncedCron.remove(cronName);
    SyncedCron.add({
      name: cronName,
      schedule(parser) {
        // add some interrupting behavior if someone submits?
        return parser.text('every 30 seconds');
      },
      job() {
        log.job(`Pinging participant #${ userChain.length + 1 } for ${ experience.name }`);
        if (userChain.length >= chainLength) {
          SyncedCron.remove(cronName);
          Cerebro.notify(
            userChain, this, experience.name, `${ experience.name } has ended!`,
            experience.activeIncident, 'results'
          );
          Cerebro.addIncidents(userChain, experience.activeIncident);
        } else {
          const nextUser = userSet.shift();
          userChain.push(nextUser);
          Cerebro.notify([ nextUser ], this, subject, text, experienceId, 'participate');
          log.debug(nextUser);

          Cerebro.setActiveExperiences([ nextUser ], experienceId);
          const previousUser = userChain[userChain.length - 1];
          if (previousUser) {
            Cerebro.removeActiveExperiences([ previousUser ], experienceId);
          }
        }
      }
    })
  }
});

export const doLiveQuery = new ValidatedMethod({
  name: 'cerebro.liveQuery',
  validate: new SimpleSchema({
    locationType: {
      type: String,
      label: 'location type',
      allowedValues: _.map(Schema.YelpCategories, category => category.alias)
    },
    radius: {
      type: Number,
      label: 'radius'
    }
  }).validator(),
  run({ locationType, radius }) {
    return Cerebro.liveQuery(locationType, { radius });
  }
});

export const notifyOnAffordances = new ValidatedMethod({
  name: 'cerebro.notifyOnAffordances',
  validate: new SimpleSchema ({
    lat: {
      type: String,
      label: 'latitude'
    },
    lng: {
      type: String,
      label: 'longitude'
    },
    uid: {
      type: String,
      label: 'uid'
    },
    experience: {
      type: Object,
      label: 'experience',
      blackbox: true,
    },
    notificationOptions: {
      type: Object,
      label: 'notificationOptions',
      blackbox: true
    }
  }).validator(),
  run({ lat, lng, uid, experience, notificationOptions}) {
    let request = require('request');
    let url = 'https://affordanceaware.herokuapp.com/conditions/' + lat + '/' + lng;
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          let res = JSON.parse(body);
          let userIds = [uid];
          console.log(res.affordances);
          console.log(experience.affordance);
          if (_.contains(res.affordances, experience.affordance)) {
            console.log('Notifying user');
            console.log(userIds);
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
  }
});
