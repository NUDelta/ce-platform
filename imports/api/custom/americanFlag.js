import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Experiences } from '../experiences/experiences.js';
import { Schema } from '../schema.js';

import { Locations } from '../locations/locations.js';
import { Submissions } from '../submissions/submissions.js';

import { Users } from '../users/users.js';
import { _ } from 'meteor/underscore';

import { Incidents } from '../incidents/incidents.js';

import { registerCallback } from '../activator/methods.js';

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
    const experienceId = Meteor.call("api.createExperience", {
      name: "FLAGTEST",
      description: "Build a flag",
      participateTemplate: "americanFlag",
      resultsTemplate: "americanFlagResults",
      notificationText: "blah",
      contributionGroups: [{contributionTemplates: [redTemplate], stoppingCriteria: {"total": 1}},
                          {contributionTemplates: [blueTemplate], stoppingCriteria: {"total": 1}},
                          {contributionTemplates: [whiteTemplate], stoppingCriteria: {"total": 1}}]
    });
    console.log(experienceId)
    const incidentId = Meteor.call("api.createIncident", {
      experienceId: experienceId
    });

    Meteor.call("api.addSituationNeeds", {
      incidentId: incidentId,
      need: {
        "name": "whiteNeed",
        "contributionTemplate" : "white",
        "affordance": "clouds",
        "softStoppingCriteria": {"total": 1} //if finished but experience isn't then ignore
      }
    });
    Meteor.call("api.addSituationNeeds", {
      incidentId: incidentId,
      need: {
          "name": "redNeed",
          "contributionTemplate" : "red",
          "affordance": "grocery",
          "softStoppingCriteria": {"total": 1} //if finished but experience isn't then ignore
        }
    });
    Meteor.call("api.addSituationNeeds", {
      incidentId: incidentId,
      need: {
        "name": "california",
        "contributionTemplate" : "blue",
        "affordance": "beaches",
        "softStoppingCriteria": {"total": 1} //if finished but experience isn't then ignore
      }
    });
    Meteor.call("api.leggo", {incidentId: incidentId, notificationStrategy: "greedyOrganization"});
  }
});
