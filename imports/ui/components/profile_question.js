import './profile_question.html';

import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Schema } from '../../api/schema.js';

import { Questions } from '../../api/users/qualification_questions.js';

Template.profile_question.onCreated(function() {
  setNewQualification();
});

Template.profile_question.helpers({
  question: function () {
    return Questions[Session.get('qualification')];
  },
  unansweredQuestions: function () {
    let qualifications = Meteor.user().profile.qualifications;
    let answer = _.any(_.values(qualifications), function (v) { return _.isNull(v) });
    console.log(answer);
    return answer;
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