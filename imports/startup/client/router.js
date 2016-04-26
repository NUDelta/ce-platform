import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';
import { ParticipationLocations } from '../../api/participation-locations/participation_locations.js';


import '../../ui/layout/header.js';
import '../../ui/layout/layout.js';
import '../../ui/layout/spread_layout.js';

import '../../ui/pages/home.js';
import '../../ui/pages/admin_experiences.js';
import '../../ui/pages/admin_locations.js';
import '../../ui/pages/archive.js';
import '../../ui/pages/creator.js';
import '../../ui/pages/participate.js';
import '../../ui/pages/results.js';

Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {
  name: 'home',
  waitOn: function() { return [Meteor.subscribe('experiences'), Meteor.subscribe('incidents')]; }
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

// TODO: Fix up subscription management patterns
Router.route('/participate/:_id', {
  name: 'participate'
});

Router.route('/results/:_id', {
  name: 'results',
  layoutTemplate: 'spreadLayout',
  data: function() { return Incidents.findOne(this.params._id); },
  waitOn: function() { return [Meteor.subscribe('experiences'), Meteor.subscribe('incidents')]; }
});

Router.route('/archive', {
  name: 'archive',
  waitOn: function() { return Meteor.subscribe('experiences'); }
});
