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

export const thanksgiving = new ValidatedMethod({
  name: 'api.thanksgiving',
  validate: null,
  run(){
    var groceryShopTemplate = {
      "name" : "grocery_shop",
      "contributions" : {"photo": "Image", "sentence": "String"},
    };
    var shoppingTemplate = {
      "name" : "shopping",
      "contributions" : {"photo": "Image", "sentence": "String"},
    };
    var barsTemplate = {
      "name" : "bars",
      "contributions" : {"photo": "Image", "sentence": "String"},
    };
    var feastTemplate = {
      "name" : "feast",
      "contributions" : {"photo": "Image", "sentence": "String"},
    };
    var airportTemplate = {
      "name" : "airport",
      "contributions" : {"photo": "Image", "sentence": "String"},
    };
    var drinksTemplate = {
      "name" : "drinks",
      "contributions" : {"photo": "Image", "sentence": "String"},
    };

    console.log("gonna call to create a thanksgiving experience")
    const experienceId = Meteor.call("api.createExperience", {
      name: "Thanksgiving Break",
      description: "Take a photo to share what you're doing this Thanksgiving break",
      image: "https://publicholidays-us.akamaized.net/wp-content/uploads/2012/10/USA_Thanksgiving_1920_800.jpg",
      participateTemplate: "thanksgiving",
      resultsTemplate: "thanksgivingResults",
      notificationText: "We found an experience for you! Help us create a Thanksgiving break collage 🦃",
      contributionGroups: [{contributionTemplates: [groceryShopTemplate]},
                          {contributionTemplates: [shoppingTemplate]},
                          {contributionTemplates: [barsTemplate]},
                          {contributionTemplates: [feastTemplate]},
                          {contributionTemplates: [airportTemplate]},
                          {contributionTemplates: [drinksTemplate]}],
      callbackPair: []
    });

    const incidentId = Meteor.call("api.createIncident", {
      experienceId: experienceId
    });

    Meteor.call("api.addSituationNeeds", {
      incidentId: incidentId,
      need: {
        "name": "groceryNeed",
        "contributionTemplate": "grocery_shop",
        // "affordance": "grocery or costco",
        "affordance": "nighttime",
        "softStoppingCriteria": 3
      }
    });
    Meteor.call("api.addSituationNeeds", {
      incidentId: incidentId,
      need: {
          "name": "shoppingNeed",
          "contributionTemplate": "shopping",
          // "affordance": "womenscloth or menscloth or deptstores",
          "affordance": "nighttime",
          "softStoppingCriteria": 3
        }
    });
    Meteor.call("api.addSituationNeeds", {
      incidentId: incidentId,
      need: {
        "name": "barsNeed",
        "contributionTemplate": "bars",
        "affordance": "sportsbars or pubs or divebars or bars or beerbar or cocktailbars or irish_pubs",
        "softStoppingCriteria": 2
      }
    });
    Meteor.call("api.addSituationNeeds", {
      incidentId: incidentId,
      need: {
        "name": "feastNeed",
        "contributionTemplate": "feast",
        "affordance": "chinese or hotpot or newamerican or japanese or sushi or desserts or seafood or asianfusion or pizza or italian or latin or mexican",
        "softStoppingCriteria": 5
      }
    });
    Meteor.call("api.addSituationNeeds", {
      incidentId: incidentId,
      need: {
        "name": "airportNeed",
        "contributionTemplate": "airport",
        // "affordance": "airports or airportlounges",
        "affordance": "nighttime",
        "softStoppingCriteria": 3
      }
    });
    Meteor.call("api.addSituationNeeds", {
      incidentId: incidentId,
      need: {
        "name": "drinksNeed",
        "contributionTemplate": "drinks",
        "affordance": "coffee or bubbletea",
        "softStoppingCriteria": 3
      }
    });
  }
});
