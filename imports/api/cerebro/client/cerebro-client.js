import { Meteor } from 'meteor/meteor';

import { CerebroCore } from '../cerebro-core.js';

// TODO: change these to validatedmethod calls?
CerebroClient = class CerebroClient extends CerebroCore {
  constructor() {
    super();
  }

  notify({ experienceId, subject, text, appendIncident, route }) {
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

  scheduleNotifications({ experienceId, subject, text, appendIncident }) {
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

  getSubmissionLocation(latStr, lngStr) {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    if (lat <= 42.062833 && lat > 42.055657 && lng >= -87.679559 && lng < -87.669491) {
      return "NU North Campus";
    } else if (lat <= 42.055657 && lat > 42.048593 && lng >= -87.679559 && lng < -87.669491) {
      return "NU South Campus";
    } else if (lat <= 42.078932 && lat > 42.019184 && lng >= -87.711036 && lng < -87.669491) {
      return "Off-campus Evanston";
    } else if (lat <= 42.1796 && lat > 41.683914 && lng >= -87.940299 && lng < -87.669491) {
      return "Greater Chicago, IL Area";
    } else if (lat <= 43.153463 && lat > 42.696882 && lng >= -79.038439 && lng < -78.656952) {
      return "Greater Buffalo, NY Area";
    } else if (lat <= 40.882255 && lat > 40.540665 && lng >= -74.203905 && lng < -73.756606) {
      return "Greater New York, NY Area";
    } else if (lat <= 38.721315 && lat > 38.564493 && lng >= -90.370798 && lng < -90.152168) {
      return "Greater St. Louis, MO Area";
    } else {
      return "(" + lat + ", " + lng + ")";
    }
  }
};

export const Cerebro = new CerebroClient();

Cerebro.PUSH = CerebroCore.PUSH;
Cerebro.EMAIL = CerebroCore.EMAIL;
