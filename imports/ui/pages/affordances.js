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
  mapOptions() {
    let location = this.location
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(location.lat, location.lng),
        zoom: 18
      };
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
