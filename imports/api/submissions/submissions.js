import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../schema.js';

export const Submissions = new Mongo.Collection('submissions');

Schema.Submission = new SimpleSchema({
  submitter: {
    type: String,
    label: 'Comment submitter',
    regEx: SimpleSchema.RegEx.Id
  },
  experienceId: {
    type: String,
    label: 'Comment experience',
    regEx: SimpleSchema.RegEx.Id
  },
  incidentId: {
    type: String,
    label: 'Incident',
    regEx: SimpleSchema.RegEx.Id
  },
  situationNeed: {
    type: String,
    label: 'name of the situationNeed',
  },
  contributionTemplate: {
     type: String,
    label: 'name of the contributionTemplate',
  },
  content: {
    type: Object, //Dictionary (ids of contributions)
    blackbox: true
  },
  timestamp: {
    type: Number,
    optional: true
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

Submissions.attachSchema(Schema.Submission);
