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


export const storyBook = new ValidatedMethod({
  name: 'api.storyBook',
  validate: null,
  run(){
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
                        [ ["hug a tree", "parks"], ["sunbathe", "grass and daytime and clear"], ["cloudwatch", "clouds and daytime and grass"],
                          ["nighttime", "nighttime"], ["bask in the sun", "clear and daytime"], ["stargaze", "nighttime and clear"],
                          ["daytime", "daytime"], ["cloudy", "cloudy"], ["sunny", "clear"], ["study", "atrium"], ["surf the interweb", "hackerspace"]
                        ]
                         ]}
                        // [["bask in the sun", "clouds and daytime"], ["sunbathe", "grass and daytime"],
                        // ["cloudwatch", "clouds and daytime and grass"], ["hug a tree", "trees"], 
                        // ["pick grass", "grass and daytime"], ["surf the interweb", "hackerspace"], ["pick a leaf", "parks"],
                        // ["relax in a chair", "relax_in_a_chair"], ["smell flower", "parks"], ["lie on a bench", "parks"] ]
                         //]} 
                         //, "daytime","pizza", "coffee", "chair", "train", "trees", "grass"]]}
                        //["clouds", "computer", "castle", "chair", "waves", "trees", "grass", "coffee", "train", "sailboat"]] }

    }; 
    const experienceId = Meteor.call("api.createExperience", {
      name: "Storytime",
      description: "Write a story",
      participateTemplate: "storyPage",
      resultsTemplate: "storyPageResults",
      notificationText: "Help us illustrate and write a story!",
      contributionGroups: [{contributionTemplates: [storyPageTemplate], stoppingCriteria: {"total": 5}}]
    });

    registerCallback(experienceId, "scene", createNewPageNeed);

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
    Meteor.call("api.leggo", {incidentId: incidentId, notificationStrategy: "notifyOneUser"});
  }
})
