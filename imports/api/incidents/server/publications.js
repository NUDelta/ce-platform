import { Meteor } from 'meteor/meteor';
import { Incidents } from '../incidents.js';

Meteor.publish('incidents', function() {
  return Incidents.find();
});
