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
      needName: '12AM',
      notificationSubject: "Good evening! Or should I say good morning?",
      notificationText: 'Join your fellow NU seniors in this collective narrative about life during finals season',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.hour0),
        number: '1'
      },
      toPass: {
        //instruction: 'Can you take a photo of your coffee?',
        prestoryQuestion: 'How are you feeling staying up at 12AM during finals?',
        dropdownChoices: {
          name: 'casting question',
          options: ['WOOOO 🥳','BOOOO 👎']
        },
        contextDepQuestion: ['What are you doing tonight?', 'How is your night going?', 'Why are you staying up tonight?'],
        castingDepQuestion: {
          thriving: 'Yayyy! You describe your feeling towards the final as WOOOO 🥳, why are you feeling this way tonight?', 
          surviving: "Aw, I'm sorry to hear that (send virtual hug)! You describe your feeling towards the final as BOOOO 👎, why are you feeling this way tonight?"
        },
      },
      numberNeeded: 10,
      notificationDelay: 1, // 1 seconds for debugging
    }, {
      needName: 'Coffee',
      notificationSubject: 'They say coffee is the key to your soul.',
      notificationText: 'Join your fellow NU seniors in this collective narrative about life during finals season',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.coffee),
        number: '1'
      },
      toPass: {
        //instruction: 'Can you take a photo of your coffee?',
        prestoryQuestion: 'How are you feeling getting coffee during finals?',
        dropdownChoices: {
          name: 'casting question',
          options: ['WOOOO 🥳','BOOOO 👎']
        },
        contextDepQuestion: ['What are you doing at the coffee shop?', 'What did you get?', 'Why did you go to this coffee shop?'],
        castingDepQuestion: {
          thriving: 'Yayyy! You describe your feeling towards the final as WOOOO 🥳, why does going to the coffee shop make you feel this way?', 
          surviving: "Aw, I'm sorry to hear that (send virtual hug)! You describe your feeling towards the final as BOOOO 👎, why does going to the coffee shop make you feel this way?"
        },
      },
      numberNeeded: 10,
      notificationDelay: 180, // 1 seconds for debugging
    }, {
      needName: 'Library',
      notificationSubject: 'Inside a library?',
      notificationText: 'Join your fellow NU seniors in this collective narrative about life during finals season',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.library),
        number: '1'
      },
      toPass: {
        //To do: change them to arrays to allow more flexibility
        prestoryQuestion: 'How are you feeling going to a library during finals?',
        dropdownChoices: {
          name: 'casting question',
          options: ['WOOOO 🥳','BOOOO 👎']
        },
        contextDepQuestion: ['Why did you go to the library?', 'What are you doing at the library?', 'How long will you be staying at the library?'],
        castingDepQuestion: {
          thriving: 'Yayyy! You describe your feeling towards the final as WOOOO 🥳, why does going to the library make you feel this way?', 
          surviving: "Aw, I'm sorry to hear that (send virtual hug)! You describe your feeling towards the final as BOOOO 👎, why does going to the library make you feel this way?"
        },
      },
      numberNeeded: 10,
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