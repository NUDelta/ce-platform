import './subscribe_experience.html';

import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Schema } from '../../api/schema.js';

Template.subscribeExperience.helpers({
  isSubscribed: function () {
    if (Meteor.user()) {
      return Meteor.user().profile.subscriptions.indexOf(this._id) > -1;
    }
    else {
      return false;
    }
  }
});

Template.subscribeExperience.events({
  'click .btn-subscribe': function () {
    Meteor.call('users.subscribeUserToExperience', {experienceId: this._id});
  },
  'click .btn-unsubscribe': function () {
    console.log(this);
    Meteor.call('users.unsubscribeUserFromExperience', {experienceId: this._id});
  }
});