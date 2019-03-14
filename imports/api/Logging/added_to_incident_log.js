import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../schema.js';

export const AddedToIncident_log = new Mongo.Collection('added_to_incident_log');

Schema.AddedToIncident_log = new SimpleSchema({
  uid: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'user id'
  },
  timestamp: {
    type: Date,
  },
  iid: {
    type: String,
  },
  needName: {
    type: String
  }
});

AddedToIncident_log.attachSchema(Schema.AddedToIncident_log);

