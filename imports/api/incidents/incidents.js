import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Schema } from '../schema.js';

class IncidentCollection extends Mongo.Collection {
  remove(selector, callback) {
    Incidents.find(selector).forEach((incident) => {
      Meteor.users.update({}, {
        $pull: {
          'profile.pastIncidents': incident._id
        }
      });
    });
    return super.remove(selector, callback);
  }
}


Schema.SoftStoppingCriteria = new SimpleSchema({
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

export const SoftStoppingCriteria = new IncidentCollection('SoftStoppingCriteria');
SoftStoppingCriteria.attachSchema(Schema.SoftStoppingCriteria);

Schema.SituationNeed = new SimpleSchema({
  name:{
    type: String,
  },
  affordance: {
    type: String,
    optional: true
  },
  contributionTemplate:{
    type: String,
    optional: true
  },
  softStoppingCriteria : {
    type: Schema.SoftStoppingCriteria,
    optional: true
  },
  availableUsers: {
    type: [String],
    defaultValue: [],
    optional: true
  },
  done: {
    type: Boolean,
    defaultValue: false,
    optional: true
  }
});
export const SituationNeed = new IncidentCollection('situationneed');

SituationNeed.attachSchema(Schema.SituationNeed);


export const Incidents = new IncidentCollection('incidents');

Schema.Incident = new SimpleSchema({
  experienceId: {
    type: String,
    label: 'Id of referenced experience',
    regEx: SimpleSchema.RegEx.Id
  },
  name: {
    type: String,
    label: 'Name of referenced experience'
  },
  date: {
    type: String,
    label: 'Date of incident launch'
  },
  data: {
    type: Object,
    label: 'Arbitrary data for custom experiences',
    optional: true,
    blackbox: true
  },
  situationNeeds:{
    type: [Schema.SituationNeed],
    defaultValue: [],
    optional: true,
  }
});

Incidents.attachSchema(Schema.Incident);
