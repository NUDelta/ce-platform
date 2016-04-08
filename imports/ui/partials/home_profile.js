import './home_profile.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { updateUserExperiences } from '../../api/experiences/methods.js';

Template.home_profile.helpers({
  hasCamera: function() {
    return Meteor.user().profile.qualifications.hasCamera;
  },
  hasDog: function() {
    return Meteor.user().profile.qualifications.hasDog;
  }
});

Template.home_profile.events({
  'submit .profile-settings': function (event) {
    event.preventDefault();
    Meteor.users.update(Meteor.userId(), {
      $set: {
        'profile.qualifications.hasCamera': event.currentTarget.camera.checked,
        'profile.qualifications.hasDog': event.currentTarget.dog.checked
      }});
    updateUserExperiences.call({ userId: Meteor.userId() });
  }
});
