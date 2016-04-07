import { Meteor } from 'meteor/meteor';
import { Images } from '../images.js';

Meteor.publish('images', function(experienceId) {
  if (experienceId) {
    return Images.find({ experience: experienceId });
  } else {
    return Images.find();
  }
});
