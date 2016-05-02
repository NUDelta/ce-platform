import './map.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';
import { GoogleMaps } from 'meteor/dburles:google-maps';
import { ParticipationLocations } from '../../api/participation-locations/participation_locations.js';
import { LocationManager } from '../../api/locations/client/location-manager-client.js';

Template.map.onCreated(function() {
  this.subscribe('participation_locations');

  const data = Template.currentData();
  this.autorun(() => {
    // Somewhat unintuitive here.
    // Only check for data if it exists, so we can use it from
    // experience owner.
    if (data) {
      new SimpleSchema({
        incidentId: {
          type: String,
          regEx: SimpleSchema.RegEx.Id,
        }
      }).validate(data);
    }
  });

  const incidentId = data && data.incidentId;
  GoogleMaps.ready('map', (map) => {
    var markers = {};

    ParticipationLocations.find({incidentId: incidentId}).forEach(function(entry) {
      var marker = new google.maps.Marker({
        draggable: false,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(entry.lat, entry.lng),
        map: map.instance
      });

      markers[entry._id] = marker;
    });

    ParticipationLocations.find({incidentId: incidentId}).observeChanges({
      added(document) {
        // Create a marker for this document
        const insertedMarker = ParticipationLocations.findOne({_id: document});

        var marker = new google.maps.Marker({
          draggable: false,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(insertedMarker.lat, insertedMarker.lng),
          map: map.instance
        });

        markers[insertedMarker._id] = marker;
      },
      removed(oldDocument) {
        console.log(markers);
        console.log(markers[oldDocument]);
        markers[oldDocument].setMap(null);
        console.log(markers[oldDocument]);
        console.log(oldDocument);
        console.log(markers);
        delete markers[oldDocument];
        console.log(markers[oldDocument]);
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
        zoom: 3,
        mapTypeId: google.maps.MapTypeId.SATELLITE
      };
    }
  }
});
