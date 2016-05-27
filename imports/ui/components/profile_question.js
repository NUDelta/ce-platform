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
    return _.any(_.values(qualifications), function (v) { return _.isNull(v) });
  }
});

Template.profile_question.events({
  'click .btn-yes': function () {
    let qualification = Session.get('qualification');
    Meteor.call('users.setQualification', {qualification, value: true}, function(err, res) {
      if (err) {
        alert(err);
      }
      else {
        setNewQualification();
      }
    });
  },
  'click .btn-no': function () {
    let qualification = Session.get('qualification');
    Meteor.call('users.setQualification', {qualification, value: false}, function(err, res) {
      if (err) {
        alert(err);
      }
      else {
        setNewQualification();
      }
    });
  }
});

let setNewQualification = function() {
  let qualifications = Meteor.user().profile.qualifications;
  let qualification = _.find(Schema.CEQualifications, function(q) {
    if (qualifications[q] === null) {
      return true;
    }
  });
  console.log(qualification);
  Session.set('qualification', qualification);
  return true;
};