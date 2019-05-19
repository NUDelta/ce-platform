mport { Meteor } from "meteor/meteor";

import { Submissions } from "../OCEManager/currentNeeds";

import { addContribution } from '../OCEManager/OCEs/methods';
import {Detectors} from "../UserMonitor/detectors/detectors";
import {notify, notifyUsersInIncident, notifyUsersInNeed} from "../OpportunisticCoordinator/server/noticationMethods";
import {Incidents} from "../OCEManager/OCEs/experiences";
import {Schema} from "../schema";
import {serverLog} from "../logs";
import { log } from "util";

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
  niceish_day: {
    _id: 'x7EgLErQx3qmiemqt',
    description: 'niceish_day',
    variables: ['var clouds;', 'var clear;', 'var daytime;'],
    rules: ['daytime && (clouds || clear);']
  },
  night: {
    _id: 'Wth3TB9Lcf6me6vgy',
    description: 'places where it\'s nighttime,',
    variables: ['var nighttime;'],
    rules: ['(nighttime);']
  },
  sunset: {
    _id: '44EXNzHS7oD2rbF68',
    description: 'places where it\'s sunset,',
    variables: ['var sunset;'],
    rules: ['(sunset);']
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
    rules: ['(coffeeroasteries || coffee) || ((coffeeshops || coffeeteasupplies) || cafes);']
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

/**
 * Create Storytime Helper.
 *
 * @param version [number] determines which detector comes first
 * @return {{_id: string, name: string, participateTemplate: string, resultsTemplate: string, contributionTypes: *[], description: string, notificationText: string, callbacks: *[]}}
 */
function createStorytime(version) {
  // setup places and detectors for storytime
  let places = ["niceish_day", "beer", "train", "forest", "dinning_hall", "castle", "field", "gym"];
  let detectorIds = places.map((x) => { return Random.id(); });
  let detectorNames = [];
  let dropdownText = [
    'Swirling Clouds',
    'Drinking butterbeer',
    'Hogwarts Express',
    'Forbidden Forest',
    'Dinner at the Great Hall',
    'Hogwarts Castle',
    'Quidditch Pitch',
    'Training in the Room of Requirement ',
  ];

  _.forEach(places, (place, i) => {
    let newVars = JSON.parse(JSON.stringify(DETECTORS[place]['variables']));
    newVars.push(`var participatedInStorytime${version};`);
    newVars.push(`var mechanismRich;`);
    let newRules = JSON.parse(JSON.stringify(DETECTORS[place]['rules']));
    // modify last detector rule
    // when rules has a flat structure where rules.length == 1, last rule is the predicate
    // i.e. ['(diners || restaurants || cafeteria || food_court);']
    // when rules have a nested structure where rules.length > 1, last rule is the predicate
    // i.e. ['worship_places = (buddhist_temples || churches);', '(worship_places || landmarks);']
    let lastRule = newRules.pop();
    // each rule has a `;` at end, i.e. (rain && park);
    // in order to modify the rule, must add predicate preceding the rule
    let lastRuleNoSemicolon = lastRule.split(';')[0];
    lastRule = `(mechanismRich && (!participatedInStorytime${version} && (${lastRuleNoSemicolon})));`;
    newRules.push(lastRule);

    let detectorName = `${place}_storytime${version}_mechanismRich`;
    detectorNames.push(detectorName);

    DETECTORS[detectorName] = {
      '_id': detectorIds[i],
      'description': `${DETECTORS[place].description} storytime${version} mechanismRich`,
      'variables': newVars,
      'rules': newRules
    };
  });

  // Don't assume the Random detectorIds we created actually exist
  detectorIds = detectorNames.map((name) => { return getDetectorId(DETECTORS[name]); });
  let DROPDOWN_OPTIONS = _.zip(dropdownText, detectorIds);
  // create story starting point
  let sentences = [
    'Ron looked up at the clouds swirling above him.',
    'Hermoine looked into her goblet, hardly realizing the unusual color of the concoction she was being forced to drink.',
    'Harry prepared himself for a lunge, and then dove forward towards the Platform 9 3/4 wall.',
    'The wizard looked down at their feet, hardly believing the magical plants growing in the Forbidden Forest.',
    'Any young wizard who has their first meal in the Hogwarts Great Hall has to be surprised by the type of food on the menu.',
    'Hogwarts castle had looked so good in photos, but this new wizard looked up at it unimpressed.',
    'Harry Potter saw the snitch diving towards the ground. He aimed his broom towards the grassy ground and followed, reaching his hand out to grab it.',
    'The new wizard of Dumbledore\'s Army was training very hard in the Room of Requirement.'
  ];
  let firstSentence = sentences[version];
  let [firstSituation, firstDetector] = DROPDOWN_OPTIONS[version];
  // notify users when story is complete
  let sendNotification = function (sub) {
    let uids = Submissions.find({iid: sub.iid}).fetch().map(function (x) {
      return x.uid;
    });

    notify(uids, sub.iid, 'Our story is finally complete. Click here to read it!',
      '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
  };

  /**
   * NOTE: if callback depends on any variables defined outside of its scope, we must use some solution so that
   * the variables values are substituted into the callback.toString()
   *
   * For a dynamic code generation solution,
   * @see https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string
   * @see https://medium.com/@oprearocks/serializing-object-methods-using-es6-template-strings-and-eval-c77c894651f0
   * @param sub
   */
  let storytimeCallback = function (sub) {
    Meteor.users.update({
      _id: sub.uid
    }, {
      $set: {
        ['profile.staticAffordances.participatedInStorytime${version}']: true
      }
    });

    // set affordances for storytime
    let affordance = sub.content.affordance;

    // HACKY TEMPLATE DYNAMIC CODE GENERATION
    let options = eval('${JSON.stringify(DROPDOWN_OPTIONS)}');

    let [situation, detectorId] = options.find(function(x) {
      return x[1] === affordance;
    });

    // options = options.filter(function (x) {
    //   return x[1] !== affordance;
    // });

    // add need if not all pages are done
    let needName = 'page' + Random.id(3);
    if (cb.numberOfSubmissions() === 7) {
      needName = 'pageFinal'
    }

    // create and add contribution
    let contribution = {
      needName: needName,
      situation: {
        detector: affordance,
        number: '1'
      },
      toPass: {
        instruction: sub.content.sentence,
        situation: situation,
        previousUserId: sub.uid,
        dropdownChoices: {
          name: 'affordance',
          options: options
        }
      },
      numberNeeded: 1,
      notificationDelay: 90
    };

    addContribution(sub.iid, contribution);
  };

  // FIXME(rlouie): Can't have more than version 0,1,2
  let exp_names = [
    "A Ron Weasley Story",
    "A Hermoine Granger Story",
    "A Harry Potter Story"
  ];

  // create and return storytime experience
  return {
    _id: Random.id(),
    name: exp_names[version],
    participateTemplate: 'storyPage',
    resultsTemplate: 'storybook',
    contributionTypes: [{
      needName: 'pageOne',
      situation: {
        detector: firstDetector,
        number: '1'
      },
      toPass: {
        instruction: firstSentence,
        firstSentence: firstSentence,
        situation: firstSituation,
        dropdownChoices: {
          name: 'affordance',
          options: DROPDOWN_OPTIONS
        }
      },
      numberNeeded: 1,
      notificationDelay: 90
    }],
    description: 'We\'re writing a Harry Potter spin-off story',
    notificationText: 'View this and other available experiences',
    callbacks: [
      {
        trigger: 'cb.newSubmission() && (cb.numberOfSubmissions() <= 7)',
        // substitute any variables used outside of the callback function scope
        function: eval('`' + storytimeCallback.toString() + '`'),
      },
      {
        trigger: 'cb.incidentFinished()',
        function: sendNotification.toString()
      }]
  };
}

const createIndependentStorybook = () => {

  let place_situation_delay = [
    ["niceish_day",'Swirling Clouds', 5],
    ["beer", 'Drinking butterbeer', 90],
    ["train", 'Hogwarts Express', 90],
    ["forest",'Forbidden Forest', 90],
    ["dinning_hall",'Dinner at the Great Hall', 90],
    ["castle",'Hogwarts Castle', 90],
    ["field",'Quidditch Pitch', 90],
    ["gym",'Training in the Room of Requirement', 90]
  ];

  return {
    _id: Random.id(),
    name: 'Humans of Hogwarts',
    participateTemplate: 'storyPage_noInterdependence',
    resultsTemplate: 'storyBook_noInterdependence',
    contributionTypes: addStaticAffordanceToNeeds('mechanismPoor', (function(place_situation_delay) {
      return place_situation_delay.map((x) => {
        let [place, situation, delay] = x;
        return {
          needName: situation,
          situation: {
            detector: getDetectorId(DETECTORS[place]),
            number: '1',
          },
          toPass: {
            situation: situation
          },
          numberNeeded: 2,
          notificationDelay: delay
        }
      });
    })(place_situation_delay)),
    description: 'We\'re writing a Harry Potter spin-off story',
    notificationText: 'View this and other available experiences',
    callbacks: [
      {
        trigger: 'cb.newSubmission()',
        function: (notifyUsersInIncident('Someone added to Humans of Hogwarts',
          'View photos and lines others have created')).toString()
      },
      {
        trigger: 'cb.incidentFinished()',
        function: (notifyUsersInIncident('Humans of Hogwarts has finished',
          "View everyone's photos and lines that were contributed")).toString()
      }]
  };
};

const createMurderMystery = function() {
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
    'very busy'
  ];

  //let DROPDOWN_OPTIONS = _.zip(dropdownText);

  const MurderMysteryCallback = function (sub) {
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).fetch();
    
    let participants = submissions.map((submission) => { return submission.uid; });
    
    notify(participants, sub.iid, 'See images from your group bumped experience!', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
    
  }
  
  let experience = {
    name: 'Murder Mystery',
    participateTemplate: 'mm',
    resultsTemplate: 'mmresults',
    contributionTypes: [{
      needName: 'pageOne',
      situation: {
        detector: firstDetector,
        number: '1'
      },
      toPass: {
        instruction: firstSentence,
        firstSentence: firstSentence,
        situation: firstSituation,
        dropdownChoices: {
          name: 'affordance',
          options: dropdownText
        }
      },
      numberNeeded: 1,
      notificationDelay: 90
    }
    ],
    description: "You've been invited to participate in a murder mystery!",
    notificationText: "You've been invited to participate in a murder mystery!",
    callbacks: []
  };


  const staticAffordances = ['participantOne', 'participantTwo', 'participantThree'];
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
  
  
  staticAffordances.forEach(participant => {
    experience.contributionTypes = [...experience.contributionTypes, ...addStaticAffordanceToNeeds(participant, ((places) => 
      places.map(place => {
        const [detectorName, situationDescription, instruction] = place;
        return {
          needName: `Bumped Three ${detectorName}`,
          situation: {
            detector: getDetectorId(DETECTORS[detectorName]),
            number: 1
          },
          toPass: {
            situationDescription: `Having a good time ${situationDescription}?`,
            instruction: `${instruction}`
          },
          numberNeeded: 3,
          // notificationDelay: 90 uncomment for testing
        }
      })
    )(places))];
  });
  
  return experience;
}



/** createHalfHalf
 *
 * @param numberInSituation [Integer] number of people that need to be in the same situation at the same time
 * @param notificationDelay [Integer] notificationDelay for all places
 * @returns {{name: string, participateTemplate: string, resultsTemplate: string, contributionTypes: Array, description: string, notificationText: string, callbacks: Array}}
 */
const createHalfHalf = function(
  {
    numberInSituation = 1,
    notificationDelay = 90
  } = {}
) {
  let experience = {
    name: 'Half Half Bumped',
    participateTemplate: 'halfhalfParticipate',
    resultsTemplate: 'halfhalfResults',
    contributionTypes: [],
    description: 'Participate in HalfHalf Travel: Capture your side of the story',
    notificationText: 'Participate in HalfHalf Travel: Capture your side of the story',
    callbacks: []
  };


  let completedCallback = function(sub) {
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).fetch();

    let participants = submissions.map((submission) => { return submission.uid; });

    notify(participants, sub.iid,
      `Two people completed a half half photo`,
      `See the results under ${sub.needName}`,
      '/apicustomresults/' + sub.iid + '/' + sub.eid);
  };

  let places = [
    ["bar", "at a bar", notificationDelay],
    ["coffee", "at a coffee shop", notificationDelay],
    ["grocery", "at a grocery store", notificationDelay],
    ["restaurant", "at a restaurant", notificationDelay],
    ["train", "commuting", notificationDelay],
    ["exercising", "exercising", notificationDelay]
  ];

  _.forEach(places, (place) => {

    let [detectorName, situationDescription, delay] = place;

    let need = {
      needName: `half half: ${situationDescription}`,
      situation: {
        detector: DETECTORS[detectorName]._id,
        number: numberInSituation
      },
      toPass: {
        instruction: `Having a good time ${situationDescription}? Try taking one side of a photo.`
      },
      numberNeeded: 2,
      notificationDelay: delay
    };

    let callback = {
      trigger: `cb.numberOfSubmissions("${need.needName}") % 2`,
      function: completedCallback.toString(),
    };
    experience.contributionTypes.push(need);
    experience.callbacks.push(callback)
  });

  return experience;
};

const createBumpedThree = function() {
  // console.log(DETECTORS);
  const bumpedThreeCallback = function (sub) {
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).fetch();
    
    let participants = submissions.map((submission) => { return submission.uid; });
    
    notify(participants, sub.iid, 'See images from your group bumped experience!', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
    
  }
  
  let experience = {
    name: 'Group Bumped',
    participateTemplate: 'bumpedThreeInitial',
    resultsTemplate: 'bumpedThreeResults',
    contributionTypes: [],
    description: 'Share your experience with your friend and their friend!',
    notificationText: 'Share your experience with your friend and their friend!',
    callbacks: [{
      trigger: `cb.numberOfSubmissions() === 3`,
      function: bumpedThreeCallback.toString(),
    }]
  };


  const staticAffordances = ['participantOne', 'participantTwo', 'participantThree'];
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
  
  
  staticAffordances.forEach(participant => {
    experience.contributionTypes = [...experience.contributionTypes, ...addStaticAffordanceToNeeds(participant, ((places) => 
      places.map(place => {
        const [detectorName, situationDescription, instruction] = place;
        return {
          needName: `Bumped Three ${detectorName}`,
          situation: {
            detector: getDetectorId(DETECTORS[detectorName]),
            number: 1
          },
          toPass: {
            situationDescription: `Having a good time ${situationDescription}?`,
            instruction: `${instruction}`
          },
          numberNeeded: 3,
          // notificationDelay: 90 uncomment for testing
        }
      })
    )(places))];
  });
  
  return experience;
}

const sameSituationContributionTypes = function(
  {
    numberInSituation = 1
  } = {}
) {
  return [{
    needName: 'Warm, Sunny Weather',
    situation: {
      detector: DETECTORS.sunny._id,
      number: numberInSituation
    },
    toPass: {
      instruction: 'Are you enjoying <span style="color: #0351ff">good weather today?</span> Share a photo of how you are experiencing the sun.'
    },
    numberNeeded: 50,
    notificationDelay: 1,
    allowRepeatContributions: true,
  }];
};



const create24hoursContributionTypes = function(toPassConstructor, numberNeeded) {
  let needs = [];
  for (i = 0; i < 24; i++) {
    let need = {
      needName: `hour ${i}`,
      situation: {
        detector: DETECTORS[`hour${i}`]._id,
        number: 1
      },
      toPass: toPassConstructor(i),
      numberNeeded: numberNeeded,
      notificationDelay: 1
    };
    needs.push(need);
  }
  return needs;
};

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

/** halfhalfRespawnAndNotify:
 * This is a helper function that generates a callback function definition
 * The callback will respawn or create a duplicate of the need that just completed,
 * while also sending notifications to the participants of that need.
 *
 * This function makes strong assumptions about how your OCE contributionTypes are written.
 * i.e. need.needName = 'Name of my need 1'
 * i.e. need.needName = 'Hand Silhouette 1'
 *
 * @param subject [String] subject of notification
 * @param text [String] accompanying subtext of notification
 * @return {any} A function
 */
const halfhalfRespawnAndNotify = function(subject, text) {
  functionTemplate = function (sub) {
    let contributionTypes = Incidents.findOne(sub.iid).contributionTypes;
    let need = contributionTypes.find((x) => {
      return x.needName === sub.needName;
    });

    // Convert Need Name i to Need Name i+1
    let splitName = sub.needName.split(' ');
    let iPlus1 = Number(splitName.pop()) + 1;
    splitName.push(iPlus1);
    let newNeedName = splitName.join(' ');

    need.needName = newNeedName;
    addContribution(sub.iid, need);

    let participants = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).map((submission) => {
      return submission.uid;
    });

    notify(participants, sub.iid, '${subject}', '${text}', '/apicustomresults/' + sub.iid + '/' + sub.eid);
  };
  return eval('`'+functionTemplate.toString()+'`');
};

/* recognizes when experience ends
let sendNotificationScavenger = function (sub) {
  let uids = Submissions.find({ iid: sub.iid }).fetch().map(function (x) {
    return x.uid;
  });

  notify(uids, sub.iid, 'Wooh! All the scavenger hunt items were found. Click here to see all of them.', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
};

const sendNotificationTwoHalvesCompleted = function(sub) {
  console.log("Another pair of halves completed a photo");

  let submissions = Submissions.find({
    iid: sub.iid,
    needName: sub.needName
  }).fetch();

  let participants = submissions.map((submission) => { return submission.uid; });

  notify(participants, sub.iid,
    `Two people completed a half half photo`,
    `See the results under ${sub.needName}`,
    '/apicustomresults/' + sub.iid + '/' + sub.eid);
};
*/

let CN_EXPERIENCES = {
  murder: createMurderMystery();
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
