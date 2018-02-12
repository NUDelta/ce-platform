import {Mongo} from "meteor/mongo";
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../schema.js';

Schema.Assignment = new SimpleSchema({
    iid: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    needs: {
        type: [Schema.UserNeedMapping],
    },
});
export const Assignments = new Mongo.Collection('assignments');
Assignments.attachSchema(Schema.Assignment);
