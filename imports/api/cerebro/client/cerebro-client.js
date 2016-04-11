import { Meteor } from 'meteor/meteor';

import { CerebroCore } from '../cerebro-core.js';

CerebroClient = class CerebroClient extends CerebroCore {
  constructor() {
    super();
  }

  notify(experienceId, subject, text, appendIncident) {
    Meteor.call('cerebro.notify', {
      experienceId: experienceId,
      subject: subject,
      text: text,
      appendIncident: appendIncident
    }, (err, res) => {
      if (err) {
        console.log('error', err);
      } else {

      }
    });
  }

  scheduleNotifications(experienceId, subject, text) {
    let schedule = 'every 1 mins';
    Meteor.call('cerebro.scheduleNotifications', {
      experienceId: experienceId,
      subject: subject,
      text: text,
      schedule: schedule
    }, (err, res) => {
      if (err) {
        console.log('error', err);
      } else {

      }
    });
  }
};

export const Cerebro = new CerebroClient();

Cerebro.PUSH = CerebroCore.PUSH;
Cerebro.EMAIL = CerebroCore.EMAIL;
