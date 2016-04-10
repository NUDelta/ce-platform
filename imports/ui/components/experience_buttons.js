import './experience_buttons.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Cerebro } from 'meteor/collectiveexperiences:cerebro';
import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';
import { Schema } from '../../api/schema.js';

import { removeFromAllActiveExperiences } from '../../api/users/methods.js';
import { insertIncident } from '../../api/incidents/methods.js';

Template.experienceButtons.events({
  'click .start-btn': function(e) {
    e.preventDefault();
    let experienceId = this._id
    Cerebro.notify(this._id, `Event "${this.name}" is starting!`, this.startText);
    insertIncident.call({name: this.name, experience: this._id, launcher: Meteor.userId() });
    alert(`Sent ${this.name}`);
  },
  'click .schedule-btn': function(e) {
    e.preventDefault();
    Cerebro.scheduleNotifications(this._id, `Event "${this.name}" is starting!`);
  },
  'click .end-btn': function(e) {
    e.preventDefault();
    let endEmailText = '<p>The experience has ended. Thanks for participating! Click <a href="http://localhost:3000/results/' + this._id + '">this link</a> to see the results.</p>';
    Cerebro.notify(this._id, 'Your experience has ended.', endEmailText);
    removeFromAllActiveExperiences.call({ experienceId: this._id});
    Experiences.update({_id: this._id}, {$set: {'activeIncident': null}});
    alert(`Sent ${this.name}`);
  }
});
