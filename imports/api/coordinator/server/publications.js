import { Meteor } from 'meteor/meteor';
import { Assignments } from "../assignments";

Meteor.publish('assignments', function() {
  return Assignments.find();
});

Meteor.publish('assignments.single', function(assignmentId) {
  return Assignments.find(assignmentId);
});

Meteor.publish('assignments.activeUser', function() {
  console.log('subscribing to assignments.activeUser');

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
