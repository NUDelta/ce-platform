import {getDetectorUniqueKey} from "../oce_api_helpers";
import {DETECTORS} from "../DETECTORS";


let sendNotificationCN = function (sub) {
  let uids = Submissions.find({ iid: sub.iid }).fetch().map(function (x) {
    return x.uid;
  });
  
  notify(uids, sub.iid, 'Wooh! There have been new posts added to the collective narrative! Click here to view.', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
};

export default PARALLEL = {
  sample: {
    _id: Random.id(),
    name: 'Please Work',
    prestoryTemplate: 'cookNight',
    participateTemplate: 'cookParticipate',
    resultsTemplate: 'cookSlides',
    expandTemplate: 'seniorFinalsExpand',
    repeatContributionsToExperienceAfterN: 0,
    contributionTypes: [{
      needName: 'huh',
      notificationSubject: "Hello! :)",
      notificationText: 'How is your DTR deliverable going?',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.cookingJourneyDetector), // set to "beginning detector" 
        number: '1'
      },
      toPass: {
        //instruction: 'Can you take a photo of your coffee?',
        prestoryQuestion: "Are you studying at the library?",
        dropdownChoices: {
          name: 'casting question',
          options: ['😃','🙏','😌','😬', '😫', '😢']
        },
        contextDepQuestion: ['What are you doing at the library?', 
                        'Are you already finished with your deliverable and chilling at the library or are you currently working on it?',
                      'Are you working with your whole SIG? With others from your DTR? Just with the people within your project?'],
        castingDepQuestion: {
          happy: 'What makes you feel this way?', 
          hopeful: 'Why do you feel this way?',
          relieved: 'What makes you feel this way?',
          anxious: 'What makes you feel this way? What do you do to help with your anxiety?',
          exhausted: 'What makes you feel this way? What helps you feel better?',
          sad: 'What makes you feel this way? What helps you feel better?'
        },
      },
      numberNeeded: 10,
      notificationDelay: 1, // 1 seconds for debugging
      allowRepeatContributions : true
    }]
  }
}

// export default PARALLELa = {
//   sample: {
//     _id: Random.id(),
//     name: 'Please Work',
//     prestoryTemplate: 'seniorFinalsPrestory',
//     participateTemplate: 'survivingThrivingParticipate',
//     resultsTemplate: 'survivingThriving',
//     expandTemplate: 'seniorFinalsExpand',
//     repeatContributionsToExperienceAfterN: 0,
//     contributionTypes: [{
//       needName: 'myExp',
//       notificationSubject: "Hello! :)",
//       notificationText: 'How is your DTR deliverable going?',
//       situation: {
//         detector: getDetectorUniqueKey(DETECTORS.coffee), // set to "beginning detector" 
//         number: '1'
//       },
//       toPass: {
//         //instruction: 'Can you take a photo of your coffee?',
//         prestoryQuestion: 'How is your DTR deliverable going? Remember, it\'s due EOD tomorrow!',
//         dropdownChoices: {
//           name: 'casting question',
//           options: ['😃','🙏','😌','😬', '😫', '😢']
//         },
//         contextDepQuestion: ['What are you doing at the library?', 
//                         'Are you already finished with your deliverable and chilling at the library or are you currently working on it?',
//                       'Are you working with your whole SIG? With others from your DTR? Just with the people within your project?'],
//         castingDepQuestion: {
//           happy: 'What makes you feel this way?', 
//           hopeful: 'Why do you feel this way?',
//           relieved: 'What makes you feel this way?',
//           anxious: 'What makes you feel this way? What do you do to help with your anxiety?',
//           exhausted: 'What makes you feel this way? What helps you feel better?',
//           sad: 'What makes you feel this way? What helps you feel better?'
//         },
//       },
//       numberNeeded: 15,
//       notificationDelay: 1, // 1 seconds for debugging
//       allowRepeatContributions : true
//     }]
//   }
// //   surviveOrThrive: {
// //     _id: Random.id(),
// //     name: 'Final Week of DTR!',
// //     prestoryTemplate: 'seniorFinalsPrestory',
// //     participateTemplate: 'survivingThrivingParticipate',
// //     resultsTemplate: 'survivingThriving',
// //     expandTemplate: 'seniorFinalsExpand',
// //     repeatContributionsToExperienceAfterN: 0, // always allow a repeat contribution to needs
// //     contributionTypes: [{
// //        //// JENNY'S 
// //       needName: 'beginning_library',
// //       notificationSubject: "Hello! :)",
// //       notificationText: 'How is your DTR deliverable going?',
// //       situation: {
// //         detector: getDetectorUniqueKey(DETECTORS.coffee), // set to "beginning detector" 
// //         number: '1'
// //       },
// //       toPass: {
// //         //instruction: 'Can you take a photo of your coffee?',
// //         prestoryQuestion: 'How is your DTR deliverable going? Remember, it\'s due EOD tomorrow!',
// //         dropdownChoices: {
// //           name: 'casting question',
// //           options: ['😃','🙏','😌','😬', '😫', '😢']
// //         },
// //         contextDepQuestion: ['What are you doing at the library?', 
// //                         'Are you already finished with your deliverable and chilling at the library or are you currently working on it?',
// //                       'Are you working with your whole SIG? With others from your DTR? Just with the people within your project?'],
// //         castingDepQuestion: {
// //           happy: 'What makes you feel this way?', 
// //           hopeful: 'Why do you feel this way?',
// //           relieved: 'What makes you feel this way?',
// //           anxious: 'What makes you feel this way? What do you do to help with your anxiety?',
// //           exhausted: 'What makes you feel this way? What helps you feel better?',
// //           sad: 'What makes you feel this way? What helps you feel better?'
// //         },
// //       },
// //       numberNeeded: 15,
// //       notificationDelay: 1, // 1 seconds for debugging
// //       allowRepeatContributions : true
// //     },{
// //       needName: 'during_library',
// //       notificationSubject: "Hello! :)",
// //       notificationText: 'How is your DTR deliverable going? It\'s due tonight!',
// //       situation: {
// //         detector: getDetectorUniqueKey(DETECTORS.library), 
// //         number: '1'
// //       },
// //       toPass: {
// //         //instruction: 'Can you take a photo of your coffee?',
// //         prestoryQuestion: 'How is your DTR deliverable going? Remember, it\'s due tonight!',
// //         dropdownChoices: {
// //           name: 'casting question',
// //           options: ['😃','🙏','😌','😬', '😫', '😢']
// //         },
// //         contextDepQuestion: ['What are you doing at the library?', 
// //           'Are you making just last minute changes today, or do you still have a lot of work to complete today?', 
// //         'Are you working with other people from DTR, or are you working alone?'],
// //         castingDepQuestion: {
// //           happy: 'What makes you feel this way?', 
// //           hopeful: 'Why do you feel this way?',
// //           relieved: 'What makes you feel this way?',
// //           anxious: 'What makes you feel this way? What do you do to help with your anxiety?',
// //           exhausted: 'What makes you feel this way? What helps you feel better?',
// //           sad: 'What makes you feel this way? What helps you feel better?'
// //         },
// //       },
// //       numberNeeded: 15,
// //       notificationDelay: 1, // 1 seconds for debugging
// //       allowRepeatContributions : true
// //   },{
// //     needName: 'after_library',
// //     notificationSubject: "Hello! :)",
// //     notificationText: 'Yay! You have submitted your deliverable',
// //     situation: {
// //       detector: getDetectorUniqueKey(DETECTORS.after_library), 
// //       number: '1'
// //     },
// //     toPass: {
// //       //instruction: 'Can you take a photo of your coffee?',
// //       prestoryQuestion: 'Yay! You have (hopefully) submitted your deliverable! How was that?',
// //       dropdownChoices: {
// //         name: 'casting question',
// //         options: ['😃','🙏','😌','😬', '😫', '😢']
// //       },
// //       contextDepQuestion: ['What are you doing at the library?', 
// //       'Are you chilling in the library with friends?', 'Are you studying for your next final?', 'Are you submitting something a little late for DTR?'],
// //       castingDepQuestion: {
// //         happy: 'What makes you feel this way?', 
// //         hopeful: 'Why do you feel this way?',
// //         relieved: 'What makes you feel this way?',
// //         anxious: 'What makes you feel this way? What do you do to help with your anxiety?',
// //         exhausted: 'What makes you feel this way? What helps you feel better?',
// //         sad: 'What makes you feel this way? What helps you feel better?'
// //       },
// //     },
// //     numberNeeded: 15,
// //     notificationDelay: 1, // 1 seconds for debugging
// //     allowRepeatContributions : true
// //   },{
// //     needName: 'beginning_cafe',
// //     notificationSubject: "Hello! :)",
// //     notificationText: 'How is your DTR deliverable going? Remember, it\'s due EOD tomorrow!',
// //     situation: {
// //       detector: getDetectorUniqueKey(DETECTORS.beginning_cafe), // set to "beginning detector"
// //       number: '1'
// //     },
// //     toPass: {
// //       //instruction: 'Can you take a photo of your coffee?',
// //       prestoryQuestion: 'How is your DTR deliverable going? Remember, it\'s due EOD tomorrow!',
// //       dropdownChoices: {
// //         name: 'casting question',
// //         options: ['😃','🙏','😌','😬', '😫', '😢']
// //       },
// //       contextDepQuestion: ['What are you doing at the restaurant/cafe?', 
// //       'Are you chilling with friends because you have already completed your DTR deliverable?', 
// //       'Are you out for a quick bite before going back to grind?', 'Are you working on DTR out here?'],
// //       castingDepQuestion: {
// //         happy: 'What makes you feel this way?', 
// //         hopeful: 'Why do you feel this way?',
// //         relieved: 'What makes you feel this way?',
// //         anxious: 'What makes you feel this way? What do you do to help with your anxiety?',
// //         exhausted: 'What makes you feel this way? What helps you feel better?',
// //         sad: 'What makes you feel this way? What helps you feel better?'
// //       },
// //     },
// //     numberNeeded: 15,
// //     notificationDelay: 1, // 1 seconds for debugging
// //     allowRepeatContributions : true
// //   },{
// //     needName: 'during_cafe',
// //     notificationSubject: "Hello! :)",
// //     notificationText: 'How is your DTR deliverable going? It\'s due tonight!',
// //     situation: {
// //       detector: getDetectorUniqueKey(DETECTORS.during_cafe), 
// //       number: '1'
// //     },
// //     toPass: {
// //       //instruction: 'Can you take a photo of your coffee?',
// //       prestoryQuestion: 'How is your DTR deliverable going? Remember, it\'s due tonight!',
// //       dropdownChoices: {
// //         name: 'casting question',
// //         options: ['😃','🙏','😌','😬', '😫', '😢']
// //       },
// //       contextDepQuestion: ['What are you doing at the cafe/restaurant?', 
// //         'Have you already submitted your deliverable and had your exit meeting and enjoying your nice meal with friends before you head back home for break?', 
// //       'Is this cafe/ restaurant where you work best, so you are focused on completing your deliverable now?'],
// //       castingDepQuestion: {
// //         happy: 'What makes you feel this way?', 
// //         hopeful: 'Why do you feel this way?',
// //         relieved: 'What makes you feel this way?',
// //         anxious: 'What makes you feel this way? What do you do to help with your anxiety?',
// //         exhausted: 'What makes you feel this way? What helps you feel better?',
// //         sad: 'What makes you feel this way? What helps you feel better?'
// //       },
// //     },
// //     numberNeeded: 15,
// //     notificationDelay: 1, // 1 seconds for debugging
// //     allowRepeatContributions : true
// // },{
// //   needName: 'after_cafe',
// //   notificationSubject: "Hello! :)",
// //   notificationText: 'Yay! You have submitted your deliverable',
// //   situation: {
// //     detector: getDetectorUniqueKey(DETECTORS.after_cafe), 
// //     number: '1'
// //   },
// //   toPass: {
// //     //instruction: 'Can you take a photo of your coffee?',
// //     prestoryQuestion: 'Yay! You have (hopefully) submitted your deliverable! How was that?',
// //     dropdownChoices: {
// //       name: 'casting question',
// //       options: ['😃','🙏','😌','😬', '😫', '😢']
// //     },
// //     contextDepQuestion: ['What are you doing at the cafe/restaurant?', 
// //     'Are you relaxed and enjoying your last meal before you head off for break?', 
// //     'Are you studying for your next final here?', 
// //     'Catching up with DTR people with some nice food/drinks before you all head off to break?'],
// //     castingDepQuestion: {
// //       happy: 'What makes you feel this way?', 
// //       hopeful: 'Why do you feel this way?',
// //       relieved: 'What makes you feel this way?',
// //       anxious: 'What makes you feel this way? What do you do to help with your anxiety?',
// //       exhausted: 'What makes you feel this way? What helps you feel better?',
// //       sad: 'What makes you feel this way? What helps you feel better?'
// //     },
// //   },
// //   numberNeeded: 15,
// //   notificationDelay: 1, // 1 seconds for debugging
// //   allowRepeatContributions : true
// // },


//     /// NINA AND KEVINS
//     // {
//     //   needName: '12AM',
//     //   notificationSubject: "Good evening! Or should I say good morning?",
//     //   notificationText: 'Join your fellow NU seniors in this collective narrative about life during finals season',
//     //   situation: {
//     //     detector: getDetectorUniqueKey(DETECTORS.hour0),
//     //     number: '1'
//     //   },
//     //   toPass: {
//     //     //instruction: 'Can you take a photo of your coffee?',
//     //     prestoryQuestion: 'How are you feeling staying up at 12AM during finals?',
//     //     dropdownChoices: {
//     //       name: 'casting question',
//     //       options: ['WOOOO 🥳','BOOOO 👎']
//     //     },
//     //     contextDepQuestion: ['What are you doing tonight?', 'How is your night going?', 'Why are you staying up tonight?'],
//     //     castingDepQuestion: {
//     //       thriving: 'You describe your feeling towards the final as WOOOO 🥳, why are you feeling this way tonight?', 
//     //       surviving: "You describe your feeling towards the final as BOOOO 👎, why are you feeling this way tonight?"
//     //     },
//     //   },
//     //   numberNeeded: 15,
//     //   notificationDelay: 1, // 1 seconds for debugging
//     //   allowRepeatContributions : true
//     // }, {
//     //   needName: 'Bar',
//     //   notificationSubject: "Enjoying your favorite drink?",
//     //   notificationText: 'Join your fellow NU seniors in this collective narrative about life during finals season',
//     //   situation: {
//     //     detector: getDetectorUniqueKey(DETECTORS.bar),
//     //     number: '1'
//     //   },
//     //   toPass: {
//     //     //instruction: 'Can you take a photo of your coffee?',
//     //     prestoryQuestion: 'How are you feeling about your final week of college?',
//     //     dropdownChoices: {
//     //       name: 'casting question',
//     //       options: ['WOOOO 🥳','BOOOO 👎']
//     //     },
//     //     contextDepQuestion: ['What\'s the occasion?', 'How is your night going?', 'What\'s the best drink of tonight?'],
//     //     castingDepQuestion: {
//     //       thriving: 'You describe your feeling towards the final as WOOOO 🥳, why are you feeling this way tonight?', 
//     //       surviving: "You describe your feeling towards the final as BOOOO 👎, why are you feeling this way tonight?"
//     //     },
//     //   },
//     //   numberNeeded: 10,
//     //   notificationDelay: 1, // 1 seconds for debugging
//     //   allowRepeatContributions : true
//     // },{
//     //   needName: 'Excercising',
//     //   notificationSubject: "Excercising? We love healthy lifestyles during finals!",
//     //   notificationText: 'Join your fellow NU seniors in this collective narrative about life during finals season',
//     //   situation: {
//     //     detector: getDetectorUniqueKey(DETECTORS.exercising),
//     //     number: '1'
//     //   },
//     //   toPass: {
//     //     //instruction: 'Can you take a photo of your coffee?',
//     //     prestoryQuestion: 'How are you feeling about your final week of college?',
//     //     dropdownChoices: {
//     //       name: 'casting question',
//     //       options: ['WOOOO 🥳','BOOOO 👎']
//     //     },
//     //     contextDepQuestion: ['Show us what you are doing!', 'Why did you choose this time and place to excercise?', 'How\'s the work out going so far?'],
//     //     castingDepQuestion: {
//     //       thriving: 'You describe your feeling towards the final as WOOOO 🥳, why are you feeling this way tonight?', 
//     //       surviving: "You describe your feeling towards the final as BOOOO 👎, why are you feeling this way tonight?"
//     //     },
//     //   },
//     //   numberNeeded: 10,
//     //   notificationDelay: 1, // 1 seconds for debugging
//     //   allowRepeatContributions : true
//     // }, {
//     //   needName: '6AM',
//     //   notificationSubject: "Early bird... night owl...or both?",
//     //   notificationText: 'Join your fellow NU seniors in this collective narrative about life during finals season',
//     //   situation: {
//     //     detector: getDetectorUniqueKey(DETECTORS.hour6),
//     //     number: '1'
//     //   },
//     //   toPass: {
//     //     //instruction: 'Can you take a photo of your coffee?',
//     //     prestoryQuestion: 'How are you feeling being awake at 6AM during finals?',
//     //     dropdownChoices: {
//     //       name: 'casting question',
//     //       options: ['WOOOO 🥳','BOOOO 👎']
//     //     },
//     //     contextDepQuestion: ['What are you doing now?', 'Why are you up early?'],
//     //     castingDepQuestion: {
//     //       thriving: 'You describe your feeling towards the final as WOOOO 🥳, why are you feeling this way?', 
//     //       surviving: "You describe your feeling towards the final as BOOOO 👎, why are you feeling this way?"
//     //     },
//     //   },
//     //   numberNeeded: 10,
//     //   notificationDelay: 1, // 1 seconds for debugging
//     //   allowRepeatContributions : true
//     // },{
//     //   needName: 'Sunset',
//     //   notificationSubject: "It's sunset time! Can you see it?",
//     //   notificationText: 'Tell your fellow seniors about your day in this collective narrative about life during finals season',
//     //   situation: {
//     //     detector: getDetectorUniqueKey(DETECTORS.sunset),
//     //     number: '1'
//     //   },
//     //   toPass: {
//     //     //instruction: 'Can you take a photo of your coffee?',
//     //     prestoryQuestion: 'How are you feeling about your final week of college?',
//     //     dropdownChoices: {
//     //       name: 'casting question',
//     //       options: ['WOOOO 🥳','BOOOO 👎']
//     //     },
//     //     contextDepQuestion: ['What are you doing now?', 'Did you have any finals today?'],
//     //     castingDepQuestion: {
//     //       thriving: 'You describe your feeling towards the final as WOOOO 🥳, why are you feeling this way?', 
//     //       surviving: "You describe your feeling towards the final as BOOOO 👎, why are you feeling this way?"
//     //     },
//     //   },
//     //   numberNeeded: 10,
//     //   notificationDelay: 1, // 1 seconds for debugging
//     //   allowRepeatContributions : true
//     // },{
//     //   needName: 'Restaurant',
//     //   notificationSubject: "Eating at a restaurant? Yum 😍",
//     //   notificationText: 'Share your food & life with fellow NU seniors in a collective narrative about finals!',
//     //   situation: {
//     //     detector: getDetectorUniqueKey(DETECTORS.bar),
//     //     number: '1'
//     //   },
//     //   toPass: {
//     //     //instruction: 'Can you take a photo of your coffee?',
//     //     prestoryQuestion: 'How are you feeling about your final week of college?',
//     //     dropdownChoices: {
//     //       name: 'casting question',
//     //       options: ['WOOOO 🥳','BOOOO 👎']
//     //     },
//     //     contextDepQuestion: ['What is the occasion?', 'What was the dish on the menu that caught your eye?', 'Are you eating with anyone?', 'Would you recommend this place to other people?'],
//     //     castingDepQuestion: {
//     //       thriving: 'You describe your feeling towards the final as WOOOO 🥳, why are you feeling this way tonight?', 
//     //       surviving: "You describe your feeling towards the final as BOOOO 👎, why are you feeling this way tonight?"
//     //     },
//     //   },
//     //   numberNeeded: 10,
//     //   notificationDelay: 120, // 1 seconds for debugging
//     //   allowRepeatContributions : true
//     // },{
//     //   needName: 'Coffee',
//     //   notificationSubject: 'They say coffee is the key to your soul.',
//     //   notificationText: 'Join your fellow NU seniors in this collective narrative about life during finals season',
//     //   situation: {
//     //     detector: getDetectorUniqueKey(DETECTORS.coffee),
//     //     number: '1'
//     //   },
//     //   toPass: {
//     //     //instruction: 'Can you take a photo of your coffee?',
//     //     prestoryQuestion: 'How are you feeling getting coffee during finals?',
//     //     dropdownChoices: {
//     //       name: 'casting question',
//     //       options: ['WOOOO 🥳','BOOOO 👎']
//     //     },
//     //     contextDepQuestion: ['What are you doing at the coffee shop?', 'What did you get?', 'Why did you go to this coffee shop?'],
//     //     castingDepQuestion: {
//     //       thriving: 'You describe your feeling towards the final as WOOOO 🥳, why does going to the coffee shop make you feel this way?', 
//     //       surviving: "You describe your feeling towards the final as BOOOO 👎, why does going to the coffee shop make you feel this way?"
//     //     },
//     //   },
//     //   numberNeeded: 10,
//     //   notificationDelay: 20, // 1 seconds for debugging
//     //   allowRepeatContributions : true
//     // }, {
//     //   needName: 'Library',
//     //   notificationSubject: 'Inside a library?',
//     //   notificationText: 'Join your fellow NU seniors in this collective narrative about life during finals season',
//     //   situation: {
//     //     detector: getDetectorUniqueKey(DETECTORS.library),
//     //     number: '1'
//     //   },
//     //   toPass: {
//     //     //To do: change them to arrays to allow more flexibility
//     //     prestoryQuestion: 'How are you feeling going to a library during finals?',
//     //     dropdownChoices: {
//     //       name: 'casting question',
//     //       options: ['WOOOO 🥳','BOOOO 👎']
//     //     },
//     //     contextDepQuestion: ['Why did you go to the library?', 'What are you doing at the library?', 'How long will you be staying at the library?'],
//     //     castingDepQuestion: {
//     //       thriving: 'You describe your feeling towards the final as WOOOO 🥳, why does going to the library make you feel this way?', 
//     //       surviving: "You describe your feeling towards the final as BOOOO 👎, why does going to the library make you feel this way?"
//     //     },
//     //   },
//     //   numberNeeded: 10,
//     //   notificationDelay: 1, // 1 seconds for debugging
//     //   allowRepeatContributions : true
//     // }, {
//     //   needName: 'Noon',
//     //   notificationSubject: "What are you having for lunch?",
//     //   notificationText: 'Join your fellow NU seniors in this collective narrative about life during finals season',
//     //   situation: {
//     //     detector: getDetectorUniqueKey(DETECTORS.hour12),
//     //     number: '1'
//     //   },
//     //   toPass: {
//     //     //instruction: 'Can you take a photo of your coffee?',
//     //     prestoryQuestion: 'How are you feeling about your final week of college?',
//     //     dropdownChoices: {
//     //       name: 'casting question',
//     //       options: ['WOOOO 🥳','BOOOO 👎']
//     //     },
//     //     contextDepQuestion: ['What are you doing right now?', 'What are you having for lunch?'],
//     //     castingDepQuestion: {
//     //       thriving: 'You describe your feeling towards the final as WOOOO 🥳, why are you feeling this way today?', 
//     //       surviving: "You describe your feeling towards the final as BOOOO 👎, why are you feeling this way today?"
//     //     },
//     //   },
//     //   numberNeeded: 10,
//     //   notificationDelay: 1, // 1 seconds for debugging
//     //   allowRepeatContributions : true
//     // },{
//     //   needName: 'Lakefill',
//     //   notificationSubject: 'Must be a good day to walk on the Lakefill.',
//     //   notificationText: 'Join your fellow NU seniors in this collective narrative about life during finals season',
//     //   situation: {
//     //     detector: getDetectorUniqueKey(DETECTORS.lakefill), //
//     //     number: '1'
//     //   },
//     //   toPass: {
//     //     //To do: change them to arrays to allow more flexibility
//     //     prestoryQuestion: 'How are you feeling going to the Lakefill during finals?',
//     //     dropdownChoices: {
//     //       name: 'casting question',
//     //       options: ['WOOOO 🥳','BOOOO 👎']
//     //     },
//     //     contextDepQuestion: ['What are you doing at the Lakefill?', 'How’s the crowd today at the Lakefill?', 'What does the lake look like today? Can you see the Chicago skyline?'],
//     //     castingDepQuestion: {
//     //       thriving: 'You describe your feeling towards the final as WOOOO 🥳, why does going to the Lakefill make you feel this way?', 
//     //       surviving: "You describe your feeling towards the final as BOOOO 👎, why does going to the Lakefill make you feel this way?"
//     //     },
//     //   },
//     //   numberNeeded: 10,
//     //   notificationDelay: 1, // 1 seconds for debugging
//     //   allowRepeatContributions : true
//     // }, {
//     //   needName: 'Norris',
//     //   notificationSubject: 'Hanging out at Norris?',
//     //   notificationText: 'Join your fellow NU seniors in this collective narrative about life during finals season',
//     //   situation: {
//     //     detector: getDetectorUniqueKey(DETECTORS.norris), //
//     //     number: '1'
//     //   },
//     //   toPass: {
//     //     //To do: change them to arrays to allow more flexibility
//     //     prestoryQuestion: 'How are you feeling going to Norris during finals?',
//     //     dropdownChoices: {
//     //       name: 'casting question',
//     //       options: ['WOOOO 🥳','BOOOO 👎']
//     //     },
//     //     contextDepQuestion: ['What are you doing at Norris?', 'Did you get anything to eat or drink?', 'Who did you go to Norris with?'],
//     //     castingDepQuestion: {
//     //       thriving: 'You describe your feeling towards the final as WOOOO 🥳, why does going to Norris make you feel this way?', 
//     //       surviving: "You describe your feeling towards the final as BOOOO 👎, why does going to Norris make you feel this way?"
//     //     },
//     //   },
//     //   numberNeeded: 10,
//     //   notificationDelay: 1, // 1 seconds for debugging
//     //   allowRepeatContributions : true
//     // }, {
//     //   needName: 'Weber Arch',
//     //   notificationSubject: 'We love the Arch!',
//     //   notificationText: '',
//     //   situation: {
//     //     detector: getDetectorUniqueKey(DETECTORS.thearch), //
//     //     number: '1'
//     //   },
//     //   toPass: {
//     //     //To do: change them to arrays to allow more flexibility
//     //     prestoryQuestion: 'How are you feeling about your last week of college?',
//     //     dropdownChoices: {
//     //       name: 'casting question',
//     //       options: ['WOOOO 🥳','BOOOO 👎']
//     //     },
//     //     contextDepQuestion: ['You have stayed near the Arch for the past 5 minutes. What are you doing?'],
//     //     castingDepQuestion: {
//     //       thriving: 'You describe your feeling towards this week as WOOOO 🥳, why do you feel this way?', 
//     //       surviving: "You describe your feeling towards this week as BOOOO 👎, why do you feel this way?"
//     //     },
//     //   },
//     //   numberNeeded: 10,
//     //   notificationDelay: 300, // 1 seconds for debugging
//     //   allowRepeatContributions : true
//     // }],
//     // //overwritten
//     // description: 'Share your experience & feelings about the finals',
//     // notificationText: 'Tell a collective narrative with fellow seniors!',
//     // callbacks: [{
//     //   trigger: 'cb.numberOfSubmissions() === 5',
//     //   function: sendNotificationCN.toString()
//     // },{
//     //   trigger: 'cb.numberOfSubmissions() === 10',
//     //   function: sendNotificationCN.toString()
//     // },{
//     //   trigger: 'cb.numberOfSubmissions() === 15',
//     //   function: sendNotificationCN.toString()
//     // },{
//     //   trigger: 'cb.numberOfSubmissions() === 20',
//     //   function: sendNotificationCN.toString()
//     // }
//   ]
//   },
// }