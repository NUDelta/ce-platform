import { Meteor } from 'meteor/meteor';
import { toggleLocationTracking } from "./location_tracking";

Meteor.methods({
  toggleTracking() {
       toggleLocationTracking();
  }
});