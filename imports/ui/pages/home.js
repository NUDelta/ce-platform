import './home.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Experiences } from '../../api/experiences/experiences';
import { Incidents } from '../../api/incidents/incidents';
import { Assignments } from '../../api/coordinator/assignments';

import '../components/active_experience.js';

Template.home.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.set('render', true);
  this.autorun(() => {
    Template.instance().state.set('render', true);
    this.subscribe('experiences.activeUser');
    this.subscribe('incidents.activeUser');
    this.subscribe('assignments.activeUser');
  });
});

Template.home.events({
  'click .refresh'() {
    ///Template.instance().state.set('render', false);
    Template.instance().state.get('render');
    Template.instance().state.set('render', false);
    location.reload();
  },
});

Template.home.helpers({
  activeUserAssigment() {
    // create [{iid: incident_id, eid: experience_id, needName: assigned_need_name}]
    let activeAssignments = Assignments.find().fetch();
    let output = [];

    _.forEach(activeAssignments, (assignment) => {
      _.forEach(assignment.needUserMaps, (currNeedUserMap) => {
        if (currNeedUserMap.uids.includes(Meteor.userId())) {
          // get experience
          let experience = Experiences.findOne(Incidents.findOne(assignment._id).eid);
          output.push({
            'iid': assignment._id,
            'experience': experience,
            'needName': currNeedUserMap.needName
          });

          // user can only be assigned to one need in each assignment object
          return false;
        }
      });
    });

    return output;
  },
  noActiveIncidents() {
    let currActiveIncidents = Meteor.users.findOne(Meteor.userId()).profile.activeIncidents;
    return currActiveIncidents === null || currActiveIncidents.length === 0;
  },
  getCurrentExperience(iid) {
    Template.instance().state.get('render');

    return {
      experience: Experiences.findOne(Incidents.findOne(iid).eid)
    }
  }
});
