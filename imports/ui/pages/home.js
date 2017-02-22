import './home.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import { Experiences } from '../../api/experiences/experiences.js';

import '../components/active_experience.js';

Template.home.onCreated(function() {
  this.subscribe('experiences.activeUser'); // TODO: make more specific
});

Template.home.helpers({
  activeExperiences() {
    console.log(Meteor.users.findOne(Meteor.userId()).profile.activeExperiences);
    return Meteor.users.findOne(Meteor.userId()).profile.activeExperiences;
  },
  noActiveExperiences() {
    let activeExperiences = Meteor.users.findOne(Meteor.userId()).profile.activeExperiences;
    return activeExperiences == null || activeExperiences.length == 0;
  },
  activeExperienceArgs(experienceId) {
    return {
      experience: Experiences.findOne(experienceId)
    };
  }
});
