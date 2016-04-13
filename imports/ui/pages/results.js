import './results.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';

import { Experiences } from '../../api/experiences/experiences.js';
import { Images } from '../../api/images/images.js';
import { TextEntries } from '../../api/text-entries/text-entries.js';
import { Incidents } from '../../api/incidents/incidents.js';

Template.results.onCreated(function() {
  this.subscribe('images', this.data._id);
  this.subscribe('text_entries');
  this.subscribe('incidents');
  this.subscribe('experiences', this.data._id);
});

Template.results.helpers({
  photoChosen: function(params) {
    let modules = Experiences.findOne(this.experience).modules;
    return _.contains(modules, 'camera');
  },
  textChosen: function(params) {
    let modules = Experiences.findOne(this.experience).modules;
    return _.contains(modules, 'text');
  },
  images: function(params) {
    console.log(params);
    return Images.find({ incident: params._id });
  },
  textEntries: function(params) {
    return TextEntries.find({ incident: params._id });
  },
  getSubmissionLabel: function(latStr, lngStr) {
    //top left of north campus = 42.062833, -87.679559
    //top right of north campus = -87.669491
    //top left of south campus = 42.055657
    //bottom left of south campus = 42.050587
    //bottom right of south campus = 42.048593
    //top left of evanston = 42.078932, -87.711036
    //bottom left of evanston = 42.019184
    //top left Chicago = 42.009091, -87.940299
    //bottom left Chicago = 41.683914
    //top left Buffalo = 43.153463, -79.038439
    //top right Buffalo = -78.656952
    //bottom left Buffalo = 42.696882
    //top right NYC = 40.882255, -73.756606
    //top left NYC = 40.540665, -74.203905
    //top left St louis = 38.721315, -90.370798
    //bottom right St Louis = 38.564493, -90.152168

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
});
