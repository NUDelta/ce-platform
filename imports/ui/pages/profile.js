import './profile.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';

import '../components/result_link.js';

Template.profile.onCreated(function () {

});

Template.profile.helpers({
  getTimeStamp: function (iid) {
    //TODO: get the timestamp of when the user participated so we can show that in the UI
  },
  infoForLink(incident) {
    let experience = Experiences.find(function (experience) {
      return experience._id === incident.eid;
    });
    return {
      iid: incident.iid,
      eid: experience._id,
      experienceName: experience.name,
    }
  }
});
