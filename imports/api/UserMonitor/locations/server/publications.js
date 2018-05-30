import { Meteor } from 'meteor/meteor';
import { Locations } from '../locations.js';

Meteor.publish('locations.all', function () {
  return Locations.find();
});

Meteor.publish('locations.activeUser', function () {
  //console.log('subscribing to locations.activeUser');
  return Locations.find({ uid: this.userId });

});
