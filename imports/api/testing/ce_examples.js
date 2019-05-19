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