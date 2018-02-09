import { Meteor } from 'meteor/meteor';
import { affinderDb } from 'publications.js'

Meteor.methods({
  detectorsFind: function() {
    return affinderDb.open('Detectors').find().count();
  }
});