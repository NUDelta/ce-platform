import { Meteor } from 'meteor/meteor';
import { Locations } from '../locations.js';

Meteor.publish('locations', function () {
  return Locations.find();
});

Meteor.publish('locations.byUser', function (userId) {
  return Locations.find({ uid: userId });

});
