import {getDetectorUniqueKey} from "../oce_api_helpers";
import {DETECTORS} from "../DETECTORS";


let sendNotificationScavenger = function (sub) {
  let uids = Submissions.find({ iid: sub.iid }).fetch().map(function (x) {
    return x.uid;
  });

  notify(uids, sub.iid, 'Wooh! All the scavenger hunt items were found. Click here to see all of them.', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
};

export default SHARED_GOALS = {
  scavengerHunt: {
    _id: Random.id(),
    name: 'St. Patrick\'s Day Scavenger Hunt',
    participateTemplate: 'scavengerHuntParticipate',
    resultsTemplate: 'scavengerHunt',
    contributionTypes: [{
      needName: 'beer',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.beer),
        number: '1'
      },
      toPass: {
        instruction: 'Can you take a photo of beer?'
      },
      numberNeeded: 1,
      notificationDelay: 30, // 30 seconds for debugging
    }, {
      needName: 'greenProduce',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.produce),
        number: '1'
      },
      toPass: {
        instruction: 'Can you take a photo of green vegetables? #leprechaunfood'
      },
      numberAllowedToParticipateAtSameTime: 1, // for testing
      numberNeeded: 5, // for testing
      notificationDelay: 20, // 20 seconds for debugging
    }, {
      needName: 'coins',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.drugstore),
        number: '1'
      },
      toPass: {
        instruction: 'Can you take a photo of chocolate gold coins on display?'
      },
      numberNeeded: 1,
      notificationDelay: 10, // 10 seconds for debugging
    }, {
      needName: 'leprechaun',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.costume_store),
        number: '1'
      },
      toPass: {
        instruction: 'Can you take a photo of a Leprechaun costume?'
      },
      numberNeeded: 1,
      notificationDelay: 15, // 15 seconds for debugging
    }, {
      needName: 'irishSign',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.irish),
        number: '1'
      },
      toPass: {
        instruction: 'Can you take a photo of an Irish sign?'
      },
      numberNeeded: 1,
      notificationDelay: 1, // 1 seconds for debugging (passing by)
    }, {
      needName: 'trimmings',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.hair_salon),
        number: '1'
      },
      toPass: {
        instruction: 'Can you take a photo of some Leprechaun beard trimmings?'
      },
      numberNeeded: 1,
      notificationDelay: 10, // 10 seconds for debugging
    }, {
      needName: 'liquidGold',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.gas_station),
        number: '1'
      },
      toPass: {
        instruction: 'Can you take a photo of liquid gold that Leprechauns use to power their vehicles?'
      },
      numberNeeded: 1,
      notificationDelay: 10, // 10 seconds for debugging
    }, {
      needName: 'potOfGold',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.bank),
        number: '1'
      },
      toPass: {
        instruction: 'Can you take a photo of a bank where Leprechauns hide their pots of gold?'
      },
      numberNeeded: 1,
      notificationDelay: 10, // 10 seconds for debugging
    }, {
      needName: 'rainbow',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.rainbow),
        number: '1'
      },
      toPass: {
        instruction: 'Can you take a photo of a rainbow flag?'
      },
      numberNeeded: 1,
      notificationDelay: 10, // 10 seconds for debugging
    }],
    description: 'Find an item for a scavenger hunt',
    notificationText: 'Help us complete a St. Patrick\'s day scavenger hunt',
    callbacks: [{
      trigger: 'cb.incidentFinished()',
      function: sendNotificationScavenger.toString()
    }]
  },
  natureHunt: {
    _id: Random.id(),
    name: 'Nature Scavenger Hunt',
    participateTemplate: 'scavengerHuntParticipate',
    resultsTemplate: 'scavengerHunt',
    contributionTypes: [{
      needName: 'tree',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.forest),
        number: '1'
      },
      toPass: {
        instruction: 'Can you take a photo of a tree?'
      },
      numberNeeded: 1,
      notificationDelay: 10, // 10 seconds for debugging
    }, {
      needName: 'leaf',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.forest),
        number: '1'
      },
      toPass: {
        instruction: 'Can you take a photo of a leaf?'
      },
      numberNeeded: 1,
      notificationDelay: 10, // 10 seconds for debugging
    }, {
      needName: 'grass',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.field),
        number: '1'
      },
      toPass: {
        instruction: 'Can you take a photo of the grass?'
      },
      numberNeeded: 1,
      notificationDelay: 10, // 10 seconds for debugging
    }, {
      needName: 'lake',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.lake),
        number: '1'
      },
      toPass: {
        instruction: 'Can you take a photo of the lake?'
      },
      numberNeeded: 1,
      notificationDelay: 10, // 10 seconds for debugging
    }, {
      needName: 'moon',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.night),
        number: '1'
      },
      toPass: {
        instruction: 'Can you take a photo of the moon?'
      },
      numberNeeded: 1,
      notificationDelay: 1, // 1 seconds for debugging
    }, {
      needName: 'sun',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.sunny),
        number: '1'
      },
      toPass: {
        instruction: 'Can you take a photo of the sun?'
      },
      numberNeeded: 1,
      notificationDelay: 1, // 1 seconds for debugging
    }, {
      needName: 'blueSky',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.sunny),
        number: '1'
      },
      toPass: {
        instruction: 'Can you take a photo of the blue sky?'
      },
      numberNeeded: 1,
      notificationDelay: 1, // 1 seconds for debugging
    }, {
      needName: 'clouds',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.cloudy),
        number: '1'
      },
      toPass: {
        instruction: 'Can you take a photo of the clouds?'
      },
      numberNeeded: 1,
      notificationDelay: 1, // 1 seconds for debugging
    }, {
      needName: 'puddle',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.rainy),
        number: '1'
      },
      toPass: {
        instruction: 'Can you take a photo of the puddle?'
      },
      numberNeeded: 1,
      notificationDelay: 1, // 1 seconds for debugging
    }],
    description: 'Find an item for a scavenger hunt',
    notificationText: 'Help us out with our nature scavenger hunt',
    callbacks: [{
      trigger: 'cb.incidentFinished()',
      function: sendNotificationScavenger.toString()
    }]
  },
}