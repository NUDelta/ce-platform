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


//////THIS CODE IS NO LONGER USED
//////WARNING DEPRECATED CODE
//////TODO: Delete this file


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
