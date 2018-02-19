import { Meteor } from 'meteor/meteor';
import { Images } from '../images.js';

Meteor.publish('images.activeIncident', function (incidentId) {
  console.log('subscribing to images.activeIncident', incidentId);
  return Images.find({ iid: incidentId });
});
