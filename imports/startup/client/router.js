import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import '../../ui/blaze-helpers.js';
import '../../ui/common.js';

import '../../ui/layout/layout.js';
import '../../ui/layout/spread_layout.js';

import '../../ui/pages/home.js';

import '../accounts_config.js';

import '../../ui/components/user_avatar_name.html';
import '../../ui/pages/account_page.html';
import '../../ui/pages/account_page.js';
import '../../ui/pages/admin_locations.js';
import '../../ui/pages/chat.js';
import '../../ui/pages/profile.js';
import '../../ui/pages/debug.html';
import '../../ui/pages/debug.js';
import '../../ui/pages/api_custom.html';
import '../../ui/pages/api_custom.js';
import '../../ui/pages/api_custom_results.html';
import '../../ui/pages/api_custom_results.js';
import '../../ui/pages/affordances.js';
import '../../ui/pages/participate_backdoor.html';
import '../../ui/pages/participate_backdoor.js';
import '../../ui/pages/dynamic_participate.html';
import '../../ui/pages/dynamic_participate.js';

AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');

FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('layout', { main: 'home'});
  }
});

FlowRouter.route('/profile', {
  name: 'profile',
  action() {
    BlazeLayout.render('layout', { main: 'profile_page'});
  }
});

FlowRouter.route('/chat', {
  name: 'chat',
  action() {
    BlazeLayout.render('layout', { main: 'chat_page'});
  }
})

FlowRouter.route('/affordances', {
  name: 'affordances',
  action() {
    BlazeLayout.render('layout', { main: 'affordances_page'});
  }
})

FlowRouter.route('/apicustomdynamic/:iid/:detectorUniqueKey', {
  name: 'api.custom.dynamic',
  action() {
    BlazeLayout.render('layout', { main: 'dynamicParticipate'});
  }
});

FlowRouter.route('/apicustom/:iid/:eid/:needName', {
  name: 'api.custom',
  action() {
    BlazeLayout.render('layout', { main: 'api_custom_page'});
  }
});

FlowRouter.route('/apicustomresults/:iid/:eid', {
  name: 'api.custom.results',
  action() {
    BlazeLayout.render('layout', { main: 'api_custom_results_page'});
  }
});

FlowRouter.route('/apicustomresultsadmin/:iid/:eid', {
  name: 'api.custom.results.admin',
  action() {
    BlazeLayout.render('layout', { main: 'api_custom_results_admin_page'});
  }
});


FlowRouter.route('/participate/backdoor', {
  name: 'participate.backdoor',
  action() {
    BlazeLayout.render('layout', { main: 'participate_backdoor_page'});
  }
});

FlowRouter.route('/results/backdoor', {
  name: 'results.backdoor',
  action() {
    BlazeLayout.render('layout', { main: 'results_backdoor_page'});
  }
});

// FIXME: Depreciated route or page
// Router.route('admin.debug', {
//   path: '/admin/debug',
//   template: 'debug',
//   before: function () {
//     this.subscribe('locations.all').wait();
//     this.subscribe('assignments.all').wait();
//     this.subscribe('experiences.all').wait();
//     this.subscribe('images.all').wait();
//     this.subscribe('incidents.all').wait();
//     this.subscribe('users.all').wait();
//     this.subscribe('submissions.all').wait();
//     this.subscribe('availability.all').wait();
//     this.next();

//   },
//   data: function () {
//     return {
//       location: Locations.find().fetch(),
//       assignments: Assignments.find().fetch(),
//       experience: Experiences.find().fetch(),
//       images: Images.find().fetch(),
//       incidents: Incidents.find({}).fetch(),
//       users: Meteor.users.find({}).fetch(),
//       submissions: Submissions.find({}).fetch(),
//       availability: Availability.find({}).fetch(),
//     };
//   }
// });

