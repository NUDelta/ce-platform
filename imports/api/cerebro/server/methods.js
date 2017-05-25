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
    },
    incident: {
      type: String,
      label: 'activeIncident',
    }
  }).validator(),
  run({ lat, lng, uid, experience, notificationOptions, incident}) {
    let request = require('request');
    let url = 'https://affordanceaware.herokuapp.com/location_tags/' + lat + '/' + lng;
    request(url, Meteor.bindEnvironment(function (error, response, body) {
      if (!error && response.statusCode == 200) {
          let res = JSON.parse(body);
          let userIds = [uid];
          console.log("res affordances: " + res);
          console.log("experience affordances: " + experience.affordance);
          console.log("difference: " + _.difference(experience.affordance, res))

          // if (_.contains(res.affordances, experience.affordance)) {
          if (_.difference(experience.affordance, res) == 0) {
            console.log('Notifying user');
            console.log('notifying: ' + userIds);
            Cerebro.setActiveExperiences(userIds, experience._id);
            Cerebro.addIncidents(userIds, incident);
            Cerebro.notify({
              userIds: userIds,
              experienceId: experience._id,
              subject: notificationOptions.subject,
              text: notificationOptions.text,
              route: notificationOptions.route
            });
          }
      }
    }));
  }
});
