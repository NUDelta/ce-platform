import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

export const getEmails = new ValidatedMethod({
  name: 'users.getEmails',
  validate: new SimpleSchema({
    users: {
      type: Array
    },
    'users.$': {
      type: Object
    }
  }).validator(),
  run({ users }) {
    return _.map(users, user => Meteor.users.findOne(user).emails[0]);
  }
});

export const getUsers = new ValidatedMethod({
  name: 'users.find',
  validate: new SimpleSchema({
    query: {
      type: Object
    },
    options: {
      type: Object
    }
  }).validator(),
  run({ query, options }) {
    return Meteor.users.find(query, options).fetch();
  }
});

export const getSubscriptions = new ValidatedMethod({
  name: 'users.getSubscriptions',
  validate: new SimpleSchema({
    userId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),
  run({ userId }) {
    return Meteor.users.findOne(userId, { fields: { 'profile.subscriptions': 1 }});
  }
});
