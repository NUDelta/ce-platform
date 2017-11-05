import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Experiences } from '../experiences/experiences.js';
import { Schema } from '../schema.js';

import { Locations } from '../locations/locations.js';
import { Submissions } from '../submissions/submissions.js';

import { Users } from '../users/users.js';
import { _ } from 'meteor/underscore';

import { Incidents } from '../incidents/incidents.js';

import { registerCallback } from '../coordinator/methods.js';

export const americanFlag = new ValidatedMethod({
  name: 'api.americanFlag',
  validate: null,
  run(){
    var redTemplate = {
      "name" : "red",
      "contributions" : {"red": "Image"},
    };
    var whiteTemplate = {
     "name" : "white",
     "contributions" : {"white": "Image"},
    };
    var blueTemplate = {
      "name" : "blue",
      "contributions" : {"blue": "Image"},
    };
    var greenTemplate = {
      "name" : "green",
      "contributions" : {"green": "Image"},
    };
    var purpleTemplate = {
      "name" : "purple",
      "contributions" : {"purple": "Image"},
    };
    var orangeTemplate = {
      "name" : "orange",
      "contributions" : {"orange": "Image"},
    };
    var blackTemplate = {
      "name" : "black",
      "contributions" : {"black": "Image"},
    };
    var yellowTemplate = {
      "name" : "yellow",
      "contributions" : {"yellow": "Image"},
    };
    console.log("gonna call to create an experience")
    const experienceId = Meteor.call("api.createExperience", {
      name: "Create a rainbow",
      description: "Take a photo to help build a rainbow collage",
      image: "http://www.publicdomainpictures.net/pictures/120000/velka/rainbow-colors-background.jpg",
      participateTemplate: "americanFlag",
      resultsTemplate: "americanFlagResults",
      notificationText: "We found an experience for you! Help us create a rainbow collage 🌈",
      contributionGroups: [{contributionTemplates: [redTemplate]},
                          {contributionTemplates: [blueTemplate]},
                          {contributionTemplates: [whiteTemplate]},
                          {contributionTemplates: [greenTemplate]},
                          {contributionTemplates: [purpleTemplate]},
                          {contributionTemplates: [orangeTemplate]},
                          {contributionTemplates: [blackTemplate]},
                          {contributionTemplates: [yellowTemplate]}],
      callbackPair: []
    });

    const incidentId = Meteor.call("api.createIncident", {
      experienceId: experienceId
    });

    Meteor.call("api.addSituationNeeds", {
      incidentId: incidentId,
      need: {
        "name": "whiteClouds",
        "contributionTemplate" : "white",
        "affordance": "clouds and daytime",
        "softStoppingCriteria": 3 //if finished but experience isn't then ignore
      }
    });
    Meteor.call("api.addSituationNeeds", {
      incidentId: incidentId,
      need: {
          "name": "redNeed",
          "contributionTemplate" : "red",
          "affordance": "grocery or hackerspace",
          "softStoppingCriteria": 3 //if finished but experience isn't then ignore
        }
    });
    Meteor.call("api.addSituationNeeds", {
      incidentId: incidentId,
      need: {
        "name": "blueNeed",
        "contributionTemplate" : "blue",
        "affordance": "clear and daytime",
        "softStoppingCriteria": 1 //if finished but experience isn't then ignore
      }
    });
    Meteor.call("api.addSituationNeeds", {
      incidentId: incidentId,
      need: {
        "name": "blackNightNeed",
        "contributionTemplate" : "black",
        "affordance": "nighttime",
        "softStoppingCriteria": 3 //if finished but experience isn't then ignore
      }
    });
    Meteor.call("api.addSituationNeeds", {
      incidentId: incidentId,
      need: {
        "name": "purpleNeed",
        "contributionTemplate" : "purple",
        "affordance": "collegeuniv",
        "softStoppingCriteria": 1 //if finished but experience isn't then ignore
      }
    });
    Meteor.call("api.addSituationNeeds", {
      incidentId: incidentId,
      need: {
        "name": "greenNeed",
        "contributionTemplate" : "green",
        "affordance": "park or grocery",
        "softStoppingCriteria": 1 //if finished but experience isn't then ignore
      }
    });
    Meteor.call("api.addSituationNeeds", {
      incidentId: incidentId,
      need: {
        "name": "orangeNeed",
        "contributionTemplate" : "orange",
        "affordance": "chicago_sheridan and daytime",
        "softStoppingCriteria": 1 //if finished but experience isn't then ignore
      }
    });
    Meteor.call("api.addSituationNeeds", {
      incidentId: incidentId,
      need: {
        "name": "yellowNeed",
        "contributionTemplate" : "yellow",
        "affordance": "grocery or hackerspace",
        "softStoppingCriteria": 1 //if finished but experience isn't then ignore
      }
    });
  }
});
