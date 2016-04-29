import './admin_locations.html';

import { Template } from 'meteor/templating';
import { GoogleMaps } from 'meteor/dburles:google-maps'; // check this import

import { Locations } from '../../api/locations/locations.js';
import { LocationManager } from '../../api/locations/client/location-manager-client.js';

Template.admin_locations.onCreated(function() {
  this.subscribe('locations');

  GoogleMaps.ready('map', (map) => {

    this.autorun(() => {
      if (this.subscriptionsReady()) {
        Locations.find().forEach((location) => {
          let hi = new google.maps.Marker({
            position: new google.maps.LatLng(location.lat, location.lng),
            map: map.instance
          });
        });
      }
    });
  });
});

Template.admin_locations.helpers({
  mapOptions: () => {
    // let latLng = LocationManager.currentLocation();
    const latLng = { lat: 42, lng: -87 };
    if (GoogleMaps.loaded() && latLng) {
      return {
        center: new google.maps.LatLng(latLng.lat, latLng.lng),
        zoom: 10
      };
    }
  }
});

