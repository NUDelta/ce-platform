import './admin_locations.html';

import { Template } from 'meteor/templating';
import { GoogleMaps } from 'meteor/dburles:google-maps';

import { Locations } from '../../api/locations/locations.js';
import { LocationManager } from '../../api/locations/client/location-manager-client.js';

Template.admin_locations.onCreated(function() {
  const handle = this.subscribe('locations');

  GoogleMaps.ready('map', (map) => {
    this.autorun(() => {
      if (handle.ready()) {
        Locations.find().forEach((location) => {
          const marker = new google.maps.Marker({
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
    let latLng = LocationManager.currentLocation();
    if (GoogleMaps.loaded() && latLng) {
      return {
        center: new google.maps.LatLng(latLng.lat, latLng.lng),
        zoom: 17
      };
    }
  }
});
