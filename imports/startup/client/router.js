import { Router } from 'meteor/iron:router';

import '../../ui/blaze-helpers.js';

import '../../ui/layout/layout.js';
import '../../ui/layout/spread_layout.js';

import '../../ui/pages/home.js';
import '../../ui/pages/cron.html';

import '../../ui/pages/admin_locations.js';
import '../../ui/pages/profile.js';
import '../../ui/pages/debug.html';
import '../../ui/pages/debug.js';
import '../../ui/pages/api_custom.html';
import '../../ui/pages/api_custom.js';
import '../../ui/pages/api_custom_results.html';
import '../../ui/pages/api_custom_results.js';
import '../../ui/pages/affordances.js';

import { Experiences } from "../../api/experiences/experiences";
import { Locations } from "../../api/locations/locations";
import { Images } from "../../api/images/images";
import { Submissions } from "../../api/submissions/submissions";
import { Incidents } from "../../api/incidents/incidents";
import { Meteor } from "meteor/meteor";
import {Assignments} from "../../api/coordinator/assignments";
import {Availability} from "../../api/coordinator/availability";
import {Notification_log} from "../../api/coordinator/notification_log";
import {Page_log} from "../../api/page_log/page_log";

Router.configure({
  layoutTemplate: 'layout'
});

Router.route('affordances', {
  path: '/affordances',
  template: 'affordances',
  before: function () {
    this.subscribe('locations.activeUser').wait();
    this.next();
  },
  data: function () {
    return {
      location: Locations.findOne()
    };
  }
});

Router.route('api.custom', {
  path: '/apicustom/:iid/:eid/:needName',
  template: 'api_custom',
  before: function () {
    this.subscribe('experiences.single', this.params.eid).wait();
    this.subscribe('incidents.single', this.params.iid).wait();
    this.subscribe('locations.activeUser').wait();
    this.subscribe('images.activeIncident', this.params.iid).wait();
    this.subscribe('notification_log.activeIncident', this.params.iid).wait();
    this.subscribe('users.all').wait();

    this.next();
  },
  data: function () {
    return {
      experience: Experiences.findOne(),
      incident: Incidents.findOne(),
      location: Locations.findOne(),
      notification_log: Notification_log.find().fetch(),
      users: Meteor.users.find().fetch()
    };
  }
});

Router.route('api.customresults', {
  path: '/apicustomresults/:iid/:eid',
  template: 'api_custom_results',
  before: function () {
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
    this.subscribe('images.activeIncident', this.params.iid).wait();
    this.subscribe('experiences.single', this.params.eid).wait();
    this.subscribe('submissions.activeIncident', this.params.iid).wait();
    this.next();
  },
  data: function () {
    return {
      experience: Experiences.findOne(),
      images: Images.find({}).fetch(),
      submissions: Submissions.find({}).fetch(),
    };
  }
});


Router.route('/', {
  name: 'home',
});


Router.route('cron', {
  path: '/cron',
  template: 'cron',
  before: function () {
    let uid =  Meteor.userId();
    console.log("tryna insert log",uid);
    let dic = {
      uid: uid,
      timestamp: Date.now(),
      route: "cron",
      params: {}
    };
    console.log(dic);
    Meteor.call('insertLog', dic);
    this.next();
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


