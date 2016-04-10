import './home.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Experiences } from '../../api/experiences/experiences.js';

import '../partials/home_profile.js';
import '../partials/home_subscriptions.js';
import '../components/active_experience.js';
import '../components/result_link.js';

Template.home.helpers({
  activeExperiences: function () {
    return Meteor.users.findOne({_id: Meteor.userId()}).profile.activeExperiences;
  },
  pastIncidents: function () {
    return Meteor.user().profile.pastIncidents;
  }
});