import {Mongo} from "meteor/mongo";
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../schema.js';

Schema.UserNeedMapping = new SimpleSchema({
    needName:{
        type: String
    },
    users :{
        type: [String]
    },
});
export const UserNeedMapping = new Mongo.Collection('userneedmapping');
UserNeedMapping.attachSchema(Schema.UserNeedMapping);


Schema.Availability = new SimpleSchema({
    eid: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    needs: {
        type: [Schema.UserNeedMapping],
    },

});
export const Availability = new Mongo.Collection('availability');
Availability.attachSchema(Schema.Availability);
