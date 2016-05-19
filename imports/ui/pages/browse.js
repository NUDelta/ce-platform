import './browse.html';
import '../components/subscribe_experience.js';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import { Experiences } from '../../api/experiences/experiences.js';

Template.browse.onCreated(function() {
  this.subscribe('experiences');
});

Template.browse.helpers({
  experiences: function () {
    return Experiences.find().fetch();
  }
});