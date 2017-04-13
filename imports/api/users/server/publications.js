import { Meteor } from 'meteor/meteor';
import { Users } from '../users.js';

Meteor.publish('all_users', function() {
  return Meteor.users.find({});
});
