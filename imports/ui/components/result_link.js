import './result_link.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';

Template.resultLink.onCreated(function () {
  this.subscribe('incidents');
});


Template.resultLink.helpers({
  name: function() {
    return Experiences.findOne(Incidents.findOne(this.toString()).experience).name;
  }
});
