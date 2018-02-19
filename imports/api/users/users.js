import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';
import { Schema } from '../schema.js';

// Schema.Profile = new SimpleSchema({
//   activeIncidents: {
//     type: [String],
//     label: 'Active incidents',
//     defaultValue: [],
//   },
//   pastIncidents: {
//     type: [String],
//     label: 'Previous incidents the user was notified of',
//     defaultValue: [],
//   },
//   lastParticipated: {
//     type: Date,
//     defaultValue: null,
//     optional: true
//   },
//   lastNotified: {
//     type: Date,
//     defaultValue: null,
//     optional: true
//   },
// });

// Schema.User = new SimpleSchema({
//   username: {
//     type: String,
//     optional: true
//   },
//   emails: {
//     type: Array,
//   },
//   "emails.$": {
//     type: Object
//   },
//   "emails.$.address": {
//     type: String,
//     regEx: SimpleSchema.RegEx.Email
//   },
//   "emails.$.verified": {
//     type: Boolean
//   },
//   createdAt: {
//     type: Date,
//     optional: true
//   },
//   profile: {
//     type: Schema.Profile
//   }
// });
//
// Meteor.users.attachSchema(Schema.User);
