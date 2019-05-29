import { Meteor } from 'meteor/meteor';
import { Messages } from '../messages.js';

Meteor.publish("messages", function() {
  return Messages.find({}, { fields: { name: 1, message: 1, createdAt: 1, announcement: 1, recipient: 1 }, limit: 100, sort: { createdAt: -1 } }); //we want the 100 most recent messages
});