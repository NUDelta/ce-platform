import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../schema.js';


Schema.NotificationLog = new SimpleSchema({
  uid: {
    type: String
  },
  lat: {
    type: Number,
    decimal: true,
    min: -90,
    max: 90
  },
  lng: {
    type: Number,
    decimal: true,
    min: -180,
    max: 180
  },
  need: {
    type: String
  },
  iid: {
    type: String
  },
  timestamp: {
    type: Date
  },
});
export const NotificationLog = new Mongo.Collection('notificationlog');
NotificationLog.attachSchema(Schema.NotificationLog);
