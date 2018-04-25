import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../schema.js';

export const Page_log = new Mongo.Collection('page_log');

Schema.Page_log = new SimpleSchema({
  uid: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'user id'
  },
  timestamp: {
    type: Date,
  },
  route: {
    type: String,
  },
  params: {
    type: Object,
    blackbox: true
  }
});

Page_log.attachSchema(Schema.Page_log);

