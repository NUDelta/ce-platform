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
  data: function() { return Experiences.findOne({activeIncident: this.params._id}); },
  waitOn: function() { return Meteor.subscribe('experiences'); }
});

Router.route('/results/:_id', {
  name: 'resultsPage',
  layoutTemplate: 'spreadLayout',
  data: function() { return Incidents.findOne(this.params._id); },
  waitOn: function() { return [Meteor.subscribe('incidents'), Meteor.subscribe('experiences')]; }
});

Router.route('/archive', {
  name: 'myExperiencesPage',
  waitOn: function() { return Meteor.subscribe('experiences'); }
});
