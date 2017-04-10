import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Incidents } from '../incidents/incidents.js';
import { Schema } from '../schema.js';
import { Locations } from '../locations/locations.js';

// TODO: cascade delete incidents and remove from active, etc.
class ExperiencesCollection extends Mongo.Collection {
  remove(selector, callback) {
    Experiences.find(selector).forEach((experience) => {
      Incidents.remove({ experience: experience._id });
      Meteor.users.update({}, {
        $pull: {
          'profile.activeExperiences': experience._id
        }
      });
    });
    return super.remove(selector, callback);
  }
}

export const Experiences = new ExperiencesCollection('experiences');

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
  /**location: {
    type: String,
    label: 'Desired location of participants',
    optional: true,
    allowedValues: _.map(Schema.YelpCategories, category => category.alias)
  },**/
  affordance: {
    type: [String],
    label: 'Affordances of the experience',
    optional: true
  },
  available_users:{
    type: [String],
    label: 'Users ids for those who can participate',
    optional: true
  },
  activeIncident: {
    type: String,
    label: 'The current incident for this experience',
    optional: true
  },
  duration: {
    type: Number,
    label: 'The duration this experience will run, in minutes',
    optional: true,
    defaultValue: 120
  },
  /*radius: {
    type: Number,
    label: 'The estimated size of the location / radius around which to look for people',
    optional: true
  },**/
  optIn: {
    type: Boolean,
    label: 'Subscription model of the experience',
    optional: true
  },
  route: {
    type: String,
    label: 'Route to use in place of experience ID',
    optional: true
  },
  custom_notification: {
    type: String,
    label: 'Notification function to be used instead of default',
    optional: true
  }
  /*
   * start condition
   * end condition
   * schedule
   */
});

Experiences.attachSchema(Schema.Experience);
