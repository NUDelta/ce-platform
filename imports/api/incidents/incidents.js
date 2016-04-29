import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../schema.js';

export const Incidents = new Mongo.Collection('incidents');

Incidents.attachSchema(new SimpleSchema({
  experience: {
    type: String,
    label: 'Id of referenced experience',
    regEx: SimpleSchema.RegEx.Id
  },
  name: {
    type: String,
    label: 'Name of referenced experience'
  },
  date: {
    type: String,
    label: 'Date of incident launch'
  },
  launcher: {
    type: String,
    label: 'Launcher user id',
    regEx: SimpleSchema.RegEx.Id
  },
  latestSubmission: {
    type: String,
    label: 'Submission id of latest submission',
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  }
}));
