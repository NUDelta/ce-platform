import './profile_question.html';

import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Schema } from '../../api/schema.js';

Template.profile_question.onCreated(function() {
  setNewQualification();
});

Template.profile_question.helpers({
  question: function () {
    return Session.get('qualification');
  }
});

Template.profile_question.events({
  'click .btn-yes': function () {
    let qualification = Session.get('qualification');
    Meteor.call('users.setQualification', {qualification, value: true});
    setNewQualification();
  },
  'click .btn-no': function () {
    let qualification = Session.get('qualification');
    Meteor.call('users.setQualification', {qualification, value: false});
    setNewQualification();
  }
});

let setNewQualification = function() {
  let qualification = Session.get('qualification');
  while (qualification === Session.get('qualification')) {
    qualification = Schema.CEQualifications[Math.floor(Math.random()*Schema.CEQualifications.length)];
  }
  console.log(qualification);
  Session.set('qualification', qualification);
};