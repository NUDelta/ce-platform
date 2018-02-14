import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';

import '../../ui/blaze-helpers.js';

import '../../ui/layout/layout.js';
import '../../ui/layout/spread_layout.js';

import '../../ui/pages/home.js';
import '../../ui/pages/admin_locations.js';
import '../../ui/pages/profile.js';
import '../../ui/pages/debug.html';
import '../../ui/pages/debug.js';
import '../../ui/pages/api_custom.html';
import '../../ui/pages/api_custom.js';
import '../../ui/pages/api_custom_results.html';
import '../../ui/pages/api_custom_results.js';
import '../../ui/pages/affordances.js';

Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/affordances', {
  name: 'affordances',
  template: 'affordances'
});

Router.route('/apicustom/:_id', {
  name: 'api.custom',
  template: 'api_custom',
  onStop: function() {
        console.log("someone left the page");
    }
});

Router.route('/apicustomresults/:_id', {
  name: 'api.custom.results',
  template: 'api_custom_results',
  onStop: function() {
        console.log("someone left the page");
    }
});

Router.route('/', {
  name: 'home',
});

Router.route('/admin/debug', {
  name: 'admin.debug',
  template: 'debug',
  // waitOn: function() { return Meteor.subscribe('experiences'); }
});


Router.route('/profile', {
  name: 'profile'
});
