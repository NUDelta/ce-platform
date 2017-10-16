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
import { Random } from 'meteor/random'


export const testerStoryBook = new ValidatedMethod({
  name: 'api.testerStoryBook',
  validate: null,
  run(){
    console.log("RUNNING tester STORYBOOK")

    var createNewPageNeed = function(mostRecentSubmission) {
      var textId = mostRecentSubmission.content.nextAffordance;
      var nextAffordance = TextEntries.findOne({_id: textId}).text;
      Meteor.call("api.addSituationNeeds", {
        incidentId: incidentId,
        need: {
          "name": "nextScene"+ nextAffordance + Random.id(3),
          "contributionTemplate" : "scene",
          "affordance": nextAffordance,
          "softStoppingCriteria": {"total": 1}
        }
      });
    }

    var storyPageTemplate = {
      "name" : "scene",
      "contributions" : {"illustration": "Image",
                        "nextSentence": "String",
                        "nextAffordance": ["Dropdown",
                        [ ["sunny day", "clear and daytime"], ["study", "atrium or coffee or hackerspace"],
                          ["cloudy day", "clouds and daytime"], ["nightime", "nighttime"], ["drink at a bar", "bars"]
                        ]
                         ]}

    };

    console.log("about to create an experience")
    const experienceId = Meteor.call("api.createExperience", {
      name: "Storytime yay",
      description: "Write a story",
      participateTemplate: "storyPage",
      resultsTemplate: "storyPageResults",
      notificationText: "Help us illustrate and write a story!",
      notificationStrategy: "notifyOneUser",
      contributionGroups: [{contributionTemplates: [storyPageTemplate], stoppingCriteria: {"total": 8}}],
      callbackPair:[{templateName: "scene", callback: createNewPageNeed.toString()}]
    });

    const incidentId = Meteor.call("api.createIncident", {
      experienceId: experienceId
    });
    Meteor.call("api.addSituationNeeds", {
      incidentId: incidentId,
      need: {
        "name": "page0",
        "contributionTemplate" : "scene",
        "affordance": "daytime",
        "softStoppingCriteria": {"total": 1}
      }
    });
    Meteor.call("api.leggo", {incidentId: incidentId});
  }
})
