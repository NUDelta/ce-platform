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
  }
  // complete_instances:{
  //   type: Number,
  //   optional: true
  // }
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
  completionCallback:{
    type: String,
    optional: true
  }
});

export const SituationalNeedTemplate = new ExperiencesCollection('situationalneedtemplate');
SituationalNeedTemplate.attachSchema(Schema.SituationalNeedTemplate);


Schema.ContributionGroup = new SimpleSchema({
  contributionTemplates:{
    type: [Schema.SituationalNeedTemplate],
  },
  stopping_criteria: {
    type: Schema.StoppingCritera
  }
});

export const ContributionGroup = new ExperiencesCollection('contributiongroup');
ContributionGroup.attachSchema(Schema.ContributionGroup);


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
  participateTemplate: {
    type: String,
  },
  resultsTemplate: {
    type: String,
  },
  contributionGroups: {
    type: [Schema.ContributionGroup], //Array, //[[Schema.SituationalNeed]],
    optional: true, //TODO:
    //blackbox: true
  },
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
