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
  Session.set('imageFilter', {incident: this.data._id});
  Session.set('textFilter', {incident: this.data._id});
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
    return Images.find(Session.get('imageFilter'));
  },
  textEntries: function(params) {
    return TextEntries.find(Session.get('textFilter'));
  }
});

Template.results.events({
  'change #pic-dropdown': function(evt) {
    let newValue =  $('#pic-dropdown option:selected').text();
    let oldValue = Session.get('imageFilter');
    let newFilter = {incident: this._id};

    if (newValue != oldValue && newValue != 'Anywhere') {
      // value changed, let's do something
      newFilter.location = newValue;
    }

    console.log(newFilter);
    Session.set('imageFilter', newFilter);
  },
  'change #text-dropdown': function(evt) {
    let newValue =  $('#text-dropdown option:selected').text();
    let oldValue = Session.get('textFilter');
    let newFilter = {incident: this._id};

    if (newValue != oldValue && newValue != 'Anywhere') {
      // value changed, let's do something
      newFilter.location = newValue;
    }

    console.log(newFilter);
    Session.set('textFilter', newFilter);
  }
});
