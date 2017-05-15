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
  content: {
    type: Object, //Dictionary (ids of contributions)
    blackbox: true
  }
});

Submissions.attachSchema(Schema.Submission);
