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
      Cerebro.notify({
        experienceId: instance.data.experience._id,
        subject: `Event "${instance.data.experience.name}" is starting!`,
        text: instance.data.experience.startText,
        appendIncident: true,
        route: 'participate'
      });
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
        Cerebro.scheduleNotifications({
          experienceId: instance.data.experience._id,
          subject: `Event "${instance.data.experience.name}" is starting!`,
          text: instance.data.experience.startText,
          appendIncident: true
        });
    });
    alert(`Notifications scheduled for ${ instance.data.experience.name }`);
  },
  'click .end-btn:not(.disabled)'(event, instance) {
    event.preventDefault();
    Cerebro.notify({
      experienceId: instance.data.experience._id,
      subject: `"${ instance.data.experience.name }" has ended.`,
      text: `${ instance.data.experience.name } has ended. Thanks for participating!`,
      appendIncident: false,
      route: 'results'
    });
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
    return data.experience.activeIncident;
  }
});
