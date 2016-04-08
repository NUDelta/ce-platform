import './home.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import '../partials/home_profile.js';
import '../partials/home_subscriptions.js';

Template.home.helpers({
  activeExperience: function () {
    return Meteor.users.findOne({_id: Meteor.userId()}).profile.activeExperience;
  }
});

Template.home.events({
  'click .btn-participate': function () {
    Router.go('participate', {_id: Meteor.users.findOne({_id: Meteor.userId()}).profile.activeExperience});
  }
});