import { Meteor } from 'meteor/meteor';
import { Experiences } from '../experiences.js';
import { Incidents } from '../../incidents/incidents.js';

Meteor.publish('experiences', function() {
  return Experiences.find();
});

Meteor.publish('experiences.single', function(experienceId) {
  return Experiences.find(experienceId);
});

Meteor.publish('experiences.byIncident', function(incidentId) {
  const incident = Incidents.findOne(incidentId);
  if (incident) {
    return Experiences.find(incident.experienceId);
  } else {
    this.ready();
  }
});