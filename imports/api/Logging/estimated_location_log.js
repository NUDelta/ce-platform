import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../schema.js';

export const EstimatedLocation_log= new Mongo.Collection('estimatedLocation_log');

Schema.EstimatedLocation_log = new SimpleSchema({
  uid: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'user id'
  },
  raw_location_id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'most recent corresponding raw location id'
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
  timestamp: {
    type: Date,
  },
  affordances: {
    type: Object,
    blackbox: true,
    optional: true
  },
  availabilityDictionary: {
    type: Object,
    blackbox: true,
    optional: true
  }
});

EstimatedLocation_log.attachSchema(Schema.EstimatedLocation_log);

EstimatedLocation_log.allow({
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
