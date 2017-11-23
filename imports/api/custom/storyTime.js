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
                        [ ["spy on strangers", "coffee or newamerican or chinese"], ["chomp on food", "newamerican or chinese or italian or thai or mexican or latin or dessert or hotpot or asianfusion or pizza"],
                          ["enjoy a sunny day", "clear and daytime"], ["browse vodka selection", "grocery or beer_and_wine"], ["look at the nightsky", "nighttime"]
                        ]
                         ]}
    };

    const experienceId = Meteor.call("api.createExperience", {
      name: "Storytime",
      description: "Help us illustrate and write a collaborative story",
      image: "https://cnet3.cbsistatic.com/img/0g1dNigk0BNakKeWo1EKCYm7GXw=/fit-in/970x0/2015/04/24/4bed63b8-48cf-4327-8618-811a3179c921/jcblog459.jpg",
      participateTemplate: "storyPage",
      resultsTemplate: "storyPageResults",
      notificationText: "We found an experience for you! Help us illustrate and write a collaborative story 📖",
      notificationStrategy: "notifyOneUser",
      contributionGroups: [{contributionTemplates: [storyPageTemplate], stoppingCriteria: {"total": 7}}],
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
        "affordance": "clear and daytime",
        "softStoppingCriteria": {"total": 1}
      }
    });
  }
})
