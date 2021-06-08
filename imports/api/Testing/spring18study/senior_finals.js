import {getDetectorUniqueKey} from "../oce_api_helpers";
import {DETECTORS} from "../DETECTORS";


let sendNotificationCN = function (sub) {
  let uids = Submissions.find({ iid: sub.iid }).fetch().map(function (x) {
    return x.uid;
  });
  
  notify(uids, sub.iid, 'Wooh! There have been new posts added to the collective narrative! Click here to view.', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
};

export default SHARED_GOALS = {
  surviveOrThrive: {
    _id: Random.id(),
    name: 'Surviving or Thriving?',
    prestoryTemplate: 'seniorFinalsPrestory',
    participateTemplate: 'survivingThrivingParticipate',
    resultsTemplate: 'survivingThriving',
    expandTemplate: 'seniorFinalsExpand',
    repeatContributionsToExperienceAfterN: 0, // always allow a repeat contribution to needs
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
          thriving: 'You describe your feeling towards the final as WOOOO 🥳, why are you feeling this way tonight?', 
          surviving: "You describe your feeling towards the final as BOOOO 👎, why are you feeling this way tonight?"
        },
      },
      numberNeeded: 15,
      notificationDelay: 1, // 1 seconds for debugging
      allowRepeatContributions : true
    }, {
      needName: 'Bar',
      notificationSubject: "Enjoying your favorite drink?",
      notificationText: 'Join your fellow NU seniors in this collective narrative about life during finals season',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.bar),
        number: '1'
      },
      toPass: {
        //instruction: 'Can you take a photo of your coffee?',
        prestoryQuestion: 'How are you feeling about your final week of college?',
        dropdownChoices: {
          name: 'casting question',
          options: ['WOOOO 🥳','BOOOO 👎']
        },
        contextDepQuestion: ['What\'s the occasion?', 'How is your night going?', 'What\'s the best drink of tonight?'],
        castingDepQuestion: {
          thriving: 'You describe your feeling towards the final as WOOOO 🥳, why are you feeling this way tonight?', 
          surviving: "You describe your feeling towards the final as BOOOO 👎, why are you feeling this way tonight?"
        },
      },
      numberNeeded: 10,
      notificationDelay: 1, // 1 seconds for debugging
      allowRepeatContributions : true
    },{
      needName: 'Excercising',
      notificationSubject: "Excercising? We love healthy lifestyles during finals!",
      notificationText: 'Join your fellow NU seniors in this collective narrative about life during finals season',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.exercising),
        number: '1'
      },
      toPass: {
        //instruction: 'Can you take a photo of your coffee?',
        prestoryQuestion: 'How are you feeling about your final week of college?',
        dropdownChoices: {
          name: 'casting question',
          options: ['WOOOO 🥳','BOOOO 👎']
        },
        contextDepQuestion: ['Show us what you are doing!', 'Why did you choose this time and place to excercise?', 'How\'s the work out going so far?'],
        castingDepQuestion: {
          thriving: 'You describe your feeling towards the final as WOOOO 🥳, why are you feeling this way tonight?', 
          surviving: "You describe your feeling towards the final as BOOOO 👎, why are you feeling this way tonight?"
        },
      },
      numberNeeded: 10,
      notificationDelay: 1, // 1 seconds for debugging
      allowRepeatContributions : true
    }, {
      needName: '6AM',
      notificationSubject: "Early bird... night owl...or both?",
      notificationText: 'Join your fellow NU seniors in this collective narrative about life during finals season',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.hour6),
        number: '1'
      },
      toPass: {
        //instruction: 'Can you take a photo of your coffee?',
        prestoryQuestion: 'How are you feeling being awake at 6AM during finals?',
        dropdownChoices: {
          name: 'casting question',
          options: ['WOOOO 🥳','BOOOO 👎']
        },
        contextDepQuestion: ['What are you doing now?', 'Why are you up early?'],
        castingDepQuestion: {
          thriving: 'You describe your feeling towards the final as WOOOO 🥳, why are you feeling this way?', 
          surviving: "You describe your feeling towards the final as BOOOO 👎, why are you feeling this way?"
        },
      },
      numberNeeded: 10,
      notificationDelay: 1, // 1 seconds for debugging
      allowRepeatContributions : true
    },{
      needName: 'Sunset',
      notificationSubject: "It's sunset time! Can you see it?",
      notificationText: 'Tell your fellow seniors about your day in this collective narrative about life during finals season',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.sunset),
        number: '1'
      },
      toPass: {
        //instruction: 'Can you take a photo of your coffee?',
        prestoryQuestion: 'How are you feeling about your final week of college?',
        dropdownChoices: {
          name: 'casting question',
          options: ['WOOOO 🥳','BOOOO 👎']
        },
        contextDepQuestion: ['What are you doing now?', 'Did you have any finals today?'],
        castingDepQuestion: {
          thriving: 'You describe your feeling towards the final as WOOOO 🥳, why are you feeling this way?', 
          surviving: "You describe your feeling towards the final as BOOOO 👎, why are you feeling this way?"
        },
      },
      numberNeeded: 10,
      notificationDelay: 1, // 1 seconds for debugging
      allowRepeatContributions : true
    },{
      needName: 'Restaurant',
      notificationSubject: "Eating at a restaurant? Yum 😍",
      notificationText: 'Share your food & life with fellow NU seniors in a collective narrative about finals!',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.bar),
        number: '1'
      },
      toPass: {
        //instruction: 'Can you take a photo of your coffee?',
        prestoryQuestion: 'How are you feeling about your final week of college?',
        dropdownChoices: {
          name: 'casting question',
          options: ['WOOOO 🥳','BOOOO 👎']
        },
        contextDepQuestion: ['What is the occasion?', 'What was the dish on the menu that caught your eye?', 'Are you eating with anyone?', 'Would you recommend this place to other people?'],
        castingDepQuestion: {
          thriving: 'You describe your feeling towards the final as WOOOO 🥳, why are you feeling this way tonight?', 
          surviving: "You describe your feeling towards the final as BOOOO 👎, why are you feeling this way tonight?"
        },
      },
      numberNeeded: 10,
      notificationDelay: 120, // 1 seconds for debugging
      allowRepeatContributions : true
    },{
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
          thriving: 'You describe your feeling towards the final as WOOOO 🥳, why does going to the coffee shop make you feel this way?', 
          surviving: "You describe your feeling towards the final as BOOOO 👎, why does going to the coffee shop make you feel this way?"
        },
      },
      numberNeeded: 10,
      notificationDelay: 20, // 1 seconds for debugging
      allowRepeatContributions : true
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
          thriving: 'You describe your feeling towards the final as WOOOO 🥳, why does going to the library make you feel this way?', 
          surviving: "You describe your feeling towards the final as BOOOO 👎, why does going to the library make you feel this way?"
        },
      },
      numberNeeded: 10,
      notificationDelay: 1, // 1 seconds for debugging
      allowRepeatContributions : true
    }, {
      needName: 'Noon',
      notificationSubject: "What are you having for lunch?",
      notificationText: 'Join your fellow NU seniors in this collective narrative about life during finals season',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.hour12),
        number: '1'
      },
      toPass: {
        //instruction: 'Can you take a photo of your coffee?',
        prestoryQuestion: 'How are you feeling about your final week of college?',
        dropdownChoices: {
          name: 'casting question',
          options: ['WOOOO 🥳','BOOOO 👎']
        },
        contextDepQuestion: ['What are you doing right now?', 'What are you having for lunch?'],
        castingDepQuestion: {
          thriving: 'You describe your feeling towards the final as WOOOO 🥳, why are you feeling this way today?', 
          surviving: "You describe your feeling towards the final as BOOOO 👎, why are you feeling this way today?"
        },
      },
      numberNeeded: 10,
      notificationDelay: 1, // 1 seconds for debugging
      allowRepeatContributions : true
    },{
      needName: 'Lakefill',
      notificationSubject: 'Must be a good day to walk on the Lakefill.',
      notificationText: 'Join your fellow NU seniors in this collective narrative about life during finals season',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.lakefill), //
        number: '1'
      },
      toPass: {
        //To do: change them to arrays to allow more flexibility
        prestoryQuestion: 'How are you feeling going to the Lakefill during finals?',
        dropdownChoices: {
          name: 'casting question',
          options: ['WOOOO 🥳','BOOOO 👎']
        },
        contextDepQuestion: ['What are you doing at the Lakefill?', 'How’s the crowd today at the Lakefill?', 'What does the lake look like today? Can you see the Chicago skyline?'],
        castingDepQuestion: {
          thriving: 'You describe your feeling towards the final as WOOOO 🥳, why does going to the Lakefill make you feel this way?', 
          surviving: "You describe your feeling towards the final as BOOOO 👎, why does going to the Lakefill make you feel this way?"
        },
      },
      numberNeeded: 10,
      notificationDelay: 1, // 1 seconds for debugging
      allowRepeatContributions : true
    }, {
      needName: 'Norris',
      notificationSubject: 'Hanging out at Norris?',
      notificationText: 'Join your fellow NU seniors in this collective narrative about life during finals season',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.norris), //
        number: '1'
      },
      toPass: {
        //To do: change them to arrays to allow more flexibility
        prestoryQuestion: 'How are you feeling going to Norris during finals?',
        dropdownChoices: {
          name: 'casting question',
          options: ['WOOOO 🥳','BOOOO 👎']
        },
        contextDepQuestion: ['What are you doing at Norris?', 'Did you get anything to eat or drink?', 'Who did you go to Norris with?'],
        castingDepQuestion: {
          thriving: 'You describe your feeling towards the final as WOOOO 🥳, why does going to Norris make you feel this way?', 
          surviving: "You describe your feeling towards the final as BOOOO 👎, why does going to Norris make you feel this way?"
        },
      },
      numberNeeded: 10,
      notificationDelay: 1, // 1 seconds for debugging
      allowRepeatContributions : true
    }, {
      needName: 'Weber Arch',
      notificationSubject: 'We love the Arch!',
      notificationText: '',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.thearch), //
        number: '1'
      },
      toPass: {
        //To do: change them to arrays to allow more flexibility
        prestoryQuestion: 'How are you feeling about your last week of college?',
        dropdownChoices: {
          name: 'casting question',
          options: ['WOOOO 🥳','BOOOO 👎']
        },
        contextDepQuestion: ['You have stayed near the Arch for the past 5 minutes. What are you doing?'],
        castingDepQuestion: {
          thriving: 'You describe your feeling towards this week as WOOOO 🥳, why do you feel this way?', 
          surviving: "You describe your feeling towards this week as BOOOO 👎, why do you feel this way?"
        },
      },
      numberNeeded: 10,
      notificationDelay: 300, // 1 seconds for debugging
      allowRepeatContributions : true
    }],
    //overwritten
    description: 'Share your experience & feelings about the finals',
    notificationText: 'Tell a collective narrative with fellow seniors!',
    callbacks: [{
      trigger: 'cb.numberOfSubmissions() === 5',
      function: sendNotificationCN.toString()
    },{
      trigger: 'cb.numberOfSubmissions() === 10',
      function: sendNotificationCN.toString()
    },{
      trigger: 'cb.numberOfSubmissions() === 15',
      function: sendNotificationCN.toString()
    },{
      trigger: 'cb.numberOfSubmissions() === 20',
      function: sendNotificationCN.toString()
    }]
  },
}