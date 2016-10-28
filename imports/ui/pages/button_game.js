import './button_game.html';

import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';

Template.button_game.onCreated(function() {
  const experiencesHandle = this.subscribe('experiences.byRoute', 'button_game');
  this.autorun(() => {

    if (experiencesHandle.ready()) {
      console.log("yay!");
      const experienceId = Experiences.findOne({route: 'button_game'})._id;
      this.subscribe('incidents.byExperience', experienceId);
    }
  });
});

Template.button_game.helpers({
  time: () => {
    let experience = Experiences.findOne({route: 'button_game'});
    if (experience && experience.activeIncident) {
      console.log(experience.activeIncident);
      let incident = Incidents.findOne(experience.activeIncident);
      console.log(incident);
      if (incident) {
        return incident.date - Date.parse(new Date());
      }
      else {
        return 1;
      }
    }
    return 0;
  }
});