import { Accounts } from 'meteor/accounts-base';
import { Schema } from '../../api/schema.js'
import { Experiences } from '../../api/experiences/experiences.js';

Accounts.onCreateUser(function (options, user) {
  user.profile = user.profile || {};
  user.profile.experiences = [];
  user.profile.subscriptions = [];
  user.profile.qualifications = {};
  // Auto-subscribe new users to every experience that isn't opt-in
  Experiences.find({optIn: false}).fetch().forEach(function (obj) {
    user.profile.subscriptions.push(obj._id);
  });
  for(let qualification of Schema.CEQualifications) {
    user.profile.qualifications[qualification] = false;
  }
  return user;
});
