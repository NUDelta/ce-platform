import { Mongo } from "meteor/mongo";
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../schema.js';

Schema.Assignment = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Id,
  },
  needUserMaps: {
    type: [Schema.UserNeedMapping],
    blackbox: true
    //TODO: this shouldn't be blackbox true, figure out why it's not doing its thang
  },
});

export const Assignments = new Mongo.Collection('assignments');
Assignments.attachSchema(Schema.Assignment);
