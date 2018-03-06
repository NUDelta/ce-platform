import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../schema.js';

export const Locations = new Mongo.Collection('locations');

Schema.Locations = new SimpleSchema({
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
  timestamp: {
    type: Date,
  },
  affordances: {
    type: Object,
    blackbox: true
  }
});

Locations.attachSchema(Schema.Locations);

Locations.allow({
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
