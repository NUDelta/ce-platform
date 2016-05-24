import './home.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import { Experiences } from '../../api/experiences/experiences.js';

import '../partials/home_profile.js';
import '../partials/home_subscriptions.js';
import '../components/active_experience.js';

Template.home.onCreated(function() {
  this.subscribe('experiences.activeUser'); // TODO: make more specific
});

Template.home.helpers({
  activeExperiences() {
    return Meteor.users.findOne(Meteor.userId()).profile.activeExperiences;
  },
  activeExperienceArgs(experienceId) {
    return {
      experience: Experiences.findOne(experienceId)
    };
  }
});
