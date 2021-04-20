import {getDetectorUniqueKey} from "./oce_api_helpers";
import {DETECTORS} from "./DETECTORS";


let sendNotificationFinals = function (sub) {
  let uids = Submissions.find({ iid: sub.iid }).fetch().map(function (x) {
    return x.uid;
  });

  notify(uids, sub.iid, 'Check out this collective narrative about NU seniors in finals!', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
};

export default SENIOR_FINALS = {
  seniorFinals: {
    _id: Random.id(),
    name: 'Surviving or Thriving? NU Seniors in Finals',
    participateTemplate: 'scavengerHuntParticipate',
    resultsTemplate: 'scavengerHunt',
    contributionTypes: [{
      needName: 'drinking',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.beer),
        number: '1'
      },
      toPass: {
        instruction: 'Can you take a picture of what you are drinking? How are you feeling right now?'
      },
      numberNeeded: 1,
      notificationDelay: 30, // 30 seconds for debugging
    }, {
      needName: 'studying',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.library),
        number: '1'
      },
      toPass: {
        instruction: 'Can you take a picture of what you are studying? How are you feeling right now?'
      },
      numberAllowedToParticipateAtSameTime: 1, // for testing
      numberNeeded: 5, // for testing
      notificationDelay: 20, // 20 seconds for debugging
    }],
    description: 'Invite contributions about finals',
    notificationText: 'Final season is hard! Join fellow seniors by sharing your experiences and feelings about the finals!',
    callbacks: [{
      trigger: 'cb.incidentFinished()',
      function: sendNotificationFinals.toString()
    }]
  }
}