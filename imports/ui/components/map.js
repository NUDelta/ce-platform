import './map.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';
import { GoogleMaps } from 'meteor/dburles:google-maps';
import { ParticipationLocations } from '../../api/participation-locations/participation_locations.js';

Template.map.onCreated(function() {
  GoogleMaps.ready('map', function(map) {
    console.log(map.instance);
    google.maps.event.addListener(map.instance, 'click', function(event) {
      ParticipationLocations.insert({ lat: event.latLng.lat(), lng: event.latLng.lng()});
    });

  // The code shown below goes here
  var markers = {};

  ParticipationLocations.find().observeChanges({
    added: function(document) {
      // Create a marker for this document
      console.log(map.instance);
      let insertedMarker = ParticipationLocations.findOne({_id: document});
      var marker = new google.maps.Marker({
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(insertedMarker.lat, insertedMarker.lng),
        map: map.instance,
        // We store the document _id on the marker in order
        // to update the document within the 'dragend' event below.
        id: document
      });

      // This listener lets us drag markers on the map and update their corresponding document.
      google.maps.event.addListener(marker, 'dragend', function(event) {
        ParticipationLocations.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});
      });

      // Store this marker instance within the markers object.
      markers[document] = marker;
    },
    changed: function(newDocument, oldDocument) {
      markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
    },
    removed: function(oldDocument) {
      // Remove the marker from the map
      markers[oldDocument._id].setMap(null);

      // Clear the event listener
      google.maps.event.clearInstanceListeners(
        markers[oldDocument._id]);

        // Remove the reference to this marker instance
        delete markers[oldDocument._id];
      }
    });
  });
});

Template.map.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(-37.8136, 144.9631),
        zoom: 8
      };
    }
  }
});
