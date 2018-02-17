import { Meteor } from 'meteor/meteor';
import { Users } from '../users.js';

Meteor.publish('users.all', function () {
  return Meteor.users.find({});
});

Meteor.publish('users.single', function (uid) {
  return Meteor.users.findOne(uid);
});
