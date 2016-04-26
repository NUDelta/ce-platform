import './experience_buttons.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';
import { Schema } from '../../api/schema.js';
import { Cerebro } from '../../api/cerebro/client/cerebro-client.js';

import { removeFromAllActiveExperiences } from '../../api/users/methods.js';
import { insertIncident } from '../../api/incidents/methods.js';

Template.experienceButtons.events({
  'click .start-btn:not(.disabled)'(event, instance) {
    event.preventDefault();
    insertIncident.call({
      name: instance.data.experience.name,
      experience: instance.data.experience._id,
      launcher: Meteor.userId()
    }, () => {
      Cerebro.notify(instance.data.experience._id,
        `Event "${instance.data.experience.name}" is starting!`,
        instance.data.experience.startText,
        true,
        'participate');
    });
    alert(`Sent ${instance.data.experience.name}`);
  },
  'click .schedule-btn:not(.disabled)'(event, instance) {
    event.preventDefault();
    insertIncident.call({
      name: instance.data.experience.name,
      experience: instance.data.experience._id,
      launcher: Meteor.userId() },
      () => {
        Cerebro.scheduleNotifications(
          instance.data.experience._id,
          `Event "${instance.data.experience.name}" is starting!`,
          instance.data.experience.startText,
          true);
    });
    alert(`Notifications scheduled for ${ instance.data.experience.name }`);
  },
  'click .end-btn:not(.disabled)'(event, instance) {
    event.preventDefault();
    const endEmailText = `${ instance.data.experience.name } has ended. Thanks for participating!`;
    Cerebro.notify(
      instance.data.experience._id,
      'Your experience has ended.',
      endEmailText,
      false,
      'results');
    removeFromAllActiveExperiences.call({ experienceId: instance.data.experience._id});
    Experiences.update({
      _id: instance.data.experience._id
    }, {
      $unset: { 'activeIncident': 0 }
    });
    alert(`Sent ${instance.data.experience.name}`);
  },
  'click .chain-btn'(event, instance) {
    event.preventDefault();
    Cerebro.startChain(instance.data.experience._id);
    alert(`Starting chain for ${ instance.data.experience.name }`);
  }
});

Template.experienceButtons.helpers({
  isRunning() {
    const data = Template.currentData();
    return data.activeIncident;
  }
});
