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
      needName: 'Coffee',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.coffee),
        number: '1'
      },
      toPass: {
        //instruction: 'Can you take a photo of your coffee?',
        prestoryQuestion: 'When drinking your coffee, do you feel thriving or surviving?',
        dropdownChoices: {
          name: 'casting question',
          options: ['surviving','thriving']
        },
        contextDepQuestion: 'What are you currently working on in the library?',
        castingDepQuestion: {
          thriving: 'Yayyy! You describe your feeling towards the final as WOOO, why does studying at the library make you feel that way?', 
          surviving: "Oh I'm sorry to hear that (send virtual hug)! You describe your feeling towards the final as BOOO, why does studying at the library make you feel that way?"
        },
      },
      numberNeeded: 2,
      notificationDelay: 1, // 1 seconds for debugging
    }, {
      needName: 'Library',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.library),
        number: '1'
      },
      toPass: {
        //To do: change them to arrays to allow more flexibility
        prestoryQuestion: 'Would you describe your current feeling towards the finals as WOOO or BOOO?',
        dropdownChoices: {
          name: 'casting question',
          options: ['surviving','thriving']
        },
        contextDepQuestion: 'What are you currently working on in the library?',
        castingDepQuestion: {
          thriving: 'Yayyy! You describe your feeling towards the final as WOOO, why does studying at the library make you feel that way?', 
          surviving: "Oh I'm sorry to hear that (send virtual hug)! You describe your feeling towards the final as BOOO, why does studying at the library make you feel that way?"
        },
      },
      numberNeeded: 2,
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