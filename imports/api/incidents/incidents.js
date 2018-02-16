import { Mongo } from "meteor/mongo";
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../schema.js';

export const Incidents = new Mongo.Collection('incidents');
Schema.Incident = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  eid: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  contributionTypes: {
    type: [Schema.ContributionTypes],
    blackbox: true
  },
  callbacks: {
    type: [Schema.Callback],
    optional: true
  },
});
Incidents.attachSchema(Schema.Incident);