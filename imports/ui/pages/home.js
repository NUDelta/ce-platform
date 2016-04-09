import './home.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import '../partials/home_profile.js';
import '../partials/home_subscriptions.js';

Template.home.helpers({
  activeExperiences: function () {
    return Meteor.users.findOne({_id: Meteor.userId()}).profile.activeExperiences;
  }
});

Template.activeExperience.events({
  'click .btn-participate': function () {
    incidentId = Experiences.findOne({_id: this.toString()}).activeIncident;
    Router.go('participatePage', {_id: incidentId});
  }
});

Template.activeExperience.helpers({
  name: function () {
    return Experiences.findOne(this.toString()).name;
  }
});