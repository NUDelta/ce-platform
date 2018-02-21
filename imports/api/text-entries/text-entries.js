import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../schema.js';

export const TextEntries = new Mongo.Collection('text_entries');

Schema.TextEntry = new SimpleSchema({
  uid: {
    type: String,
    label: 'Comment submitter',
    regEx: SimpleSchema.RegEx.Id
  },
  text: {
    type: String,
    label: 'Comment content'
  },
  eid: {
    type: String,
    label: 'Comment experience',
    regEx: SimpleSchema.RegEx.Id
  },
  iid: {
    type: String,
    label: 'Incident',
    regEx: SimpleSchema.RegEx.Id
  },
  needName: {
    type: String
  }
});

TextEntries.attachSchema(Schema.TextEntry);
