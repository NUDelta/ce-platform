import { Meteor } from 'meteor/meteor';
import { Experiences } from '../experiences.js';
import { Incidents } from '../../incidents/incidents.js';

Meteor.publish('experiences', function() {
  return Experiences.find();
});

Meteor.publish('experiences.single', function(experienceId) {
  return Experiences.find(experienceId);
});

Meteor.publish('experiences.activeUser', function(render) {
  console.log("subscribing")
  if (!this.userId) {
    this.ready();
  } else {
    const user = Meteor.users.findOne(this.userId);
    return Experiences.find({
      _id: { $in: user.profile.activeExperiences }
    });
  }
});

Meteor.publish('experiences.byIncident', function(incidentId) {
  const incident = Incidents.findOne(incidentId);
  if (incident) {
    return Experiences.find(incident.experienceId);
  } else {
    this.ready();
  }
});

Meteor.publish('experiences.byRoute', function(route) {
  return Experiences.find({route: route});
})
