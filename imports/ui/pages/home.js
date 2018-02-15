import './home.html';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Experiences } from '../../api/experiences/experiences.js';

import '../components/active_experience.js';
import { Incidents } from "../../api/incidents/incidents";

Template.home.onCreated(function() {
    this.state = new ReactiveDict();
    this.state.set('render', true);
    this.autorun(() => {
      console.log("rerunning");
      Template.instance().state.set('render', true);
      this.subscribe('experiences.activeUser', Template.instance().state.get('render')); // TODO: make more specific
    });
});

Template.home.events({
  'click .refresh'(){
    ///Template.instance().state.set('render', false);
    Template.instance().state.get('render');
    Template.instance().state.set('render', false);
    location.reload();
  }
});

Template.home.helpers({
  activeIncidents() {
    return Meteor.users.findOne(Meteor.userId()).profile.activeIncidents;
  },
  noActiveIncidents() {
    let currActiveIncidents = Meteor.users.findOne(Meteor.userId()).profile.activeIncidents;
    return currActiveIncidents === null || currActiveIncidents.length === 0;
  },
  getCurrentExperience(iid) {
    Template.instance().state.get('render');
    console.log("all the experiences returned by subscription", Experiences.find().fetch());

    return {
      experience: Experiences.findOne(Incidents.findOne(iid).eid)
    }
  }
});
