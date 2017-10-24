import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

import { Incidents } from './incidents.js';
import { Experiences } from '../experiences/experiences.js';
import { Schema } from '../schema.js';
import { log } from '../logs.js';

export const createIncident = new ValidatedMethod({
  name: 'api.createIncident',
  validate: new SimpleSchema({
    experienceId: {
      type: String
    }
  }).validator(),
  run({experienceId}) {
    var experience = Experiences.findOne({_id:experienceId});
    const incidentId = Incidents.insert({
      date: Date.parse(new Date()),
      name: experience.name,
      experienceId: experience._id
    }
    );
    Experiences.update( experience._id, { $set: { activeIncident: incidentId } });
    return incidentId;
  }
});

export const addSituationNeeds = new ValidatedMethod({
  name: 'api.addSituationNeeds',
  validate: new SimpleSchema({
    incidentId:{
      type: String
    },
    need:{
      type: Schema.SituationNeed
    }
  }).validator(),
  run({incidentId, need}){
    var res = Incidents.update({_id: incidentId},
      {$push: { situationNeeds: {
        name:need.name,
        affordance: need.affordance,
        contributionTemplate:need.contributionTemplate,
        softStoppingCriteria:need.softStoppingCriteria,
        notifiedUsers: [],
        done: false
        }
      }
    });
    return res;
  }
});

// METHODS FOR BUTTON GAME
export const startButtonGame = new ValidatedMethod({
  name: 'incidents.startButtonGame',
  validate: new SimpleSchema({
    incidentId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),
  run({ incidentId }) {
    let data = Incidents.findOne(incidentId).data;

  }
});

export const clickButton = new ValidatedMethod({
  name: 'incidents.clickButton',
  validate: new SimpleSchema({
    incidentId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),
  run({ incidentId }) {
    let now = Date.parse(new Date());
    let pressers = Incidents.findOne({_id: incidentId}).data.pressers;
    if (pressers.indexOf(Meteor.userId()) === -1) {
      Incidents.update({_id: incidentId}, {$set: {'data.time': now}});
      Incidents.update({_id: incidentId}, {$push: {'data.pressers': Meteor.userId()}});
    }
  }
})
