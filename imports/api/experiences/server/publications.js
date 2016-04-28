import { Meteor } from 'meteor/meteor';
import { Experiences } from '../experiences.js';

Meteor.publish('experiences', function() {
  return Experiences.find();
});

Meteor.publish('experiences.single', function(experienceId) {
  return Experiences.find(experienceId);
});
