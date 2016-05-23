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
