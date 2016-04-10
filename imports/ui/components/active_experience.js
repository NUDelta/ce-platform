import './active_experience.html';

import { Template } from 'meteor/templating';
import { Experiences } from '../../api/experiences/experiences.js';
import { Router } from 'meteor/iron:router';

Template.active_experience.onCreated(function() {
  this.subscribe('experiences');
  this.subscribe('incidents');
});

Template.active_experience.events({
  'click .btn-participate': function () {
    Router.go('participate', {_id: this.toString()});
  }
});

Template.active_experience.helpers({
  name: function () {
    return Experiences.findOne(this.toString()).name;
  }
});