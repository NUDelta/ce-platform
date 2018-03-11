import {Submissions} from "../submissions/submissions";
import { CONSTANTS} from "./testingconstants";
import {Detectors} from "../detectors/detectors";
import {createIncidentFromExperience, startRunningIncident} from "../incidents/methods";
import {Experiences} from "../experiences/experiences";
import {Incidents} from "../incidents/incidents";

Meteor.methods({
  startFreshBumped(){
    createNewBumped();
  },
  startFreshStorytime(){
    createNewStorytime();
  },
  startFreshNatureHunt(){
    createNewNatureHunt();
  }
});

function createNewBumped(){
  let experience = {
    name: 'Bumped',
    participateTemplate: 'bumped',
    resultsTemplate: 'bumpedResults',
    contributionTypes: [ ],
    description: 'You just virtually bumped into someone!',
    notificationText: 'You just virtually bumped into someone!',
    callbacks: []
  };

  let bumpedCallback = function (sub) {
    let otherSub = Submissions.findOne({
      uid: {$ne: sub.uid},
      iid: sub.iid,
      needName: sub.needName
    });

    notify([sub.uid, otherSub.uid], sub.iid, 'See a photo from who you bumped into!', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
  };


  let places = [['bar','bar'], ['coffee', 'coffee shop'], ['grocery', 'grocery store'], ['restaurant', "restaurant"]];
    _.forEach(places, (place)=>{

      let newVars = JSON.parse(JSON.stringify(CONSTANTS.DETECTORS[place[0]]['variables']));
      newVars.push('var lovesDTR;');
      newVars.push('var lovesDTRAlumni;');

      let detector = {
        '_id': Random.id(),
        'description': CONSTANTS.DETECTORS[place[0]].description + "lovesDTR_lovesDTRAlumni",
        'variables': newVars,
        'rules': [ '(' + CONSTANTS.DETECTORS[place[0]].rules[0] + ' && (lovesDTR || lovesDTRAlumni) );' ]
      };
      CONSTANTS.DETECTORS[place[0]+"lovesDTR_lovesDTRAlumni"] = detector;
      Detectors.insert(detector);

      for(let i =0; i < 10; i++) {

        let need = {
          needName: place[0] + "lovesDTR_lovesDTRAlumni" + i,
          situation: {detector: detector._id, number: '2'},
          toPass: {instruction: 'You are at a  ' + place[1] + ' at the same time as '},
          numberNeeded: 2
        };
        let callback = {
          trigger: 'cb.numberOfSubmissions(\'' + place[0] + "lovesDTR_lovesDTRAlumni" + i + '\') === 2',
          function: bumpedCallback.toString(),
        };

        experience.contributionTypes.push(need);
        experience.callbacks.push(callback)
      }
    });

  Experiences.insert(experience);
  let incident = createIncidentFromExperience(experience);
  startRunningIncident(incident);



}


function createNewStorytime(){

  let exp = {
    "_id": Random.id(),
    "name": "Storytime",
    "participateTemplate": "storyPage",
    "resultsTemplate": "storybook",
    "contributionTypes": [
      {
        "needName": "pageOne",
        "situation": {
          "detector": "x7EgLErQx3qmiemqt",
          "number": 1
        },
        "toPass": {
          "instruction": "Harry Potter looked up at the clouds swirling above him.",
          "firstSentence": "Harry Potter looked up at the clouds swirling above him.",
          "dropdownChoices": {
            "name": "affordance",
            "options": [
              [
                "Drinking butterbeer",
                "N3uajhH3chDssFq3r"
              ],
              [
                "Hogwarts Express at Platform 9 3/4",
                "Ly9vMvepymC4QNJqA"
              ],
              [
                "Sneaking around at night under the invisibility cloak",
                "AcstpXRyNFhmgPDfF"
              ],
              [
                "Dinner at the Great Hall",
                "AKxSxuYBFqKP3auie"
              ],
              [
                "Hogwarts Castle",
                "LTnK6z94KQTJKTmZ8"
              ],
              [
                "Training in the Room of Requirement ",
                "H5P9ga8HHpCbxBza8"
              ]
            ]
          }
        },
        "numberNeeded": 1
      }
    ],
    "description": "We're writing a Harry Potter spinoff story!",
    "notificationText": "Help us write a story!",
    "callbacks": [
      {
        "trigger": "cb.newSubmission() && (cb.numberOfSubmissions() <= 7)",
        "function": "function (sub) {                                                                           // 445\n    Meteor.users.update({                                                                                            // 447\n      _id: sub.uid                                                                                                   // 448\n    }, {                                                                                                             // 447\n      $set: {                                                                                                        // 450\n        'profile.staticAffordances.participatedInStorytime': true                                                    // 450\n      }                                                                                                              // 450\n    });                                                                                                              // 449\n    var affordance = sub.content.affordance;                                                                         // 453\n    var options = [['Drinking butterbeer', CONSTANTS.DETECTORS.beer_storytime._id], ['Hogwarts Express at Platform 9 3/4', CONSTANTS.DETECTORS.train_storytime._id], ['Forbidden Forest', CONSTANTS.DETECTORS.forest_storytime._id], ['Dinner at the Great Hall', CONSTANTS.DETECTORS.dinning_hall_storytime._id], ['Hogwarts Castle', CONSTANTS.DETECTORS.castle_storytime._id], ['Quidditch Pitch', CONSTANTS.DETECTORS.field_storytime._id], ['Training in the Room of Requirement ', CONSTANTS.DETECTORS.gym_storytime._id]];\n    options = options.filter(function (x) {                                                                          // 464\n      return x[1] !== affordance;                                                                                    // 465\n    });                                                                                                              // 466\n    var needName = 'page' + Random.id(3);                                                                            // 468\n                                                                                                                     //\n    if (cb.numberOfSubmissions() == 7) {                                                                             // 469\n      needName = 'pageFinal';                                                                                        // 470\n    }                                                                                                                // 471\n                                                                                                                     //\n    var contribution = {                                                                                             // 472\n      needName: needName,                                                                                            // 473\n      situation: {                                                                                                   // 473\n        detector: affordance,                                                                                        // 473\n        number: '1'                                                                                                  // 473\n      },                                                                                                             // 473\n      toPass: {                                                                                                      // 474\n        instruction: sub.content.sentence,                                                                           // 475\n        dropdownChoices: {                                                                                           // 476\n          name: 'affordance',                                                                                        // 476\n          options: options                                                                                           // 476\n        }                                                                                                            // 476\n      },                                                                                                             // 474\n      numberNeeded: 1                                                                                                // 477\n    };                                                                                                               // 472\n    addContribution(sub.iid, contribution);                                                                          // 479\n  }"
      },
      {
        "trigger": "cb.incidentFinished()",
        "function": "function (sub) {                                                                            // 512\n    var uids = Submissions.find({                                                                                    // 513\n      iid: sub.iid                                                                                                   // 513\n    }).fetch().map(function (x) {                                                                                    // 513\n      return x.uid;                                                                                                  // 514\n    });                                                                                                              // 515\n    notify(uids, sub.iid, 'Our story is finally complete. Click here to read it!', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);\n  }"
      }
    ]
  };
  Experiences.insert(exp);
  let incident = createIncidentFromExperience(exp);
  startRunningIncident(incident);

}

function createNewNatureHunt(){
  let exp = {
    "_id": Random.id(),
    "name": "Nature Scavenger Hunt",
    "participateTemplate": "scavengerHuntParticipate",
    "resultsTemplate": "scavengerHunt",
    "contributionTypes": [
    {
      "needName": "tree",
      "situation": {
        "detector": "FfZnzP72ip4SLY4eR",
        "number": 1
      },
      "toPass": {
        "instruction": "Can you take a photo of a tree?"
      },
      "numberNeeded": 1
    },
    {
      "needName": "leaf",
      "situation": {
        "detector": "FfZnzP72ip4SLY4eR",
        "number": 1
      },
      "toPass": {
        "instruction": "Can you take a photo of a leaf?"
      },
      "numberNeeded": 1
    },
    {
      "needName": "grass",
      "situation": {
        "detector": "rEbK6WMQnPPAGAXMX",
        "number": 1
      },
      "toPass": {
        "instruction": "Can you take a photo of the grass?"
      },
      "numberNeeded": 1
    },
    {
      "needName": "lake",
      "situation": {
        "detector": "9iEpW4mb4ysHY5thP",
        "number": 1
      },
      "toPass": {
        "instruction": "Can you take a photo of the lake?"
      },
      "numberNeeded": 1
    },
    {
      "needName": "moon",
      "situation": {
        "detector": "Wth3TB9Lcf6me6vgy",
        "number": 1
      },
      "toPass": {
        "instruction": "Can you take a photo of the moon?"
      },
      "numberNeeded": 1
    },
    {
      "needName": "sun",
      "situation": {
        "detector": "6vyrBtdDAyRArMasj",
        "number": 1
      },
      "toPass": {
        "instruction": "Can you take a photo of a the sun?"
      },
      "numberNeeded": 1
    },
    {
      "needName": "blueSky",
      "situation": {
        "detector": "6vyrBtdDAyRArMasj",
        "number": 1
      },
      "toPass": {
        "instruction": "Can you take a photo of the blue sky?"
      },
      "numberNeeded": 1
    },
    {
      "needName": "clouds",
      "situation": {
        "detector": "sorCvK53fyi5orAmj",
        "number": 1
      },
      "toPass": {
        "instruction": "Can you take a photo of the clouds?"
      },
      "numberNeeded": 1
    },
    {
      "needName": "puddle",
      "situation": {
        "detector": "puLHKiGkLCJWpKc62",
        "number": 1
      },
      "toPass": {
        "instruction": "Can you take a photo of the puddle?"
      },
      "numberNeeded": 1
    }
  ],
    "description": "Help us complete a nature scavenger hunt",
    "notificationText": "Help us out with our nature scavenger hunt",
    "callbacks": [
    {
      "trigger": "cb.incidentFinished()",
      "function": "function (sub) {                                                                     // 611\n  var uids = Submissions.find({                                                                                      // 612\n    iid: sub.iid                                                                                                     // 612\n  }).fetch().map(function (x) {                                                                                      // 612\n    return x.uid;                                                                                                    // 613\n  });                                                                                                                // 614\n  notify(uids, sub.iid, 'Wooh! All the scavenger hunt items were found. Click here to see all of them.', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);\n}"
    }
  ]
  };

  Experiences.insert(exp);
  let incident = createIncidentFromExperience(exp);
  startRunningIncident(incident);

}