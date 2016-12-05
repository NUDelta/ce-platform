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
    //const radius = event.target.radius.value;
    const duration = event.target.duration.value;
    const affordance = event.target.affordance.value;
    console.log(affordance);

    // Parse out modules
    let modules = [];
    let requirements = [];
    if (event.target.photo.checked) {
      modules.push('camera');
      //requirements.push('hasCamera');
    }
    if (event.target.text.checked) {
      modules.push('text');
    }
    // if (event.target.chain.checked) {
    //   modules.push('chain');
    // }
    if (event.target.map.checked) {
      modules.push('map');
    }
    if (event.target.flashlight.checked) {
      modules.push('flashlight');
    }

    // Process options
    const optIn = event.target.optin.checked;

    // Process location
    /**let location = _.find(Schema.YelpCategories, (category) => {
      return category.title == event.target.location.value;
    });
    if (location) {
      location = location.alias;
    } else {
      location = '';
    }**/

    Experiences.insert({
      name,
      description: desc,
      author: Meteor.userId(),
      activeIncident: null,
      modules,
      startText,
      requirements,
      affordance,
      duration,
    //  radius,
      optIn
    }, (err, experienceId) => {
      if (err) {
        alert(err);
      } else {
        if (optIn) {
          Meteor.call('users.subscribeUserToExperience', {experienceId: experienceId});
        }
        else {
          Meteor.call('users.subscribeAllUsersToExperience', {experienceId: experienceId});
        }
        Router.go('participate', { _id: experienceId });
      }
    });

  }
});
