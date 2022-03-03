import {DETECTORS} from "../DETECTORS";
import { getDetectorUniqueKey } from "../oce_api_helpers";


let sendNotificationSunset = function (sub) {
  let uids = Submissions.find({ iid: sub.iid }).fetch().map(function (x) {
    return x.uid;
  });

  notify(uids, sub.iid, 'Our sunset timelapse is complete! Click here to see it.', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
};

const createSunsetTimelapse = () => {

  let apiDefinition = {
    _id: Random.id(),
    name: 'Sunset',
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'sunset',
    description: 'Create a timelapse of the sunset with others around the country',
    notificationText: 'Take a photo of the sunset!',
    callbacks: [{
      trigger: 'cb.incidentFinished()',
      function: sendNotificationSunset.toString()
    }]
  }

  contributionTypes = []
  const minutes_before = 60;
  const minutes_after = 60;
  const interval_size = 5;
  for (let i = minutes_before; i > -1*minutes_after; i -= interval_size) {
    let needName;
    let detectorObjectKey;
    if (i < 0) {
      let min = -1 * i;
      needName = `${min} minutes after sunset`;
      detectorObjectKey = `sunset${min}after`
    }
    else {
      let min = i;
      needName = `${min} minutes before sunset`;
      detectorObjectKey = `sunset${min}before`
    }
    let need = {
      needName: needName,
      situation: {
        detector: getDetectorUniqueKey(DETECTORS[detectorObjectKey]),
        number: 1
      },
      toPass: {
        instruction: 'Take a photo of the sunset!',
        time: i
      },
      numberNeeded: 1,
      notificationDelay: 1
    }
    contributionTypes.push(need);
  }

  contributionTypes.push({
    needName: 'Anytime Tester',
    situation: {
      detector: getDetectorUniqueKey(DETECTORS.daytime),
      number: 1,
    },
    toPass: {
      instruction: 'Take a photo of the sunset!',
      time: 30,
    },
    numberNeeded: 1,
    notificationDelay: 1
  })

  apiDefinition['contributionTypes'] = contributionTypes;
  return apiDefinition;
}

export default ANYTIME_OCES = {
  sunsetTimelapse: createSunsetTimelapse()
}