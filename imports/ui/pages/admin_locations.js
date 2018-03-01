import './admin_locations.html';

import { Template } from 'meteor/templating';
import { GoogleMaps } from 'meteor/dburles:google-maps';

import { Locations } from '../../api/locations/locations.js';
import { Users } from '../../api/users/users.js';

Template.admin_locations.onCreated(function () {
  const handle = this.subscribe('locations');
  this.subscribe('detectors');
  this.markers = [];

  this.plotLocations = () => {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
    Locations.find().forEach((location) => {
      const icon = {
        url: 'https://maps.google.com/mapfiles/ms/icons/red.png',
        scaledSize: new google.maps.Size(50, 50),
        labelOrigin: new google.maps.Size(50, 50)
      };

      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(location.lat, location.lng),
        label: {
          text: location.uid.slice(0, 3),
          color: '#fff',
          fontSize: '12px',
        },
        map: this.map,
        //icon: icon
      });

      this.markers.push(marker);
    });
  };

  GoogleMaps.ready('map', (map) => {
    this.autorun(() => {
      this.map = map.instance;
      if (handle.ready()) {
        this.plotLocations();
      }
    });
  });
});

Template.admin_locations.events({
  'submit form'(event, instance) {
    event.preventDefault();
    const locationType = event.target.locationType.value;
    const radius = parseInt(event.target.radius.value);
  }
});

Template.admin_locations.helpers({
  mapOptions: () => {
    if (GoogleMaps.loaded()) {
      let latLng = LocationManager.currentLocation();
      return {
        center: { lat: 42.059311, lng: -87.676318 },
        zoom: 15
      };
    }
  }
});
