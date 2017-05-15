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

Schema.StoppingCriteria = new SimpleSchema({
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

export const StoppingCriteria = new ExperiencesCollection('stoppingCriteria');
StoppingCriteria.attachSchema(Schema.StoppingCriteria);


Schema.SituationalNeedTemplate = new SimpleSchema({
  name:{
    type: String
  },
  contributions:{
    type: Object, //{String: String}
    blackbox: true
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
  stoppingCriteria: {
    type: Schema.StoppingCriteria
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
  description: {
    type: String,
    label: 'Experience description',
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
    //blackbox: true
  },
  notificationText : {
    type: String,
    optional: true
  }
});


Experiences.attachSchema(Schema.Experience);
