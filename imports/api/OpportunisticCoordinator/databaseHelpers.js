import { Mongo } from "meteor/mongo";
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../schema.js';
import {Location_log} from "../Logging/location_log";

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

Schema.UserNeedMapping = new SimpleSchema({
  needName: {
    type: String
  },
  users: {
    // For Availability and Assignments, this object can look like {"uid": uid, "place": place, "distance": distance}
    // For ParticipatingNow, this object looks like {"uid": uid}
    type: [Object],
    defaultValue: [],
    blackbox: true
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
    blackbox: true,
    //TODO: this shouldn't be blackbox true, figure out why it's not doing its thang
  },

});

export const Availability = new Mongo.Collection('availability');
Availability.attachSchema(Schema.Availability);

Schema.ParticipatingNow = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Id,
  },
  needUserMaps: {
    type: [Schema.UserNeedMapping],
    blackbox: true,
    //TODO: this shouldn't be blackbox true, figure out why it's not doing its thang
  },

});

export const ParticipatingNow = new Mongo.Collection('participating_now');
ParticipatingNow.attachSchema(Schema.ParticipatingNow);
