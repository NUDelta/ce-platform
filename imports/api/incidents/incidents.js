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

Schema.SituationalNeedInstance = new SimpleSchema({
  id: {
    type: String
  },
  affordance: {
    type: String,
    optional: true
  },
  stopping_criteria : {
    type: Schema.StoppingCritera,
    optional: true
  }
});

export const SituationalNeedInstance = new IncidentCollection('situationalneedinstance');
SituationalNeedInstance.attachSchema(Schema.SituationalNeedInstance);

Schema.IncidentPartition = new SimpleSchema({
  name:{
    type: String
  },
  users: {
    type: [String],
    optional: true
  }
});
export const IncidentPartitions = new IncidentCollection('incidentPartition');

IncidentPartitions.attachSchema(Schema.IncidentPartition);

Schema.NeedInstancesWithUsers = new SimpleSchema({
  situational_need_name:{
    type: String
  },
  id: {
    type: String
  },
  affordance: {
    type: String,
    optional: true
  },
  stopping_criteria : {
    type: Schema.StoppingCritera,
    optional: true
  },
  users: {
    type: [String],
    optional: true
  }
});
export const NeedInstancesWithUsers = new IncidentCollection('needinstanceswithusers');

NeedInstancesWithUsers.attachSchema(Schema.NeedInstancesWithUsers);



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
  userMappings:{
    type: [Schema.IncidentPartition],
    optional: true,
    blackbox: true
  },
  users_need_mapping: {
    type: [Schema.NeedInstancesWithUsers],
    optional: true
  },


  // "partitioned_users.$": {
  //     type: Object
  // },
  // to_do: {
  //   type: [Schema.IncidentPartition],
  //   optional: true
  // }
});

Incidents.attachSchema(Schema.Incident);
