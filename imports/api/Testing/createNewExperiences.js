import { Meteor } from "meteor/meteor";

import { Submissions } from "../OCEManager/currentNeeds";
import { Detectors } from "../UserMonitor/detectors/detectors";
import { Experiences, Incidents } from "../OCEManager/OCEs/experiences";

import { CONSTANTS } from "./testingconstants";
import { addContribution, createIncidentFromExperience, startRunningIncident } from "../OCEManager/OCEs/methods";


Meteor.methods({
  startFreshBumped() {
    let experience = CONSTANTS.EXPERIENCES.bumped;
    Experiences.insert(experience);
    let incident = createIncidentFromExperience(experience);
    startRunningIncident(incident);
  },
  startFreshStorytime() {
    let exp = CONSTANTS.EXPERIENCES.storyTime;
    Experiences.insert(exp);
    let incident = createIncidentFromExperience(exp);
    startRunningIncident(incident);
  },
  startFreshNatureHunt() {
    let exp = CONSTANTS.EXPERIENCES.natureHunt;
    Experiences.insert(exp);
    let incident = createIncidentFromExperience(exp);
    startRunningIncident(incident);
  },
  startFreshFoodFight() {
    let exp = CONSTANTS.EXPERIENCES.foodfight;
    Experiences.insert(exp);
    let incident = createIncidentFromExperience(exp);
    startRunningIncident(incident);
  },
  startHalfHalfDay() {
    let exp = CONSTANTS.EXPERIENCES.halfhalfDay;
    Experiences.insert(exp);
    let incident = createIncidentFromExperience(exp);
    startRunningIncident(incident);
  },
  startHalfHalfNight() {
    let exp = CONSTANTS.EXPERIENCES.halfhalfNight;
    Experiences.insert(exp);
    let incident = createIncidentFromExperience(exp);
    startRunningIncident(incident);
  }
});

/* FIXME: Experiences are not workable, as the detector ids have changed
 * TODO: Write a storytime construction helper / macro which can generate different versions of storytime structure
function createNewSpookyStorytime() {
  let storytimeCallback = function(sub) {
    Meteor.users.update(
      {
        _id: sub.uid
      },
      {
        $set: {
          "profile.staticAffordances.participatedInSpookyStorytime": true
        }
      }
    );

    let affordance = sub.content.affordance;

    let options = [
      ["Wolves howling at a full moon", "Dw9z8eTBvvF6EeqaR"],
      ["Ominous clouds swirling above", "eqsBY5BBRZsFWfsS4"],
      ["Deserted neighborhood businesses", "Hewrfn8R87Z9EfjKh"],
      ["Eerily quiet day", "eqsBY5BBRZsFWfsS4"],
      ["Night falling a little too quickly", "3EML6ZvzjiKTK3Myy"],
      ["Haunted coffee shop", "vj4M9wajY9HzgmM48"]
    ];

    // remove options just chosen
    options = options.filter(function(x) {
      return x[1] !== affordance;
    });

    let needName = "page" + Random.id(3);

    // done so you can use a different callback on last page
    if (cb.numberOfSubmissions() === 7) {
      needName = "pageFinal";
    }

    // need = contribution
    let contribution = {
      needName: needName,
      situation: { detector: affordance, number: "1" },
      toPass: {
        instruction: sub.content.sentence,
        dropdownChoices: { name: "affordance", options: options }
      },
      numberNeeded: 1
    };
    addContribution(sub.iid, contribution);
  };

  let places = ["night", "niceish_day", "restaurant", "sunset", "coffee"];
  let detectorIds = [
    "Dw9z8eTBvvF6EeqaR",
    "eqsBY5BBRZsFWfsS4",
    "Hewrfn8R87Z9EfjKh",
    "XHj47XpSWEE6Yrmm4",
    "3EML6ZvzjiKTK3Myy",
    "vj4M9wajY9HzgmM48"
  ];
  let i = 0;
  _.forEach(places, place => {
    let newVars = JSON.parse(
      JSON.stringify(CONSTANTS.DETECTORS[place]["variables"])
    );
    newVars.push("var participatedInSpookyStorytime;");

    let det = {
      _id: detectorIds[i],
      description: CONSTANTS.DETECTORS[place].description + "_SpookyStorytime",
      variables: newVars,
      rules: [
        "(" +
          CONSTANTS.DETECTORS[place].rules[0] +
          " ) && !participatedInSpookyStorytime;"
      ]
    };
    Detectors.insert(det);

    i++;
  });

  let dropdownOptions = [
    ["Wolves howling at a full moon", "Dw9z8eTBvvF6EeqaR"],
    ["Ominous clouds swirling above", "eqsBY5BBRZsFWfsS4"],
    ["Deserted neighborhood businesses", "Hewrfn8R87Z9EfjKh"],
    ["Eerily quiet day", "XHj47XpSWEE6Yrmm4"],
    ["Night falling a little too quickly", "3EML6ZvzjiKTK3Myy"],
    ["Haunted coffee shop", "vj4M9wajY9HzgmM48"]
  ];

  let firstSentence =
    "Something was happening in this small town of seemingly happy people.";

  let sendNotification = function(sub) {
    let uids = Submissions.find({ iid: sub.iid }).fetch().map(function(x) {
      return x.uid;
    });
    notify(
      uids,
      sub.iid,
      "Our spooky story is finally complete. Click here to read it!",
      "",
      "/apicustomresults/" + sub.iid + "/" + sub.eid
    );
  };

  let exp = {
    _id: "Qeeb9pTQDviBuv5Dd", //Random.id(),
    name: "Spooky Storytime",
    participateTemplate: "storyPage",
    resultsTemplate: "storybook",
    contributionTypes: [
      {
        needName: "pageOne",
        situation: { detector: "x7EgLErQx3qmiemqt", number: "1" },
        toPass: {
          instruction: firstSentence,
          firstSentence: firstSentence,
          dropdownChoices: {
            name: "affordance",
            options: dropdownOptions
          }
        },
        numberNeeded: 1
      }
    ],
    description: "We're writing a spooky story",
    notificationText: "Help write a spooky story!",
    callbacks: [
      {
        trigger: "cb.newSubmission() && (cb.numberOfSubmissions() <= 7)",
        function: storytimeCallback.toString()
      },
      {
        trigger: "cb.incidentFinished()",
        function: sendNotification.toString()
      }
    ]
  };

  Experiences.insert(exp);
  let incident = createIncidentFromExperience(exp);
  startRunningIncident(incident);
}

function createNewSpookyNevilleStorytime() {
  let storytimeCallback = function(sub) {
    Meteor.users.update(
      {
        _id: sub.uid
      },
      {
        $set: {
          "profile.staticAffordances.participatedInSpookyHarryStorytime": true
        }
      }
    );

    let affordance = sub.content.affordance;

    let options = [
      [
        "Sneaking around in the invisibility cloak after hours",
        "F8YqP3AEbyguQMJ9i"
      ],
      ["Werewolves howling at the moon", "F8YqP3AEbyguQMJ9i"],
      ["Getting food in Diagon Alley", "yxQP8QrCdAWakjMaY"],
      ["Eating in the Great Hall", "yxQP8QrCdAWakjMaY"],
      ["Exploring the Hogwarts grounds", "ueBZrF5mCRrcFBc8g"],
      ["Drinking coffee while studying for O.W.L.S.", "DPxfkTQQFggzNJBXD"],
      ["Looking for magical beasts flying overhead", "ueBZrF5mCRrcFBc8g"]
    ];

    options = options.filter(function(x) {
      return x[1] !== affordance;
    });

    let needName = "page" + Random.id(3);
    if (cb.numberOfSubmissions() === 7) {
      needName = "pageFinal";
    }
    let contribution = {
      needName: needName,
      situation: { detector: affordance, number: "1" },
      toPass: {
        instruction: sub.content.sentence,
        dropdownChoices: { name: "affordance", options: options }
      },
      numberNeeded: 1
    };
    addContribution(sub.iid, contribution);
  };

  let places = ["night", "niceish_day", "restaurant", "coffee"];
  let detectorIds = [
    "F8YqP3AEbyguQMJ9i",
    "ueBZrF5mCRrcFBc8g",
    "yxQP8QrCdAWakjMaY",
    "DPxfkTQQFggzNJBXD"
  ];
  let i = 0;
  _.forEach(places, place => {
    let newVars = JSON.parse(
      JSON.stringify(CONSTANTS.DETECTORS[place]["variables"])
    );
    newVars.push("var participatedInSpookyHarryStorytime;");

    let det = {
      _id: detectorIds[i],
      description:
        CONSTANTS.DETECTORS[place].description + "_SpookyHarryStorytime",
      variables: newVars,
      rules: [
        "(" +
          CONSTANTS.DETECTORS[place].rules[0] +
          " ) && !participatedInSpookyHarryStorytime;"
      ]
    };
    Detectors.insert(det);

    i++;
  });

  let dropdownOptions = [
    [
      "Sneaking around in the invisibility cloak after hours",
      "F8YqP3AEbyguQMJ9i"
    ],
    ["Werewolves howling at the moon", "F8YqP3AEbyguQMJ9i"],
    ["Getting food in Diagon Alley", "yxQP8QrCdAWakjMaY"],
    ["Eating in the Great Hall", "yxQP8QrCdAWakjMaY"],
    ["Exploring the Hogwarts grounds", "ueBZrF5mCRrcFBc8g"],
    ["Drinking coffee while studying for O.W.L.S.", "DPxfkTQQFggzNJBXD"],
    ["Looking for magical beasts flying overhead", "ueBZrF5mCRrcFBc8g"]
  ];

  let firstSentence =
    "Neville Longbottom looked out the castle into the darkness of the night as he snuck out of the common room";

  let sendNotification = function(sub) {
    let uids = Submissions.find({ iid: sub.iid }).fetch().map(function(x) {
      return x.uid;
    });
    notify(
      uids,
      sub.iid,
      "Our spooky Neville Longbottom story is finally complete. Click here to read it!",
      "",
      "/apicustomresults/" + sub.iid + "/" + sub.eid
    );
  };

  let exp = {
    _id: "QC7LGdoDCZqCY8mWb", //Random.id(),
    name: "Spooky Storytime",
    participateTemplate: "storyPage",
    resultsTemplate: "storybook",
    contributionTypes: [
      {
        needName: "pageOne",
        situation: { detector: "F8YqP3AEbyguQMJ9i", number: "1" },
        toPass: {
          instruction: firstSentence,
          firstSentence: firstSentence,
          dropdownChoices: {
            name: "affordance",
            options: dropdownOptions
          }
        },
        numberNeeded: 1
      }
    ],
    description: "We're writing a spooky Neville Longbottom spin-off story",
    notificationText: "Help write a spooky Neville Longbottom story!",
    callbacks: [
      {
        trigger: "cb.newSubmission() && (cb.numberOfSubmissions() <= 7)",
        function: storytimeCallback.toString()
      },
      {
        trigger: "cb.incidentFinished()",
        function: sendNotification.toString()
      }
    ]
  };

  Experiences.insert(exp);
  let incident = createIncidentFromExperience(exp);
  startRunningIncident(incident);
}
*/
