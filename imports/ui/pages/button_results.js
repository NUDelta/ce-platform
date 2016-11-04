import './button_results.html';

import { Incidents } from '../../api/incidents/incidents.js';

Template.button_results.onCreated(function() {
  const incidentId = Router.current().params._id;
  const incHandle = this.subscribe('incidents.byId', incidentId);
  const expHandle = this.subscribe('experiences.byIncident', incidentId);
});

Template.button_results.helpers({
  record: function () {
    let incident = Incidents.findOne();
    if (incident && incident.data) {
      let start = incident.data.start;
      let lastClick = incident.data.time;
      return Math.round((lastClick - start)/1000) + 60;
    }
    else {
      return false;
    }
  },
  pressers: function () {
    let incident = Incidents.findOne();
    if (incident && incident.data.pressers) {
      return incident.data.pressers.length;
    }
    else {
      return false;
    }
  }
});