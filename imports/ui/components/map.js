import './map.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';
import { GoogleMaps } from 'meteor/dburles:google-maps';
import { ParticipationLocations } from '../../api/participation-locations/participation_locations.js';
import { LocationManager } from '../../api/locations/client/location-manager-client.js';

Template.map.onCreated(function() {
  this.subscribe('participation_locations');

  GoogleMaps.ready('map', function(map) {
    // google.maps.event.addListener(map.instance, 'click', function(event) {
    //   ParticipationLocations.insert({ lat: event.latLng.lat(), lng: event.latLng.lng()});
    // });

    let activeIncident = Session.get('incidentId');

    ParticipationLocations.find({incidentId: activeIncident}).forEach(function(entry) {
      var marker = new google.maps.Marker({
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(entry.lat, entry.lng),
        map: map.instance
      });
    });

    ParticipationLocations.find({incidentId: activeIncident}).observeChanges({
      added: function(document) {
        // Create a marker for this document
        let insertedMarker = ParticipationLocations.findOne({_id: document});
        var marker = new google.maps.Marker({
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(insertedMarker.lat, insertedMarker.lng),
          map: map.instance
        });
      }
    });
  });
});

Template.map.helpers({
  mapOptions: function() {
    let loc = LocationManager.currentLocation();

    if (loc == null) {
      loc = {lat: 42, lng: -87};
    }

    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(loc.lat, loc.lng),
        zoom: 3
      };
    }
  }
});
