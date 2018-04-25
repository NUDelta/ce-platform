import { Meteor } from 'meteor/meteor';
import { Incidents } from '../incidents.js';

Meteor.publish('incidents.all', function () {
  return Incidents.find();
});

Meteor.publish('incidents.single', function (incidentId) {
  return Incidents.find(incidentId);
});

Meteor.publish('incidents.byId', function (incidentId) {
  return Incidents.find(incidentId);
});

Meteor.publish('incidents.activeUser', function () {
  //console.log('subscribing to incidents.activeUser');

  if (!this.userId) {
    this.ready();
  } else {
    const user = Meteor.users.findOne(this.userId);
    return Incidents.find({
      _id: { $in: user.profile.activeIncidents }
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

