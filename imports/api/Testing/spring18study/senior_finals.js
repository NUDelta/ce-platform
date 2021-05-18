import {getDetectorUniqueKey} from "../oce_api_helpers";
import {DETECTORS} from "../DETECTORS";


let sendNotificationScavenger = function (sub) {
  let uids = Submissions.find({ iid: sub.iid }).fetch().map(function (x) {
    return x.uid;
  });

  notify(uids, sub.iid, 'Wooh! All the scavenger hunt items were found. Click here to see all of them.', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
};

export default SHARED_GOALS = {
  surviveOrThrive: {
    _id: Random.id(),
    name: 'Surviving or Thriving?',
    prestoryTemplate: 'seniorFinalsPrestory',
    participateTemplate: 'survivingThrivingParticipate',
    resultsTemplate: 'survivingThriving',
    contributionTypes: [{
      needName: 'Relaxing',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.coffee),
        number: '1'
      },
      toPass: {
        instruction: 'Can you take a photo of your coffee?',
        prestoryQuestion: 'When drinking your coffee, do you feel thriving or surviving?',
        dropdownChoices: {
          name: 'mental state',
          options: ['surviving','thriving']
        }
      },
      numberNeeded: 2,
      notificationDelay: 1, // 1 seconds for debugging
    }, {
      needName: 'Studying',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.library),
        number: '1'
      },
      toPass: {
        instruction: 'Can you take a photo of the library?',
        prestoryQuestion: 'When studying at the library, do you feel thriving or surviving?',
        dropdownChoices: {
          name: 'mental state',
          options: ['surviving','thriving']
        }
      },
      numberNeeded: 1,
      notificationDelay: 1, // 1 seconds for debugging

    }],
    description: 'Share your experience & feelings about the finals',
    notificationText: 'Tell a collective narrative with fellow seniors!',
    callbacks: [{
      trigger: 'cb.incidentFinished()',
      function: sendNotificationScavenger.toString()
    }]
  },
}