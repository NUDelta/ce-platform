import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { SyncedCron } from 'meteor/percolate:synced-cron';

import { Cerebro } from './cerebro-server.js';
import { Experiences } from '../../experiences/experiences.js';
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
    } else {
      log.cerebro(`Notifying users for experience "${ experience.name }". No location detected, so notifying everyone.`);
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
      Meteor.users.update({ _id: {$in: userIds}}, {$push: { 'profile.activeExperiences': experience._id }}, { multi: true });
      Meteor.users.update({_id: {$in: userIds}}, {$push: {'profile.pastIncidents': experience.activeIncident}}, {multi: true});
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


    // TODO: Cron jobs aren't really the way to do this.
    // Try to send signal to devices to report back to us.
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
          Meteor.users.update({_id: {$in: newUsers}}, {$push: {'profile.pastIncidents': experience.activeIncident}}, {multi: true});
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
    appendIncident: {
      type: Boolean
    }
  }).validator(),
  run({ experienceId, subject, text, appendIncident }) {
    let chain = [];
  }
});

