import { Meteor } from 'meteor/meteor';
import { Submissions } from '../submissions.js';

Meteor.publish('submissions.activeIncident', function (incidentId) {
  //console.log('subscribing to submissions.activeIncident', incidentId);
  return Submissions.find(
    { iid: incidentId},
    {
      sort: { timestamp: 1 }
    });
});

Meteor.publish('submissions.activeUser', function () {
  //console.log('subscribing to submissions.activeUser');
  return Submissions.find(
    { uid: this.userId },
    {
      sort: { timestamp: 1 }
    });
});

Meteor.publish('submissions.all', function () {
  //console.log('subscribing to submissions.all');
  return Submissions.find(
    {},
    {
      sort: { timestamp: 1 }
    });
});
