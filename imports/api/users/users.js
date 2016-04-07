import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';
import { Schema } from '../schema.js';

let qualifications = {};
Schema.CEQualifications.forEach((allowed) => {
  qualifications[allowed] = {
    type: Boolean,
    label: allowed
  }
});

Schema.Qualification = new SimpleSchema(qualifications);

Schema.Profile = new SimpleSchema({
  experiences: {
    type: [String],
    label: 'Eligible experiences',
    regEx: SimpleSchema.RegEx.Id // leaing out for test cases
  },
  subscriptions: {
    type: [String],
    label: 'Subscribed experiences',
    regEx: SimpleSchema.RegEx.Id // leaing out for test cases
  },
  qualifications: {
    type: Schema.Qualification,
    label: 'User qualifications',
  },
  activeExperience: {
    type: String,
    label: 'Active experience',
    optional: true
  }
});

Schema.User = new SimpleSchema({
  username: {
    type: String,
    optional: true
  },
  emails: {
      type: Array,
  },
  "emails.$": {
      type: Object
  },
  "emails.$.address": {
      type: String,
      regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
      type: Boolean
  },
  createdAt: {
      type: Date,
      optional: true
  },
  services: {
      type: Object,
      optional: true,
      blackbox: true
  },
  profile: {
    type: Schema.Profile
  },
  // In order to avoid an 'Exception in setInterval callback' from Meteor
  heartbeat: {
      type: Date,
      optional: true
  }
});

Meteor.users.attachSchema(Schema.User);
