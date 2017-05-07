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

Schema.StoppingCritera = new SimpleSchema({
  total:{
    type: Number,
    optional: true
  },
  time: {
    type: String,
    optional: true
  },
  complete_instances:{
    type: Number,
    optional: true
  }
});

export const StoppingCritera = new ExperiencesCollection('stoppingcritera');
StoppingCritera.attachSchema(Schema.StoppingCritera);


Schema.SituationalNeedTemplate = new SimpleSchema({
  name:{
    type: String
  },
  contributions:{
    type: [String]
  },
  affordance: {
    type: String,
    optional: true
  }
});

export const SituationalNeedTemplate = new ExperiencesCollection('situationalneedtemplate');
SituationalNeedTemplate.attachSchema(Schema.SituationalNeedTemplate);

Schema.NeedGroup = new SimpleSchema({
  needTypes:{
    type: [Schema.SituationalNeedTemplate],
  },
  stopping_criteria: {
    type: Schema.StoppingCritera
  }
});

export const NeedGroup = new ExperiencesCollection('needgroup');
NeedGroup.attachSchema(Schema.NeedGroup);

Schema.Partition = new SimpleSchema({
  name:{
    type: String
  },
  description: {
    type:String,
    optional: true
  },
  affordance: {
    type: String,
    optional: true
  },
  available_users: {
    type: [String],
    optional: true
  },
  max: {
    type: Number,
    optional: true
  }
});

export const Partitions = new ExperiencesCollection('partitions');
Partitions.attachSchema(Schema.Parition);


export const Experiences = new ExperiencesCollection('experiences');

Schema.Experience = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  name: {
    type: String,
    label: 'Experience name',
  },
  author: {
    type: String,
    label: 'Author user id',
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  description: {
    type: String,
    label: 'Experience description',
    optional: true

  },
  startText: {
    type: String,
    label: 'Experience starting email text',
    optional: true

  },
  modules: {
    type: [String],
    label: 'Integrated collective experience modules',
    allowedValues: Schema.CEModules,
    optional: true

  },
  requirements: {
    type: [String],
    label: 'User characteristic requirements',
    allowedValues: Schema.CEQualifications,
    optional: true

  },
  /**location: {
    type: String,
    label: 'Desired location of participants',
    optional: true,
    allowedValues: _.map(Schema.YelpCategories, category => category.alias)
  },**/
  affordance: {
    type: String,
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
    //defaultValue: 120
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
  },
  // participate_template: {
  //   type: String,
  //   optional: true
  // },
  // results_template: {
  //   type: String,
  //   optional: true
  // },
  // parts:{
  //   type: [Schema.Partition],
  //   optional: true
  // },
//   turns: {  type: Array   }
// "turns.$": { type: Array }
// "turns.$.$": { type: Object }
// "turns.$.$.user_id": { type: String }

  needGroups: {
    type: [Schema.NeedGroup], //Array, //[[Schema.SituationalNeed]],
    optional: true, //TODO:
    //blackbox: true
  },
  // "situation_groups.$":{
  //   type: Array,
  //   optional:true
  // },
  // "situation_groups.$.$":{
  //   type: Object,
  //   optional:true
  // },
  // "situation_groups.$.$.name":{
  //   type: String,
  // },
  // "situation_groups.$.$.contributions":{
  //   type: [String]
  // },
  // "situation_groups.$.$.affordance": {
  //   type: String,
  //   optional: true
  // },
  // "situation_groups.$.$.stopping_criteria": {
  //   type: Schema.StoppingCritera,
  //   optional: true,
  // },
  notificationText : {
    type: String,
    optional: true
  }
  /*
   * start condition
   * end condition
   * schedule
   */
});




Experiences.attachSchema(Schema.Experience);
