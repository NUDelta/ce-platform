import { Meteor } from 'meteor/meteor';
import { Submissions } from '../submissions.js';

Meteor.publish('submissions.activeIncident', function (incidentId) {
  //console.log('subscribing to submissions.activeIncident', incidentId);
  return Submissions.find({ iid: incidentId });
});

Meteor.publish('submissions.activeUser', function () {
  //console.log('subscribing to submissions.activeUser');
  return Submissions.find({ uid: this.userId });
});

Meteor.publish('submissions.all', function () {
  //console.log('subscribing to submissions.all');
  return Submissions.find();
});
