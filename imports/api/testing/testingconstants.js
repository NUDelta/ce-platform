import { Meteor } from "meteor/meteor";

import { Submissions } from "../OCEManager/currentNeeds";

import { addContribution } from '../OCEManager/OCEs/methods';
import {Detectors} from "../UserMonitor/detectors/detectors";
import {notify, notifyUsersInIncident, notifyUsersInNeed} from "../OpportunisticCoordinator/server/noticationMethods";
import {Incidents} from "../OCEManager/OCEs/experiences";
import {Schema} from "../schema";
import {serverLog} from "../logs";
import { log } from "util";
import { Messages } from '../../api/messages/messages.js';

let LOCATIONS = {
  'park': {
    lat: 42.056838,
    lng: -87.675940
  },
  'lakefill': {
    lat: 42.054902,
    lng: -87.670197
  },
  'burgers': {
    lat: 42.046131,
    lng: -87.681559
  },
  'grocery': {
    lat: 42.047621,
    lng: -87.679488
  },
  'sushi': { // sashimi sashimi near whole foods
    lat: 42.048068,
    lng: -87.6811262
  },
  'grocery2': {
    lat: 42.039818,
    lng: -87.680088
  }
};

let USERS = {
  meg: {
    username: 'meg',
    email: 'meg@email.com',
    password: 'password',
    profile: {
      firstName: 'Meg',
      lastName: 'Grasse'
    }
  },
  andrew: {
    username: 'andrew',
    email: 'andrew@email.com',
    password: 'password',
    profile: {
      firstName: 'Andrew',
      lastName: 'Finke'
    }
  },
  josh: {
    username: 'josh',
    email: 'josh@email.com',
    password: 'password',
    profile: {
      firstName: 'Josh',
      lastName: 'Shi'
    }
  }
};

let DETECTORS = {
  night: {
    _id: 'Wth3TB9Lcf6me6vgy',
    description: 'places where it\'s nighttime,',
    variables: ['var nighttime;'],
    rules: ['(nighttime);']
  },
  daytime: {
    _id: 'tyZMZvPKkkSPR4FpG',
    description: 'places where it\'s daytime,',
    variables: ['var daytime;'],
    rules: ['daytime;']
  },
  coffee: {
    _id: 'saxQsfSaBiHHoSEYK',
    description: 'coffee',
    variables: ['var coffeeroasteries;',
    'var coffee;',
    'var cafes;',
    'var coffeeshops;',
    'var coffeeteasupplies;'
    ],
    rules: ['(coffeeroasteries || coffee) || ((coffeeshops || coffeeteasupplies) || cafes)']
  },
  busy: {
    _id: 'saxQsfSaBiHHoSEZX',
    description: 'user reports to be busy',
    variables: ['var busy;'],
    rules: ['busy;']
  },
  train: {
    _id: '2wH5bFr77ceho5BgF',
    description: 'trains',
    variables: ['var publictransport;', 'var trainstations;', 'var trains;'],
    rules: ['(trainstations || trains) || publictransport;']
  },
  rainy: {
    _id: 'puLHKiGkLCJWpKc62',
    description: 'rainy',
    variables: ['var rain;'],
    rules: ['(rain);']
  },
  sunny: {
    _id: '6vyrBtdDAyRArMasj',
    description: 'clear',
    variables: ['var clear;', 'var daytime;'],
    rules: ['(clear && daytime);']
  },
  cloudy: {
    _id: 'sorCvK53fyi5orAmj',
    description: 'clouds',
    variables: ['var clouds;', 'var daytime;'],
    rules: ['(clouds && daytime);']
  },
  hour0: {
    _id: "v2ANTJr1I7wle3Ek8",
    description: "during 00:00",
    variables: ["var hour;"],
    rules: ["hour == 0"]
  }
};

export const getDetectorId = (detector) => {
  let db_detector = Detectors.findOne({description: detector.description});
  if (db_detector) {
    console.log('getting db detector for', detector.description, 'which is', db_detector._id);
    console.log(db_detector)
    return db_detector._id;
  } else {
    console.log('getting detector for', detector.description, 'which is', detector._id);

    return detector._id;
  }
};

Meteor.methods({
  getDetectorId({name}) {
    new SimpleSchema({
      name: { type: String }
    }).validate({name});

    if (!(name in CONSTANTS.DETECTORS)) {
      throw new Meteor.Error('getDetectorId.keynotfound',
        `Detector by the name '${name}' was not found in CONSTANTS.DETECTORS`);
    }
  }
});

// this is the code that will eventually be generated by the CN compiler!
const createMurderMystery = function() {
  let values = [
  'not busy at all',
  'a little busy',
  'somewhat busy',
  'pretty busy',
  'very busy'
  ];
  // console.log(DETECTORS);
  /*
  let places = ["coffee", "coffee", "coffee", "coffee", "coffee",];
  let detectorIds = places.map((x) => { return Random.id(); });
  let detectorNames = [];
  */
  let dropdownText = [
  'not busy at all',
  'a little busy',
  'somewhat busy',
  'pretty busy',
  'busy'
  ];
  /*
  let questions = [
    "How busy is the coffee shop right now?",
    "Name an interesting option on the menu",
    "What did you order?"
  ]
  */
  let question1 = "How busy is the coffee shop right now?"
  let question2 = "Name an interesting option on the menu"
  let question3 = "What did you order?"

  let DROPDOWN_OPTIONS = _.zip(dropdownText);

  const MurderMysteryCallback = function (sub) {
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).fetch();

    console.log("in callback")
    console.log(submissions.length)

    experience = Experiences.update({
      "_id": sub.eid
    }, {
      "$set": {
        "participateTemplate": "murderMysteryChat"
      }
    })



    for (let i = 0; i < submissions.length; i++) {
      console.log("busyness: " + submissions[i].content.busy)
      var key = submissions[i].content.busy;
      var affordances = {}
      affordances[key] = true;
      console.log("staticAffordances: " + affordances.key)
      Meteor.users.update({
        _id: submissions[i].uid
      }, {
        $set: {
          ['profile.staticAffordances.' + key]: true
          
        }
      });

      //find instance of CN that the submission came from
      let instance = Incidents.findOne(submissions[i].iid);
      console.log("detector ID: " + instance.contributionTypes[0].situation.detector)
      let detector_id = instance.contributionTypes[0].situation.detector
      console.log("detector rules: " + Detectors.findOne(detector_id).rules)
      let rules = Detectors.findOne(detector_id).rules;

      let participant = Meteor.users.findOne(submissions[i].uid);

      let others = Meteor.users.find({
        "profile.pastIncidents": submissions[i].iid
      }).fetch()

      let other_participants = []

      console.log("others length: " + others.length)

      for (let i = 0; i < others.length; i++) {
        let other = others[i]
        console.log("other: " + other.profile.firstName)
        console.log("participant: " + participant.profile.firstName)
        //in the future, need to account for when participants have the same first name (use UID instead)
        if (other.profile.firstName != participant.profile.firstName) {
          other_participants.push(other.profile.firstName)
          console.log("other: " + other.profile.firstName + " " + other_participants.length)
        }
      }

      console.log("participants: " + participant);

      //need to figure out a way to get other users in same experience
      //let others = ""

      //check to see how busy the user is
      let character = []
      if (participant.profile.staticAffordances.busy) {
        console.log("casting a murderer")
        rules = submissions[i].content.busy + " && " + rules
        //rules += " && " + submissions[i].content.busy + ";"
        //rules = addStaticAffordanceToDetector(submissions[i].content.busy, instance.contributionTypes[0].situation.detector)
        character.push([rules, "murderer", "murderMysteryChat", "Try to avoid being caught and weasel your way out of the clues!", participant.profile.firstName, other_participants])
      } else {
        console.log("casting an innocent")
        rules = submissions[i].content.busy + " && " + rules
        //rules += " && " + submissions[i].content.busy + ";"
        //rules = addStaticAffordanceToDetector(submissions[i].content.busy, instance.contributionTypes[0].situation.detector)
        character.push([rules, "innocent", "murderMysteryChat", "Try to prove your innocence and find the real murderer!", participant.profile.firstName, other_participants])
      }

      console.log("character length" + character.length)

      let extraAffordances = []

      extraAffordances.push(submissions[i].content.busy)

      _.forEach(character, (charac) => {

        let [detectorName, role, template, instruction, user, others] = charac;

        var need = {
          needName: "Murder Mystery" + role,
          situation: {
            detector: detectorName,
            number: 2
          },
          participateTemplate: template,
          toPass: {
            role: role,
            instruction: instruction,
            user: user,
            dropdownChoices: {
              name: others,
              options: others
            }
          },
          numberNeeded: 2
        };
        //next_experience.contributionTypes.push(need)
        addContribution(sub.iid, need);
        console.log("more needs" + instance.contributionTypes.length)

        Meteor.call("sendWhisper", role, user, (error, response) => {
          if (error) {
            alert(error.reason);
          } else {
            //Cookie.set("name", response.name);
            $input.val("");
          }
        })
      });

    }

    //which way to find participants and set this.toPass.characterName?
    // let participants = submissions.map((submission) => { return submission.uid; });

    // let participant = Meteor.users.findOne({
    //   "_id": sub.uid,
    // })



    // let max = submissions[0]

    // for (let i = 0; i < submissions.length; i++) {

    //   if (submissions[i].content.busy >= max.content.busy) {
    //     max = submissions[i]
    //   }
    // }


    
  }
  
  let experience = {
    name: 'Murder Mystery',
    participateTemplate: 'murderMysteryInitial',
    resultsTemplate: 'murderMysteryChat',
    contributionTypes: [
    ],
    description: "You've been invited to participate in a murder mystery!",
    notificationText: "You've been invited to participate in a murder mystery!",
    callbacks: [{
      trigger: 'cb.newSubmission() && (cb.numberOfSubmissions() == 3)',
        // substitute any variables used outside of the callback function scope
        function: eval('`' + MurderMysteryCallback.toString() + '`'),
      }]
    };


    const staticAffordances = ['cn'];
    const places = [
    ["coffee", "at a coffee shop", "Please help us build the story by answering some initial questions about your situation!"],
    ];

  // const needs = places.map(place => {
  //   const [detectorName, situationDescription, instruction] = place;
  //   return {
  //     needName: `Bumped Three ${detectorName}`,
  //     situation: {
  //       detector: getDetectorId(DETECTORS[detectorName]),
  //       number: '1'
  //     },
  //     toPass: {
  //       situationDescription: `Having a good time ${situationDescription}?`,
  //       instruction: `${instruction}`
  //     },
  //     numberNeeded: 3,
  //     // notificationDelay: 90 uncomment for testing
  //   }
  // });


staticAffordances.forEach(affordance => {
  experience.contributionTypes = [...experience.contributionTypes, ...addStaticAffordanceToNeeds(affordance, ((places) => 
    places.map(place => {
      const [detectorName, situationDescription, instruction] = place;
      return {
        needName: `Murder Mystery ${detectorName}`,
        situation: {
          detector: getDetectorId(DETECTORS[detectorName]),
          number: 3
        },
        participateTemplate: 'murderMysteryInitial',
        toPass: {
          situationDescription: `Having a good time ${situationDescription}?`,
          instruction: `${instruction}`,
          question1: `${question1}`,
          question2: `${question2}`,
          question3: `${question3}`,
          dropdownChoices: {
            name: values,
            options: DROPDOWN_OPTIONS
          }
        },
        numberNeeded: 3,
          // notificationDelay: 90 uncomment for testing
        }
      })
    )(places))];
});

return experience;
}


/**
 * Side effect: Changes the global DETECTORS object, adding another detector with key "detectorKey_staticAffordance"
 *
 * @param staticAffordance
 * @param detectorKey
 * @returns newDetectorKey
 */

 const addStaticAffordanceToDetector = function(staticAffordance, detectorKey) {
  let newVars = JSON.parse(JSON.stringify(DETECTORS[detectorKey]['variables']));
  newVars.push(`var ${staticAffordance};`);
  let newRules = JSON.parse(JSON.stringify(DETECTORS[detectorKey]['rules']));
  // modify last detector rule
  // when rules has a flat structure where rules.length == 1, last rule is the predicate
  // i.e. ['(diners || restaurants || cafeteria || food_court);']
  // when rules have a nested structure where rules.length > 1, last rule is the predicate
  // i.e. ['worship_places = (buddhist_temples || churches);', '(worship_places || landmarks);']
  let lastRule = newRules.pop();
  // each rule has a `;` at end, i.e. (rain && park);
  // in order to modify the rule, must add predicate preceding the rule
  let lastRuleNoSemicolon = lastRule.split(';')[0];
  lastRule = `(${staticAffordance} && (${lastRuleNoSemicolon}));`;
  newRules.push(lastRule);

  let newDetectorKey = `${detectorKey}_${staticAffordance}`;
  // Change DETECTORS if newDetectorKey does not already exist (some experiences might have already created coffee_mechanismRich, for example)
  if (!(newDetectorKey in DETECTORS)) {
    DETECTORS[newDetectorKey] = {
      '_id': Random.id(),
      'description': `${DETECTORS[detectorKey].description} ${staticAffordance}`,
      'variables': newVars,
      'rules': newRules
    };
  }
  console.log( DETECTORS[newDetectorKey].description,  DETECTORS[newDetectorKey]._id);
  return newDetectorKey;
};

/**
 *
 * @param staticAffordances [String] the affordance to add
 *        i.e. 'mechanismRich'
 * @param contributionTypes [Array] list of all the needs by which to modify
 * @return
 */
 const addStaticAffordanceToNeeds = function(staticAffordance, contributionTypes) {
  return _.map(contributionTypes, (need) => {
    let detectorKey;
    _.forEach(_.keys(DETECTORS), (key) => {
      if (DETECTORS[key]._id === need.situation.detector) {
        detectorKey = key;
      }
    });
    // WILL THROW ERROR if we don't find the matching detector id

    let newDetectorKey = addStaticAffordanceToDetector(staticAffordance, detectorKey);
    need.situation.detector = DETECTORS[newDetectorKey]._id;
    console.log('adding to need', newDetectorKey, DETECTORS[newDetectorKey]._id);
    return need;
  });
};

/**
 *
 * @param contributionTypes
 * @param triggerTemplate [String] should be written as a string, with ES6 templating syntax
 *        i.e. "cb.newSubmission(\"${need.needName}\")"
 *        If using templating syntax, you have access to the each individual need object
 * @param sendNotificationFn
 */
 const notifCbForMultiNeeds = function(contributionTypes, triggerTemplate, sendNotificationFn) {
  return contributionTypes.map((need) => {
    return {
      trigger: eval('`' + triggerTemplate + '`'),
      function: sendNotificationFn.toString()
    };
  });
};

let EXPERIENCES = {
  murder: createMurderMystery()
};

export const CONSTANTS = {
  'LOCATIONS': LOCATIONS,
  'USERS': USERS,
  // Comment out if you would like to only test specific experiences
  // 'EXPERIENCES': (({ halfhalfEmbodiedMimicry }) => ({ halfhalfEmbodiedMimicry }))(EXPERIENCES),
  'EXPERIENCES': EXPERIENCES,
  // 'EXPERIENCES': TRIADIC_EXPERIENCES,
  'DETECTORS': DETECTORS
};
