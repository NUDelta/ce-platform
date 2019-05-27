import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../schema.js';

export const ParticipatingNow_log = new Mongo.Collection('participating_now_log');

Schema.ParticipatingNow_log = new SimpleSchema({
  uid: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'user id'
  },
  action: {
    type: String,
    label: 'are you "push" to or "pull" from participating now',
  },
  timestamp: {
    type: Date,
  },
  iid: {
    type: String,
  },
  needName: {
    type: String
  }
});

ParticipatingNow_log.attachSchema(Schema.ParticipatingNow_log);

