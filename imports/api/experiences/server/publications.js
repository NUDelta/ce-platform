import { Meteor } from 'meteor/meteor';
import { Experiences } from '../experiences.js';
import { Incidents } from '../../incidents/incidents.js';

Meteor.publish('experiences.all', function () {
  return Experiences.find();
});

Meteor.publish('experiences.single', function (experienceId) {
  return Experiences.find(experienceId);
});

Meteor.publish('experiences.activeUser', function () {
  //console.log('subscribing to experiences.activeUser');

  if (!this.userId) {
    this.ready();
  } else {
    const user = Meteor.users.findOne(this.userId);

    let experienceIds = Incidents.find({
      _id: { $in: user.profile.activeIncidents }
    }).fetch().map((x) => {
      return x.eid
    });

    return Experiences.find({
      _id: { $in: experienceIds }
    });
  }
});

Meteor.publish('experiences.pastUser', function () {
  //console.log('subscribing to experiences.pastUser');

  if (!this.userId) {
    this.ready();
  } else {
    const user = Meteor.users.findOne(this.userId);

    let experienceIds = Incidents.find({
      _id: { $in: user.profile.pastIncidents }
    }).fetch().map((x) => {
      return x.eid
    });

    return Experiences.find({
      _id: { $in: experienceIds }
    });
  }
});

Meteor.publish('experiences.byIncident', function (incidentId) {
  const incident = Incidents.findOne(incidentId);
  if (incident) {
    return Experiences.find(incident.experienceId);
  } else {
    this.ready();
  }
});

Meteor.publish('experiences.byRoute', function (route) {
  return Experiences.find({ route: route });
});
