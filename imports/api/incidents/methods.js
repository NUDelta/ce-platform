import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

import { Incidents } from './incidents.js';
import { Experiences } from '../experiences/experiences.js';
import { Schema } from '../schema.js';
import { log } from '../logs.js';

export const activateNewIncident = new ValidatedMethod({
  name: 'incidents.activateNew',
  validate: new SimpleSchema({
    name: {
      type: String
    },
    experienceId: {
      type: String
    },
    launcher: {
      type: String
    }
  }).validator(),
  run({ name, experienceId, launcher }) {
    const incidentId = Incidents.insert({
      date: Date.parse(new Date()),
      name: name,
      experience: experienceId,
      launcher: launcher
    });
    Experiences.update(experienceId, { $set: { activeIncident: incidentId } });
    return incidentId;
  }
});

