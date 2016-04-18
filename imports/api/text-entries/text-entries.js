import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../schema.js';

export const TextEntries = new Mongo.Collection('text_entries');

Schema.TextEntry = new SimpleSchema({
  submitter: {
    type: String,
    label: 'Comment submitter',
    regEx: SimpleSchema.RegEx.Id
  },
  text: {
    type: String,
    label: 'Comment content'
  },
  experience: {
    type: String,
    label: 'Comment experience',
    regEx: SimpleSchema.RegEx.Id
  },
  incident: {
    type: String,
    label: 'Incident'
  },
  lat: {
    type: String,
    label: 'Latitude'
  },
  lng: {
    type: String,
    label: 'Longitude'
  },
  location: {
    type: String,
    label: 'Submission location'
  }
});

TextEntries.attachSchema(Schema.TextEntry);
