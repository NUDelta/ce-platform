import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Experiences } from '../experiences/experiences.js';
import { Schema } from '../schema.js';

import { Locations } from '../locations/locations.js';
import { Submissions } from '../submissions/submissions.js';

import { TextEntries } from '../text-entries/text-entries.js';

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
      console.log("hi we r here")
      var textId = mostRecentSubmission.content.nextAffordance;
      console.log("hi we got", textId)

      var nextAffordance = TextEntries.findOne({_id: textId}).text;
      console.log("i feel like we dont get here")
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
                        [ ["bask in sun", "clear and daytime"], ["study", "atrium or coffee or hackerspace"],
                          ["cloud watch", "clouds and daytime"],
                          ["buy food", "grocery"], ["watch the rain", "rain and daytime"],
                          ["people watch", "atrium or coffee or hackerspace"],["work out", "gym"],
                          ["pass by noisy construction", "chicago_sheridan and daytime"],
                        ]
                         ]}

    };

    console.log("about to create an experience")
    const experienceId = Meteor.call("api.createExperience", {
      name: "Help us illustrate and write a collaborative story",
      image: "https://cnet3.cbsistatic.com/img/0g1dNigk0BNakKeWo1EKCYm7GXw=/fit-in/970x0/2015/04/24/4bed63b8-48cf-4327-8618-811a3179c921/jcblog459.jpg",
      description: "We found an experience for you! Illustrate and write a collaborative story",
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
