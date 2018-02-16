import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../schema.js';

export const AvailabilityLog = new Mongo.Collection('availabilitylog');

Schema.AvailabilityLog = new SimpleSchema({
  uid: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  now : {
    type: Number,
  },
  lastParticipated: {
    type: Number,
    optional: true,
  },
  lastNotified: {
    type: Number,
    optional: true,
  },
  affordances: {
     type: Object,
     blackbox: true
  },
  lat:{
    type: Number,
    decimal: true,
    min: -90,
    max: 90
  },
  lng:{
    type: Number,
    decimal: true,
    min: -180,
    max: 180
  }
});

AvailabilityLog.attachSchema(Schema.AvailabilityLog);
