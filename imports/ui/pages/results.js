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
  }
});
