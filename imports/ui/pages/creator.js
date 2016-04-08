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
    let name = $(e.target).find('[name=name]').val();
    let location = _.find(Schema.YelpCategories, (category) => {
      return category.title == e.target.location.value;
    });

    if (location) {
      location = location.alias;
    } else {
      location = '';
    }

    if ($('#photo').is(':checked')) {
      modules.push('camera');
      email = 'Get your camera ready because it\'s time to post a picture for ' + name + '.';
      requirements[0] = 'hasCamera'
    } else {
      email = 'The ' + name + ' experience is starting. ' + $(e.target).find('[name=desc]').val();
    }

    if ($('#text-entry').is(':checked')) {
      modules.push('text');
    }

    let experience = {
      name: name,
      description: $(e.target).find('[name=desc]').val(),
      author: Meteor.userId(),
      modules: modules,
      startText: email,
      requirements: requirements,
      location: location
    };

    experience._id = Experiences.insert(experience, (err, res) => {
      if (err) {
        alert(err);
      } else {
        //email += ' Follow this <a href="http://localhost:3000/participate/' + experience._id + '">link</a></p>'
        Experiences.update({ _id: experience._id }, {
          $set: {startText: email}
        });
        Router.go('participate', experience);
      }
    });

  }
});
