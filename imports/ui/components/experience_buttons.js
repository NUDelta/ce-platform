import './experience_buttons.html';

import { Template } from 'meteor/templating';
import { Cerebro } from 'meteor/collectiveexperiences:cerebro';

Template.experienceButtons.events({
  'click .start-btn': function(e) {
    e.preventDefault();
    Cerebro.notify(this._id, `Event "${this.name}" is starting!`, this.startText);
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
    alert(`Sent ${this.name}`);
  }
});
