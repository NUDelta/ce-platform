import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../schema.js';

export const Location_log = new Mongo.Collection('location_log');

Schema.Location_log = new SimpleSchema({
  uid: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'user id'
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
  speed: {
    type: Number,
    decimal: true
  },
  floor: {
    type: Number,
    decimal: true
  },
  accuracy: {
    type: Number,
    decimal: true
  },
  altitude_accuracy: {
    type: Number,
    decimal: true
  },
  altitude: {
    type: Number,
    decimal: true
  },
  heading: {
    type: Number,
    decimal: true
  },
  is_moving: {
    type: Boolean
  },
  activity_type: {
    type: String
  },
  activity_confidence: {
    type: Number,
    decimal: true
  },
  battery_level: {
    type: Number,
    decimal: true
  },
  battery_is_charging: {
    type: Boolean
  },
  timestamp: {
    type: Date,
  },
  affordances: {
    type: Object,
    blackbox: true
  }
});

Location_log.attachSchema(Schema.Location_log);

Location_log.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  }
});
