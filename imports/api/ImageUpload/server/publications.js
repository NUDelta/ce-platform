import { Meteor } from 'meteor/meteor';
import { Images } from '../images.js';

Meteor.publish('images.activeIncident', function (incidentId) {
  //console.log('subscribing to ImageUpload.activeIncident', incidentId);
  return Images.find({ iid: incidentId }, { sort: { uploadedAt: 1 } } );
});

Meteor.publish('images.all', function () {
  //console.log('subscribing to ImageUpload.all');
  return Images.find();
});
