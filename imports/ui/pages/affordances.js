import './affordances.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Locations } from '../../api/locations/locations.js';
import { GoogleMaps } from 'meteor/dburles:google-maps';

Template.affordances.onCreated(function () {

  GoogleMaps.ready('yourLocation', function (map) {
    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
  });

});

Template.affordances.helpers({
  affordances() {
    var location = Locations.findOne({ uid: Meteor.userId() })
    return location.affordances
  },
  location() {
    var location = Locations.findOne({ uid: Meteor.userId() })
    return location.lat + " / " + location.lng
  },
  mapOptions() {
    var location = Locations.findOne({ uid: Meteor.userId() })

    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(location.lat, location.lng),
        zoom: 18
      };
    }
  },
  affordanceKeys() {
    dict = this.location.affordances
    var keys = Object.keys(dict)
    return keys
  },
  affordanceValues(key){
    return this.location.affordances[key]
  }
});
