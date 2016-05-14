import './experience_buttons.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Experiences } from '../../api/experiences/experiences.js';
import { Cerebro } from '../../api/cerebro/client/cerebro-client.js';

Template.experienceButtons.events({
  'click .start-btn:not(.disabled)'(event, instance) {
    event.preventDefault();
    // Importing exports causes problematic dependencies between server/client here
    Meteor.call('launcher.instant', {
      experience: instance.data.experience,
      notificationOptions: {
        subject: `Event "${instance.data.experience.name}" is starting!`,
        text: instance.data.experience.startText,
        route: 'participate'
      }
    }, (err, res) => {
      if (err) {
        alert(err);
      } else {
        alert(`Launched ${instance.data.experience.name}`);
      }
    });
  },
  'click .schedule-btn:not(.disabled)'(event, instance) {
    event.preventDefault();

    Meteor.call('launcher.duration', {
      duration: {
        interval: 1,
        counts: 2
      },
      experience: instance.data.experience,
      notificationOptions: {
        subject: `Event "${instance.data.experience.name}" is starting!`,
        text: instance.data.experience.startText,
        route: 'participate'
      }
    }, (err, res) => {
      if (err) {
        alert(err);
      } else {
        alert(`Notifications scheduled for ${ instance.data.experience.name }`);
      }
    });
  },
  'click .end-btn:not(.disabled)'(event, instance) {
    event.preventDefault();
    // TODO: figure out premature end for scheduled experience
    Meteor.call('launcher.endInstant', {
      experience: instance.data.experience,
      notificationOptions: {
        subject: `"${ instance.data.experience.name }" has ended.`,
        text: `${ instance.data.experience.name } has ended. Thanks for participating!`,
        route: 'results'
      }
    }, (err, res) => {
      if (err) {
        alert(err);
      } else {
        alert(`End notification sent out for ${ instance.data.experience.name }`);
      }
    });
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
