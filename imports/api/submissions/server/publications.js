import { Meteor } from 'meteor/meteor';
import { Submissions } from '../submissions.js';

Meteor.publish('submissions', function(incidentId) {
  if (incidentId) {
    return Submissions.find({ incidentId: incidentId });
  } else {
    return Submissions.find();
  }
});
