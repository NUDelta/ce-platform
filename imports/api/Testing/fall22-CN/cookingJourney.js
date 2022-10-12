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
     name: 'Chefs Journey',
     prestoryTemplate: 'chefsKitchen',
     participateTemplate: 'cookingJourney',
     resultsTemplate: 'sunset',
     expandTemplate: 'seniorFinalsExpand',
     repeatContributionsToExperienceAfterN: 0,
     contributionTypes: [{
      needName: 'cooking',
      notificationSubject: "What's on the menu?",
      notificationText: 'Looks like you\'re ready to eat lunch! Share what you\'re cooking with us!',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.hour12), // set to "beginning detector" 
        number: '1'
       },
       toPass: {
      },
      numberNeeded: 1,
      notificationDelay: 1, // 1 seconds for debugging
      allowRepeatContributions : true
    }]
  }
}