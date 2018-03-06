import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../schema.js';

export const Submissions = new Mongo.Collection('submissions');

Schema.Submission = new SimpleSchema({
  eid: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  iid: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  needName: {
    type: String,
  },
  uid: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    defaultValue: null,
    optional: true,
  },
  content: {
    type: Object,
    blackbox: true,
    optional: true,
    defaultValue: {}
  },
  timestamp: {
    type: Date,
    optional: true,
  },
  lat: {
    type: Number,
    decimal: true,
    min: -90,
    max: 90,
    optional: true,
  },
  lng: {
    type: Number,
    decimal: true,
    min: -180,
    max: 180,
    optional: true,
  }
});

Submissions.attachSchema(Schema.Submission);
