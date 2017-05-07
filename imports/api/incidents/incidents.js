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



Schema.SituationNeed = new SimpleSchema({
  name:{
    type: String
  },
  affordance: {
    type: String,
    optional: true
  },
  contributionTemplate:{
    type: String
  },
  softStoppingCriteria : {
    type: Schema.StoppingCritera,
    optional: true
  },
  availableUsers: {
    type: [String],
    defaultValue: []
  },
  done: {
    type: Boolean,
    defaultValue: false
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
    type: [Schema.SitutationNeed],
    defaultValue: [],
    optional: true,
  }
});

Incidents.attachSchema(Schema.Incident);
