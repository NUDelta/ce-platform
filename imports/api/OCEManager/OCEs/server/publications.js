// import { Meteor } from 'meteor/meteor';
import { Experiences, Incidents } from '../experiences.js';

Meteor.publish('experiences.all', function () {
  return Experiences.find();
});

Meteor.publish('experiences.single', function (experienceId) {
  return Experiences.find(experienceId);
});

Meteor.publish('experiences.activeUser', function () {
  //console.log('subscribing to OCEs.activeUser');

  if (!this.userId) {
    this.ready();
  } else {
    const user = Meteor.users.findOne(this.userId);

    let experienceIds = Incidents.find({
      _id: { $in: user.activeIncidents() }
    }).fetch().map((x) => {
      return x.eid
    });

    return Experiences.find({
      _id: { $in: experienceIds }
    });
  }
});

Meteor.publish('experiences.pastUser', function () {
  //console.log('subscribing to OCEs.pastUser');

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



Meteor.publish('incidents.all', function () {
  return Incidents.find();
});

Meteor.publish('incidents.single', function (incidentId) {
  return Incidents.find({_id: incidentId});
});

Meteor.publish('incidents.byId', function (incidentId) {
  return Incidents.find({_id: incidentId});
});

Meteor.publish('incidents.activeUser', function () {
  //console.log('subscribing to incidents.activeUser');

  if (!this.userId) {
    this.ready();
  } else {
    const user = Meteor.users.findOne(this.userId);
    return Incidents.find({
      _id: { $in: user.activeIncidents() }
    });
  }
});

Meteor.publish('incidents.pastUser', function () {
  //console.log('subscribing to incidents.pastUser');

  if (!this.userId) {
    this.ready();
  } else {
    const user = Meteor.users.findOne(this.userId);
    return Incidents.find({
      _id: { $in: user.profile.pastIncidents }
    });
  }
});


