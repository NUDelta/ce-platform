import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Schema } from '../../api/schema.js';


Schema.WIPQueue = new SimpleSchema({
  incidentId:{
    type: String,
  }
});

export const WIPQueue = new Mongo.Collection('wipqueue');
WIPQueue.attachSchema(Schema.WIPQueue);
