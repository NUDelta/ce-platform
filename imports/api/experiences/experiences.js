import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../schema.js';

export const Experiences = new Mongo.Collection('experiences');

Schema.Experience = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  name: {
    type: String,
    label: 'Experience name'
  },
  author: {
    type: String,
    label: 'Author user id',
    regEx: SimpleSchema.RegEx.Id
  },
  description: {
    type: String,
    label: 'Experience description'
  },
  startText: {
    type: String,
    label: 'Experience starting email text'
  },
  modules: {
    type: [String],
    label: 'Integrated collective experience modules',
    allowedValues: Schema.CEModules
  },
  requirements: {
    type: [String],
    label: 'User characteristic requirements',
    allowedValues: Schema.CEQualifications
  },
  location: {
    type: String,
    label: 'Desired location of participants',
    optional: true,
    allowedValues: _.map(Schema.YelpCategories, category => category.alias)
  },
  activeIncident: {
    type: String,
    label: 'The current incident for this experience',
    optional: true
  }
});

Experiences.attachSchema(Schema.Experience);
