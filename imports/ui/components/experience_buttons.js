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
    e.preventDefault();
    insertIncident.call({ name: this.name, experience: this._id, launcher: Meteor.userId() }, () => {
      Cerebro.notify(this._id, `Event "${this.name}" is starting!`, this.startText, true, 'participate');
    });
    alert(`Sent ${this.name}`);
  },
  'click .schedule-btn:not(.disabled)'(event, instance) {
    e.preventDefault();
    insertIncident.call({ name: this.name, experience: this._id, launcher: Meteor.userId() }, () => {
      Cerebro.scheduleNotifications(this._id, `Event "${this.name}" is starting!`, this.startText, true);
    });
    alert(`Notifications scheduled for ${ this.name }`);
  },
  'click .end-btn:not(.disabled)'(event, instance) {
    e.preventDefault();
    const endEmailText = `${ this.name } has ended. Thanks for participating!`;
    Cerebro.notify(this._id, 'Your experience has ended.', endEmailText, false, 'results');
    removeFromAllActiveExperiences.call({ experienceId: this._id});
    Experiences.update({_id: this._id}, {$unset: {'activeIncident': 0}});
    alert(`Sent ${this.name}`);
  },
  'click .chain-btn'(event, instance) {
    Cerebro.startChain(this._id);
    alert(`Starting chain for ${ this.name }`);
  }
});

Template.experienceButtons.helpers({
  isRunning() {
    const data = Template.currentData();
    return data.activeIncident;
  }
});
