import { Router } from 'meteor/iron:router';
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

import { Experiences, Incidents } from "../../api/OCEManager/OCEs/experiences";
import { Locations } from "../../api/UserMonitor/locations/locations";
import {Avatars, Images} from "../../api/ImageUpload/images";
import { Submissions } from "../../api/OCEManager/currentNeeds";
import { Meteor } from "meteor/meteor";
import {Assignments, Availability} from "../../api/OpportunisticCoordinator/databaseHelpers";
import {Notification_log} from "../../api/Logging/notification_log";
import {Page_log} from "../../api/Logging/page_log/page_log";

Router.configure({
  layoutTemplate: 'layout'
});

AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');

Router.route('affordances', {
  path: '/affordances',
  template: 'affordances',
  before: function () {
    if (Meteor.userId()) {
      let dic = {
        uid: Meteor.userId(),
        timestamp: Date.now(),
        route: "affordances",
        params: {}
      };
      Meteor.call('insertLog', dic);
    }

    this.subscribe('avatars.all').wait();
    this.subscribe('users.all').wait();
    this.subscribe('locations.activeUser').wait();
    this.next();
  },
  data: function () {
    return {
      location: Locations.findOne(),
      avatars: Avatars.find().fetch(),
      users: Meteor.users.find().fetch()
    };
  }
});

Router.route('api.custom', {
  path: '/apicustom/:iid/:eid/:needName',
  template: 'api_custom',
  before: function () {
    if (Meteor.userId()) {
      let dic = {
        uid: Meteor.userId(),
        timestamp: Date.now(),
        route: "customparticipate",
        params: {
          iid: this.params.iid,
          eid: this.params.eid,
          needName: this.params.needName
        }
      };
      Meteor.call('insertLog', dic);
    }

    this.subscribe('experiences.single', this.params.eid).wait();
    this.subscribe('incidents.single', this.params.iid).wait();
    this.subscribe('locations.activeUser').wait();
    this.subscribe('images.activeIncident', this.params.iid).wait();
    this.subscribe('notification_log.activeIncident', this.params.iid).wait();
    // TODO(rlouie): create subscribers which only get certain fields like, username which would be useful for templates
    this.subscribe('users.all').wait();
    this.subscribe('avatars.all').wait();

    this.next();
  },
  data: function () {
    return {
      experience: Experiences.findOne(),
      incident: Incidents.findOne(),
      location: Locations.findOne(),
      notification_log: Notification_log.find().fetch(),
      images: Images.find({}).fetch(),
      avatars: Avatars.find({}).fetch(),
      users: Meteor.users.find().fetch()
    };
  }
});

Router.route('api.customresults', {
  path: '/apicustomresults/:iid/:eid',
  template: 'api_custom_results',
  before: function () {
    if (Meteor.userId()) {
      let dic = {
        uid: Meteor.userId(),
        timestamp: Date.now(),
        route: "customresults",
        params: {
          iid: this.params.iid,
          eid: this.params.eid
        }
      };
      Meteor.call('insertLog', dic);
    }
    this.subscribe('images.activeIncident', this.params.iid).wait();
    this.subscribe('experiences.single', this.params.eid).wait();
    this.subscribe('submissions.activeIncident', this.params.iid).wait();
    this.subscribe('users.all').wait();
    this.subscribe('avatars.all').wait();
    this.next();
  },
  data: function () {
    return {
      experience: Experiences.findOne(),
      images: Images.find({}).fetch(),
      submissions: Submissions.find({}).fetch(),
      users: Meteor.users.find().fetch(),
      avatars: Avatars.find({}).fetch(),
    };
  }
});

Router.route('api.customresults.admin', {
  path: '/apicustomresultsadmin/:iid/:eid',
  template: 'api_custom_results_admin',
  before: function () {
    this.subscribe('images.activeIncident', this.params.iid).wait();
    this.subscribe('experiences.single', this.params.eid).wait();
    this.subscribe('submissions.activeIncident', this.params.iid).wait();
    this.subscribe('users.all').wait();
    this.subscribe('avatars.all').wait();
    this.next();
  },
  data: function () {
    return {
      experience: Experiences.findOne(),
      images: Images.find({}).fetch(),
      submissions: Submissions.find({}).fetch(),
      users: Meteor.users.find().fetch(),
      avatars: Avatars.find({}).fetch(),
    };
  }
});

Router.route('/', {
  name: 'home',
  before: function() {
    if (Meteor.userId()) {
      let dic = {
        uid: Meteor.userId(),
        timestamp: Date.now(),
        route: "home",
        params: {}
      };
      Meteor.call('insertLog', dic);
    }
    this.next();
  }
});

Router.route('participate.backdoor', {
  path: '/participate/backdoor',
  template: 'participateBackdoor',
  before: function() {
    this.subscribe('submissions.all').wait();
    this.next();
  },
  data: function () {
    return {
      submissions: Submissions.find({}).fetch()
    }
  }
});

Router.route('results.backdoor', {
  path: '/results/backdoor',
  template: 'resultsBackdoor',
  before: function() {
    this.subscribe('experiences.all').wait();
    this.subscribe('submissions.all').wait();
    this.next();
  },
  data: function () {
    return {
      submissions: Submissions.find({}).fetch(),
      experiences: Experiences.find({}).fetch()
    }
  }
});

Router.route('admin.debug', {
  path: '/admin/debug',
  template: 'debug',
  before: function () {
    this.subscribe('locations.all').wait();
    this.subscribe('assignments.all').wait();
    this.subscribe('experiences.all').wait();
    this.subscribe('images.all').wait();
    this.subscribe('incidents.all').wait();
    this.subscribe('users.all').wait();
    this.subscribe('submissions.all').wait();
    this.subscribe('availability.all').wait();
    this.next();

  },
  data: function () {
    return {
      location: Locations.find().fetch(),
      assignments: Assignments.find().fetch(),
      experience: Experiences.find().fetch(),
      images: Images.find().fetch(),
      incidents: Incidents.find({}).fetch(),
      users: Meteor.users.find({}).fetch(),
      submissions: Submissions.find({}).fetch(),
      availability: Availability.find({}).fetch(),
    };
  }
});

Router.route('profile', {
  path: '/profile',
  template: 'profile',
  before: function () {
    if (Meteor.userId()) {
      let dic = {
        uid: Meteor.userId(),
        timestamp: Date.now(),
        route: "profile",
        params: {}
      };
      Meteor.call('insertLog', dic);
    }
    this.subscribe('incidents.pastUser').wait();
    this.subscribe('experiences.pastUser').wait();
    this.next();
  },
  data: function () {
    return {
      incidents: Incidents.find({}).fetch(),
      experiences: Experiences.find({}).fetch(),

    };
  }
});


