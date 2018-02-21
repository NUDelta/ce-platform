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
    type: [Schema.NeedType],
    blackbox: true
  },
  callbacks: {
    type: [Schema.Callback],
    optional: true,
    blackbox: true
    //TODO: i think somehow its not finding the schema bc in experiences where its define no problem, but here need blackbox true
  },
});
Incidents.attachSchema(Schema.Incident);