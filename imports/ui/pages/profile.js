import './profile.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';

import '../components/result_link.js';

Template.profile.onCreated(function() {
  this.subscribe('experiences');
  this.subscribe('incidents.byUser');
});

Template.profile.helpers({
  pastIncidents: function () {
    return Meteor.user().profile.pastIncidents;
  },
  resultLinkArgs(pastIncident) {
    const incident = Incidents.findOne(pastIncident);
    return {
      incidentId: pastIncident,
      experience: Experiences.findOne(incident.experienceId)
    }
  },
  experiences: function() {
    return Experiences.find({author: Meteor.userId()}).fetch();
  }
});
