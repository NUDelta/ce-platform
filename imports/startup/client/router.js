import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import { Experiences } from '../../api/experiences/experiences.js';



Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {
  name: 'home',
  waitOn: function() { return Meteor.subscribe('experiences'); }
});

Router.route('/admin', {
  name: 'admin_experiences',
  waitOn: function() { return Meteor.subscribe('experiences'); }
});

Router.route('/admin/locations', {
  name: 'admin_locations'
});

Router.route('/create', {
  name: 'creator'
});

// TODO: Fix up subscription management patterns
Router.route('/participate/:_id', {
  name: 'participate',
  data: function() { return Experiences.findOne(this.params._id); },
  waitOn: function() { return Meteor.subscribe('experiences', this.params._id); }
});

Router.route('/results/:_id', {
  name: 'results',
  layoutTemplate: 'spreadLayout',
  data: function() { return Experiences.findOne(this.params._id); },
  waitOn: function() { return Meteor.subscribe('experiences', this.params._id); }
});

Router.route('/archive', {
  name: 'archive',
  waitOn: function() { return Meteor.subscribe('experiences'); }
});
