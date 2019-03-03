import './affordances.html';

import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Template } from 'meteor/templating';

import { Locations } from '../../api/UserMonitor/locations/locations.js';
import { GoogleMaps } from 'meteor/dburles:google-maps';

Template.affordances.onCreated(function () {

  GoogleMaps.ready('yourLocation', function (map) {
    let marker;

    // Create and move the marker when latLng changes.
    Tracker.autorun(function() {
      if (!this.location)
        return;

      // If the marker doesn't yet exist, create it.
      if (!marker) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(this.location.lat, this.location.lng),
          map: map.instance
        });
      }
      // The marker already exists, so we'll just change its position.
      else {
        marker.setPosition({'lat': this.location.lat, 'lng': this.location.lng});
      }

      // Center the map view onto the current position.
      map.instance.setCenter(marker.getPosition());
    });
  });

});

Template.affordances.events({

  'click #toggle-affordance-info': function() {
    var affordanceInfo = document.getElementById('affordance-info');

    if (affordanceInfo.style.display == "block") {
      affordanceInfo.style.display = "none";
    } else {
      affordanceInfo.style.display = "block";
    }
  }

});

Template.affordances.helpers({
  mapOptions() {
    let location = this.location
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(location.lat, location.lng),
        zoom: 18
      };
    }
  },
  timeSinceLastLocation() {
    let timediff_seconds = Math.floor((Date.now() - this.location.time) / 1000);
    // 1 minute
    if (timediff_seconds < 60) {
      return timediff_seconds + " seconds";
    }
    // 60 minutes
    else if (timediff_seconds < 3600) {
      let timediff_min = Math.floor(timediff_seconds / 60);
      return timediff_min + " minutes";
    }
    // 24 hours
    else if (timediff_seconds < 86400) {
      let timediff_hour = Math.floor(timediff_seconds / (3600));
      return timediff_hour + " hours";
    } else {
      let timediff_days = Math.floor(timediff_seconds / (86400));
      return timediff_days + " days";
    }
  },
  affordanceKeys() {
    let dict = this.location.affordances;
    let keys = Object.keys(dict);
    return keys
  },
  affordanceValues(key){
    return this.location.affordances[key]
  }
});
