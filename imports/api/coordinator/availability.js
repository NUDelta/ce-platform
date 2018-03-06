import { Mongo } from "meteor/mongo";
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../schema.js';

Schema.UserNeedMapping = new SimpleSchema({
  needName: {
    type: String
  },
  uids: {
    type: [String],
    defaultValue: []
  },
});
export const UserNeedMapping = new Mongo.Collection('userneedmapping');
UserNeedMapping.attachSchema(Schema.UserNeedMapping);

Schema.Availability = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Id,
  },
  needUserMaps: {
    type: [Schema.UserNeedMapping],
  },

});
export const Availability = new Mongo.Collection('availability');
Availability.attachSchema(Schema.Availability);
