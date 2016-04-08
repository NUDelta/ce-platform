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
  categories: function() {
    return _.map(Schema.YelpCategories, category => category.title);
  }
});

Template.creator.events({
  'submit form': function(e) {
    e.preventDefault();
    let modules = [];
    let requirements = [];
    let email = '';
    let name = e.target.name.value;
    let desc = e.target.desc.value;
    let location = _.find(Schema.YelpCategories, (category) => {
      return category.title == e.target.location.value;
    });

    if (location) {
      location = location.alias;
    } else {
      location = '';
    }

    if (e.target.photo.checked) {
      modules.push('camera');
      email = 'Get your camera ready because it\'s time to post a picture for ' + name + '.';
      requirements[0] = 'hasCamera'
    } else {
      email = 'The ' + name + ' experience is starting. ' + desc;
    }

    if (e.target.text.checked) {
      modules.push('text');
    }

    let experience = {
      name: name,
      description: desc,
      author: Meteor.userId(),
      modules: modules,
      startText: email,
      requirements: requirements,
      location: location
    };

    Experiences.insert(experience, (err, res) => {
      if (err) {
        alert(err);
      } else {
        Router.go('participate', experience);
      }
    });

  }
});
