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
    default: []
  },
  done: {
    type: Boolean,
    default: false
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
  launcher: {
    type: String,
    label: 'Launcher user id',
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  latestSubmission: {
    type: String,
    label: 'Submission id of latest submission',
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  data: {
    type: Object,
    label: 'Arbitrary data for custom experiences',
    optional: true,
    blackbox: true
  },
  situationNeeds:{
    type: [Schema.SitutaionNeed],
    optional: true,
  }
});

Incidents.attachSchema(Schema.Incident);
