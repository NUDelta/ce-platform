import { Meteor } from 'meteor/meteor';

import { CerebroCore } from '../cerebro-core.js';

// TODO: change these to validatedmethod calls?
CerebroClient = class CerebroClient extends CerebroCore {
  constructor() {
    super();
  }

  notify(experienceId, subject, text, appendIncident, route) {
    Meteor.call('cerebro.notify', {
      experienceId: experienceId,
      subject: subject,
      text: text,
      appendIncident: appendIncident,
      route: route
    }, (err, res) => {
      if (err) {
        console.log('error', err);
      } else {

      }
    });
  }

  scheduleNotifications(experienceId, subject, text, appendIncident) {
    let schedule = 'every 1 mins';
    Meteor.call('cerebro.scheduleNotifications', {
      experienceId: experienceId,
      subject: subject,
      text: text,
      schedule: schedule,
      appendIncident: appendIncident
    }, (err, res) => {
      if (err) {
        console.log('error', err);
      } else {

      }
    });
  }

  startChain(experienceId, subject, text, chain) {
    Meteor.call('cerebro.startChain', {
      experienceId: experienceId,
      subject: subject,
      text: text,
      chain: chain
    });
  }
};

export const Cerebro = new CerebroClient();

Cerebro.PUSH = CerebroCore.PUSH;
Cerebro.EMAIL = CerebroCore.EMAIL;
