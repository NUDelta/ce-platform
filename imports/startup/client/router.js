import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';

import '../../ui/blaze-helpers.js';

import '../../ui/layout/layout.js';
import '../../ui/layout/spread_layout.js';

import '../../ui/pages/home.js';
import '../../ui/pages/admin_experiences.js';
import '../../ui/pages/admin_locations.js';
import '../../ui/pages/archive.js';
import '../../ui/pages/button_game.js';
import '../../ui/pages/button_results.js';
import '../../ui/pages/creator.js';
import '../../ui/pages/participate.js';
import '../../ui/pages/results.js';
import '../../ui/pages/browse.js';
import '../../ui/pages/profile.js';
import '../../ui/pages/available_experiences.js';


Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {
  name: 'home'
});

Router.route('/admin', {
  name: 'admin.experiences',
  template: 'admin_experiences',
  waitOn: function() { return Meteor.subscribe('experiences'); }
});

Router.route('/admin/locations', {
  name: 'admin.locations',
  template: 'admin_locations'
});

Router.route('/create', {
  name: 'creator'
});

Router.route('/participate/button_game', {
  template: 'button_game'
});

// TODO: Fix up subscription management patterns
Router.route('/participate/:_id', {
  name: 'participate'
});

Router.route('/results/button_game/:_id', {
  template: 'button_results',
  layoutTemplate: 'spreadLayout'
});


Router.route('/results/:_id', {
  name: 'results',
  layoutTemplate: 'spreadLayout'
});

Router.route('/archive', {
  name: 'archive',
  waitOn: function() { return Meteor.subscribe('experiences'); }
});

Router.route('/browse', {
  name: 'browse'
});

Router.route('/profile', {
  name: 'profile'
});

Router.route('/buttongame', {
  template: 'button_game'
});

Router.route('/available', {
  template: 'available_experiences',
  waitOn: function() { return [Meteor.subscribe('experiences'), Meteor.subscribe('locations')]; }
});
