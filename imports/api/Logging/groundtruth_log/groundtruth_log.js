import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../../schema.js';

export const Groundtruth_log = new Mongo.Collection('groundtruth_log');

Schema.Groundtruth_log = new SimpleSchema({
  uid: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'user id'
  },
  timestamp: {
    type: Date,
  },
  label: {
    type: String,
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
  affordances: {
    type: Object,
    blackbox: true
  },
});

Groundtruth_log.attachSchema(Schema.Groundtruth_log);

