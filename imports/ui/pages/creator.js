import './creator.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { _ } from 'meteor/underscore';

import { Experiences } from '../../api/experiences/experiences.js';
import { Schema } from '../../api/schema.js';

Template.creator.onRendered(function() {
  Meteor.typeahead.inject(); // require import?
});

Template.creator.helpers({
  categories() {
    return _.map(Schema.YelpCategories, category => category.title);
  }
});

Template.creator.events({
  'submit form'(event, instance) {
    event.preventDefault();

    // Parse out fields
    const name = event.target.name.value;
    const desc = event.target.desc.value;
    const startText = event.target.start.value;

    // Parse out modules
    let modules = [];
    let requirements = [];
    if (event.target.photo.checked) {
      modules.push('camera');
      requirements.push('hasCamera');
    }
    if (event.target.text.checked) {
      modules.push('text');
    }
    if (event.target.chain.checked) {
      modules.push('chain');
    }

    // Process location
    let location = _.find(Schema.YelpCategories, (category) => {
      return category.title == event.target.location.value;
    });
    if (location) {
      location = location.alias;
    } else {
      location = '';
    }

    Experiences.insert({
      name: name,
      description: desc,
      author: Meteor.userId(),
      modules: modules,
      startText: startText,
      requirements: requirements,
      location: location
    }, (err, experienceId) => {
      if (err) {
        alert(err);
      } else {
        Router.go('participate', { _id: experienceId });
      }
    });

  }
});
