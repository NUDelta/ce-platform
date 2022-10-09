import {getDetectorUniqueKey} from "../oce_api_helpers";
import {DETECTORS} from "../DETECTORS";
let sendNotificationCN = function (sub) {
  let uids = Submissions.find({ iid: sub.iid }).fetch().map(function (x) {
    return x.uid;
  });
  
  notify(uids, sub.iid, 'Wooh! There have been new posts added to the collective narrative! Click here to view.', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
};
export default CHEFS_JOURNEY = {
   sample: {
     _id: Random.id(),
     name: 'Please Work',
     prestoryTemplate: 'studyNight',
     participateTemplate: 'cookingJourney',
     resultsTemplate: 'sunset',
     expandTemplate: 'seniorFinalsExpand',
     repeatContributionsToExperienceAfterN: 0,
     contributionTypes: [{
      needName: 'huh',
      notificationSubject: "Hello! :)",
      notificationText: 'How is your DTR deliverable going?',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.coffee), // set to "beginning detector" 
        number: '1'
       },
       toPass: {
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
      numberNeeded: 15,
      notificationDelay: 1, // 1 seconds for debugging
      allowRepeatContributions : true
    }]
  }
}