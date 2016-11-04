import './button_game.html';

import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';

let timerInterval;
let timeRemaining = 60;

function updateTimer() {
  let incident = Incidents.findOne();
  let currTime = Date.parse(new Date());
  if (incident && incident.data && incident.data.time) {
    let lastClick = incident.data.time;
    timeRemaining = 60 + Math.round((lastClick - currTime)/1000);
    Session.set('timeRemaining', timeRemaining);
  }
}

Template.button_game.onCreated(function() {
  const experiencesHandle = this.subscribe('experiences.byRoute', 'button_game');
  Session.set('timeRemaining', timeRemaining);
  timerInterval = Meteor.setInterval(updateTimer, 1000);
  this.autorun(() => {

    if (experiencesHandle.ready()) {
      const experienceId = Experiences.findOne({route: 'button_game'})._id;
      const incidentHandle = this.subscribe('incidents.byExperience', experienceId);

      if (incidentHandle.ready()) {
        const incidentId = Incidents.findOne({experienceId: experienceId})._id;
        Meteor.call('incidents.startButtonGame', { incidentId });
      }
    }

  });
});

Template.button_game.events({
  'click .btn-timer': function () {
    let experienceId = Experiences.findOne({route: 'button_game'})._id;
    let incidentId = Incidents.findOne({experienceId: experienceId})._id;
    Meteor.call('incidents.clickButton', { incidentId });
  }
});

Template.button_game.helpers({
  time: () => {
    return Session.get('timeRemaining');
  },
  pressed: () => {
    let experienceId = Experiences.findOne({route: 'button_game'})._id;
    let incident = Incidents.findOne({experienceId: experienceId})
    let pressers;
    if (incident && incident.data && incident.data.pressers) {
      pressers = incident.data.pressers;
      return pressers.indexOf(Meteor.userId()) != -1;
    }
    else {
      return false;
    }
  },
  numPressers: () => {
    let experienceId = Experiences.findOne({route: 'button_game'})._id;
    let incident = Incidents.findOne({experienceId: experienceId})
    let pressers;
    if (incident && incident.data && incident.data.pressers) {
      pressers = incident.data.pressers;
      switch (pressers.length) {
        case 0:
          return 'Nobody has pressed the button!';
        case 1:
          return '1 person has pressed the button!';
        default: 
          return '' + pressers + ' people have pressed the button!';
      }
    }
    else {
      return 0;
    }
  }
});

Template.button_game.onDestroyed(() => {
  Meteor.clearInterval(timerInterval);
  Session.set('timeRemaining', null);
})