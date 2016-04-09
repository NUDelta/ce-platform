import './experience_buttons.html';

import { Template } from 'meteor/templating';
import { Cerebro } from 'meteor/collectiveexperiences:cerebro';

Template.experienceButtons.events({
  'click .start-btn': function(e) {
    e.preventDefault();
    let experienceId = this._id
    Cerebro.notify(this._id, `Event "${this.name}" is starting!`, this.startText);
    Incidents.insert({
      date: Date.parse(new Date()),
      name: this.name,
      experience: this._id,
      launcher: Meteor.userId(),
    }, function(error, id) {
      if (error) {
        console.log(error);
      }
      else {
        console.log("inserting incident");
        console.log(experienceId);
        Experiences.update({_id: experienceId}, {$set: {'activeIncident': id}});
      }
    });
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
    Meteor.call('removeFromAllActiveExperiences', this._id);
    Experiences.update({_id: this._id}, {$set: {'activeIncident': null}});
    alert(`Sent ${this.name}`);
  }
});
