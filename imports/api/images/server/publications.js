import { Meteor } from 'meteor/meteor';
import { Images } from '../images.js';

Meteor.publish('images', function(incidentId) {
  if (incidentId) {
    return Images.find({ incident: incidentId });
  } else {
    return Images.find();
  }
});
