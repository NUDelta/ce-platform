import { Accounts } from 'meteor/accounts-base';
import { Schema } from '../../api/schema.js'

Accounts.onCreateUser(function (options, user) {
  user.profile = user.profile || {};
  user.profile.experiences = [];
  user.profile.subscriptions = [];
  user.profile.qualifications = {};
  for(let qualification of Schema.CEQualifications) {
    user.profile.qualifications[qualification] = false;
  }
  return user;
});
