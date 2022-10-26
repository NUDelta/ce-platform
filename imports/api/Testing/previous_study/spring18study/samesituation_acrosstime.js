import {DETECTORS} from "../../DETECTORS";
import { getDetectorUniqueKey } from "../../oce_api_helpers";


let sendNotificationSunset = function (sub) {
  let uids = Submissions.find({ iid: sub.iid }).fetch().map(function (x) {
    return x.uid;
  });

  notify(uids, sub.iid, 'Our sunset timelapse is complete! Click here to see it.', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
};

export default SAMESITUATION_ACROSSTIME = {
  sunset: {
    _id: Random.id(),
    name: 'Sunset',
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'sunset',
    contributionTypes: [{
      needName: 'sunset',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.sunset),
        number: '1'
      },
      toPass: {
        instruction: 'Take a photo of the sunset!'
      },
      numberNeeded: 20,
      notificationDelay: 1,
    }],
    description: 'Create a timelapse of the sunset with others around the country',
    notificationText: 'Take a photo of the sunset!',
    callbacks: [{
      trigger: 'cb.incidentFinished()',
      function: sendNotificationSunset.toString()
    }]
  }
}