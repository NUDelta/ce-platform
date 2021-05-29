import {getDetectorUniqueKey} from "../oce_api_helpers";
import {DETECTORS} from "../DETECTORS";


let sendNotificationCN = function (sub) {
  let uids = Submissions.find({ iid: sub.iid }).fetch().map(function (x) {
    return x.uid;
  });

  notify(uids, sub.iid, 'Wooh! The collective narrative is completed! Click here to view.', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
};

export default SHARED_GOALS = {
  surviveOrThrive: {
    _id: Random.id(),
    name: 'Surviving or Thriving?',
    prestoryTemplate: 'seniorFinalsPrestory',
    participateTemplate: 'survivingThrivingParticipate',
    resultsTemplate: 'survivingThriving',
    expandTemplate: 'seniorFinalsExpand',
    contributionTypes: [{
      needName: 'Coffee',
      notificationSubject: 'How many cups of coffee have you got this week?',
      notificationText: 'Join your fellow NU seniors in this collective narrative about life during finals',
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
      notificationSubject: 'Inside a library?',
      notificationText: 'Join your fellow NU seniors in this collective narrative about life during finals',
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
    //overwritten
    description: 'Share your experience & feelings about the finals',
    notificationText: 'Tell a collective narrative with fellow seniors!',
    callbacks: [{
      trigger: 'cb.incidentFinished()',
      function: sendNotificationCN.toString()
    }]
  },
}