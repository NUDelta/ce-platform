import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';
import { Incidents } from './incidents.js';

Meteor.methods({
  insertIncident: function(name, experienceId, launcher) {
    Incidents.insert({
      date: Date.parse(new Date()),
      name: name,
      experience: experienceId,
      launcher: launcher,
    });
  }
});
