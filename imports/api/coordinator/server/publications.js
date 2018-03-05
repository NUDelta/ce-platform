import { Meteor } from 'meteor/meteor';
import { Assignments } from "../assignments";
import {Availability} from "../availability";
import {Notification_log} from "../notification_log";

Meteor.publish('assignments.all', function () {
  return Assignments.find();
});

Meteor.publish('availability.all', function () {
  return Availability.find();
});

Meteor.publish('assignments.single', function (assignmentId) {
  return Assignments.find(assignmentId);
});

Meteor.publish('assignments.activeUser', function () {
  //console.log('subscribing to assignments.activeUser');

  if (!this.userId) {
    this.ready();
  } else {
    return Assignments.find({
      'needUserMaps': {
        '$elemMatch': {
          'uids': this.userId
        }
      }
    });
  }
});


Meteor.publish('notification_log.activeIncident', function (iid) {
  return Notification_log.find({iid: iid});
});
