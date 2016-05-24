import { Meteor } from 'meteor/meteor';

import { Incidents } from '../incidents.js';
import { Experiences } from '../../experiences/experiences.js';

Meteor.publish('incidents', function() {
  return Incidents.find();
});

Meteor.publish('incidents.byExperience', function(experienceId) {
  const experience = Experiences.findOne(experienceId);
  if (experience) {
    return Incidents.find(experience.activeIncident);
  } else {
    this.ready();
  }
});

Meteor.publish('incidents.byId', function(incidentId) {
  return Incidents.find(incidentId);
});

Meteor.publish('incidents.byUser', function() {
  if (!this.userId) {
    this.ready();
  } else {
    const user = Meteor.users.findOne(this.userId);
    return Incidents.find({
      _id: { $in: user.profile.pastIncidents }
    });
  }
});
