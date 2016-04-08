import './layout.html';

import { Template } from 'meteor/templating';
import { LocationManager } from 'meteor/collectiveexperiences:location-engine';

Template.layout.onRendered(function() {
  function addTransform(location) {
    return location;
  }
  function changeLocation(loc, updated) {
  }
  LocationManager.trackUpdates(this, addTransform, changeLocation);
});
