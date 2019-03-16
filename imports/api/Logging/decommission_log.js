import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../schema.js';

export const Decommission_log = new Mongo.Collection('decommission_log');

Schema.Decommission_log = new SimpleSchema({
  iid: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'incident id that user is being removed from'
  },
  uid: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'user id'
  },
  needName: {
    type: String,
    label: 'need name that user is being removed from'
  },
  lat: {
    type: Number,
    decimal: true,
    min: -90,
    max: 90,
    label: 'latitude: last estimated location when decommissioned'
  },
  lng: {
    type: Number,
    decimal: true,
    min: -180,
    max: 180,
    label: 'longitude: last estimated location when decommissioned'
  },
  timestamp: {
    type: Date,
  },
  affordances: {
    type: Object,
    blackbox: true,
    optional: true
  },
  decommissionDelay: {
    type: Number,
    optional: true
  }
});

Decommission_log.attachSchema(Schema.Decommission_log);

Decommission_log.allow({
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
