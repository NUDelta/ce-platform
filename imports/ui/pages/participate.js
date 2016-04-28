import './participate.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { _ } from 'meteor/underscore';

import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';
import { Images } from '../../api/images/images.js';
import { TextEntries } from '../../api/text-entries/text-entries.js';
import { ParticipationLocations } from '../../api/participation-locations/participation_locations.js';
import { LocationManager } from '../../api/locations/client/location-manager-client.js';

import '../components/experience_buttons.js';
import '../components/map.js';

let photoChosenLocal = (exp) => {
  let modules = Experiences.findOne(exp._id).modules;
  return _.contains(modules, 'camera');
};

let textChosenLocal = (exp) => {
  let modules = Experiences.findOne(exp._id).modules;
  return _.contains(modules, 'text');
};

let getSubmissionLocation = (latStr, lngStr) => {
  lat = parseFloat(latStr);
  lng = parseFloat(lngStr);

  if (lat <= 42.062833 && lat > 42.055657 && lng >= -87.679559 && lng < -87.669491) {
    return "NU North Campus";
  } else if (lat <= 42.055657 && lat > 42.048593 && lng >= -87.679559 && lng < -87.669491) {
    return "NU South Campus";
  } else if (lat <= 42.078932 && lat > 42.019184 && lng >= -87.711036 && lng < -87.669491) {
    return "Off-campus Evanston";
  } else if (lat <= 42.009091 && lat > 41.683914 && lng >= -87.940299 && lng < -87.669491) {
    return "Greater Chicago, IL Area";
  } else if (lat <= 43.153463 && lat > 42.696882 && lng >= -79.038439 && lng < -78.656952) {
    return "Greater Buffalo, NY Area";
  } else if (lat <= 40.882255 && lat > 40.540665 && lng >= -74.203905 && lng < -73.756606) {
    return "Greater New York, NY Area";
  } else if (lat <= 38.721315 && lat > 38.564493 && lng >= -90.370798 && lng < -90.152168) {
    return "Greater St. Louis, MO Area";
  } else {
    return "(" + lat + ", " + lng + ")";
  }
}

Template.participate.onCreated(function() {
  this.subscribe('experiences', this.data._id);
  this.subscribe('incidents');
  this.subscribe('images', this.data._id);
  this.subscribe('participation_locations');
  Session.set('incidentId', this.data.activeIncident);
  //need to deal with what happens when an experience ends (time stamp incidents?)
});

Template.participate.helpers({
  photoChosen: function() {
    return photoChosenLocal(this);
  },
  ownExperience: function() {
    return this.author === Meteor.userId();
  },
  textChosen: function() {
    return textChosenLocal(this);
  },
  onlyTextChosen: function() {
    return !photoChosenLocal(this) && textChosenLocal(this);
  },
  photoOrTextChosen: function() {
    return photoChosenLocal(this) || textChosenLocal(this);
  }
});

Template.participate.events({
  'submit form': function(event, template) {
    event.preventDefault();
    let image = {},
    textEntry = {},
    isPhoto = photoChosenLocal(this),
    isText = textChosenLocal(this),
    captionText;

    let loc = LocationManager.currentLocation();
    let place = getSubmissionLocation(loc.lat, loc.lng);
    if (isText) {
      captionText = event.target.write.value || '';
      textEntry = {
        submitter: Meteor.userId(),
        text: captionText,
        experience: this._id,
        incident: this.activeIncident,
        lat: loc.lat,
        lng: loc.lng,
        location: place
      };
      console.log(textEntry);
      TextEntries.insert(textEntry);
    }

    if (isPhoto) {
      let picture = event.target.photo.files[0];
      Images.insert(picture, (err, imageObj) => {
        if (err) {
          alert(error);
        } else {
          Images.update(imageObj._id,
            { $set : { experience: this._id, caption: captionText, incident: this.activeIncident, lat: loc.lat, lng: loc.lng, location: place} }
          );
          console.log('Image metadata created.');
          alert('We got it!');

          Router.go('results', {_id: this.activeIncident});
          //let observer = Images.find(imageObj._id).observe({
          //  changed: (newImage, oldImage) => {
          //    if (newImage.isUploaded()) {
          //      observer.stop();
          //      alert('We got it!');
          //    }
          //  }
          //})
        }
      });
    } else {
      Router.go('results', {_id: this.activeIncident});
    }
  },
  'click #participate-btn': function(event) {
    event.preventDefault();

    let longitude = -(Math.random()*(90-70+1)+70);
    let latitude = Math.random()*(50-30+1)+30;
    let loc = {lat: latitude, lng: longitude};

    //for when mobile works
    // let loc = LocationManager.currentLocation();

    let participationLocLog = {
      incidentId: this.activeIncident,
      experience: this._id,
      userId: Meteor.userId(),
      lat: loc.lat,
      lng: loc.lng
    };

    ParticipationLocations.insert(participationLocLog);

    window.plugins.flashlight.available(function(isAvailable) {
      if (isAvailable) {

        // switch on
        window.plugins.flashlight.switchOn(); // success/error callbacks may be passed

        // switch off after 3 seconds
        setTimeout(function() {
          window.plugins.flashlight.switchOff(); // success/error callbacks may be passed
        }, 3000);

      } else {
        alert("Flashlight not available on this device");
      }
    });
  }
});
