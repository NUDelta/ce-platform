import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';
import { Incidents } from './incidents.js';
import { Experiences } from '../experiences/experiences.js';

export const insertIncident = new ValidatedMethod({
  name: 'incidents.insertIncident',
  validate: new SimpleSchema({
    name: {
      type: String,
    },
    experience: {
      type: String,
    },
    launcher: {
      type: String,
    }
  }).validator(),
  run({ name, experience, launcher }) {
    return Incidents.insert({
      date: Date.parse(new Date()),
      name: name,
      experience: experience,
      launcher: launcher,
    }, function(error, id) {
      if (error) {
        console.log(error);
      }
      else {
        console.log("inserting incident");
        Experiences.update({_id: experience}, {$set: {'activeIncident': id}});
        console.log(Experiences.findOne(experience));
      }
    });
  }
});
