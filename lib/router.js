Router.configure({
	layoutTemplate: 'layout'
});

Router.route('/', {
  name: 'home'
});

Router.route('/admin', {
  name: 'expButtonList'
});

Router.route('/create', {
	name: 'experienceCreator'
});

Router.route('/participate/:_id', {
	name: 'participatePage',
	data: function() { return Experiences.findOne(this.params._id); }
});

Router.route('/results/:_id', {
	name: 'resultsPage',
	layoutTemplate: 'spreadLayout',
	data: function() { return Experiences.findOne(this.params._id); }
});

Router.route('/archive', {
	name: 'myExperiencesPage'
});
