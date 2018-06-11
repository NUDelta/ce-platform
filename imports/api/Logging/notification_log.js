import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../schema.js';

export const Notification_log = new Mongo.Collection('notification_log');

Schema.Notificiation_log = new SimpleSchema({
  uid: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'user id'
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

Notification_log.attachSchema(Schema.Notificiation_log);

