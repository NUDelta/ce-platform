Router.configure({
	layoutTemplate: 'layout'
});

Router.route('/', {
  name: 'home'
});

Router.route('/admin', {
  name: 'expButtonList'
});
