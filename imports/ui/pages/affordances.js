import './affordances.html';

// import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Locations } from '../../api/UserMonitor/locations/locations.js';
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

Template.affordances.events({

  'click #toggle-affordance-info': function() {
    var affordanceInfo = document.getElementById('affordance-info');

    if (affordanceInfo.style.display == "block") {
      affordanceInfo.style.display = "none";
    } else {
      affordanceInfo.style.display = "block";
    }
  },

  'submit form': function(event) {
    event.preventDefault();

    let label = document.getElementById('groundtruth-label').value;
    let uid = Meteor.userId();

    Meteor.call('insertGroundTruthLog', {
      uid: uid, label: label
    }, function(err, res) {
      if (err) {
        $("div#groundtruth-status").text('Failed to log [' + label + ']');
      } else {
        $("div#groundtruth-status").text('Yes! Logged [' + label + ']');
      }
    });
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
  affordanceKeys() {
    let dict = this.location.affordances;
    let keys = Object.keys(dict);
    return keys
  },
  affordanceValues(key){
    return JSON.stringify(this.location.affordances[key]);
  }
});
