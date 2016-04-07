import { Meteor } from 'meteor/meteor';
import { Experiences } from '../experiences.js';

Meteor.publish('experiences', function(experienceId) {
  if (experienceId) {
    return Experiences.find({ _id: experienceId });
  } else {
    return Experiences.find();
  }
});
