Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {
  name: 'home',
  waitOn: function() { return Meteor.subscribe('experiences'); }
});

Router.route('/admin', {
  name: 'expButtonList',
  waitOn: function() { return Meteor.subscribe('experiences'); }
});

Router.route('/admin/locations', {
  name: 'locations'
});

Router.route('/create', {
  name: 'experienceCreator'
});

Router.route('/participate/:_id', {
  name: 'participatePage',
  data: function() { return Experiences.findOne(this.params._id); },
  waitOn: function() { return Meteor.subscribe('experiences', this.params._id); }
});

Router.route('/results/:_id', {
  name: 'resultsPage',
  layoutTemplate: 'spreadLayout',
  data: function() { return Experiences.findOne(this.params._id); },
  waitOn: function() { return Meteor.subscribe('experiences', this.params._id); }
});

Router.route('/archive', {
  name: 'myExperiencesPage',
  waitOn: function() { return Meteor.subscribe('experiences'); }
});
