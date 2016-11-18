import './admin_locations.html';

import { Template } from 'meteor/templating';
import { GoogleMaps } from 'meteor/dburles:google-maps';
import { _ } from 'meteor/underscore';

import { Locations } from '../../api/locations/locations.js';
import { LocationManager } from '../../api/locations/client/location-manager-client.js';

Template.admin_locations.onCreated(function() {
  const handle = this.subscribe('locations');

  this.markers = [];
  this.plotLocations = () => {
    console.log("Plotting locations...");
    this.markers = [];
    Locations.find().forEach((location) => {
      let icon;
      icon = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(location.lat, location.lng),
        map: this.map,
        icon: icon
      });
      this.markers.push(marker);
    });
  };
  this.doLiveQuery = (locationType, radius) => {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];

    Meteor.call('cerebro.liveQuery',
      { locationType, radius },
      (err, users) => {
        if (err) {
          console.log(err);
          alert(err)
        } else {
          Locations.find().forEach((location) => {
            let icon;
            if (_.contains(users, location.uid)) {
              icon = 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
            } else {
              icon = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
            }
            const marker = new google.maps.Marker({
              position: new google.maps.LatLng(location.lat, location.lng),
              map: this.map,
              icon: icon
            });
            this.markers.push(marker);
          });
        }
      });
  };
  GoogleMaps.ready('map', (map) => {
    this.autorun(() => {
      this.map = map.instance;
      if (handle.ready()) {
        //this.doLiveQuery('restaurants', 200);
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
    
    instance.doLiveQuery(locationType, radius);
  }
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
