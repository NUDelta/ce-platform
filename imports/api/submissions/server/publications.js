import { Meteor } from 'meteor/meteor';
import { Submissions } from '../submissions.js';

Meteor.publish('submissions', function(incidentId) {
    return Submissions.find({ incidentId: incidentId });
});
