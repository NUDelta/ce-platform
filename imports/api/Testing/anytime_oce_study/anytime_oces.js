import {DETECTORS} from "../DETECTORS";
import { getDetectorUniqueKey } from "../oce_api_helpers";


let sendNotificationSunset = function (sub) {
  let uids = Submissions.find({ iid: sub.iid }).fetch().map(function (x) {
    return x.uid;
  });

  notify(uids, sub.iid, 'Our sunset timelapse is complete! Click here to see it.', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
};

const createSunsetTimelapse = (minutes_before, minutes_after, interval_size) => {

  let apiDefinition = {
    _id: Random.id(),
    name: 'Sunset',
    participateTemplate: 'sunsetTimelapseParticipate',
    resultsTemplate: 'sunset',
    description: 'Create a timelapse of the sunset with others around the country',
    notificationText: 'Take a photo of the sunset!',
    callbacks: [{
      trigger: 'cb.incidentFinished()',
      function: sendNotificationSunset.toString()
    }]
  }

  contributionTypes = []
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
        // detector: getDetectorUniqueKey(DETECTORS.night), // gotta think more about how dynamic participate works here
        number: 1
      },
      toPass: {
        instruction: 'Take a photo of the sunset!',
      },
      numberNeeded: 1,
      notificationDelay: 1
    }
    contributionTypes.push(need);
  }

  apiDefinition['contributionTypes'] = contributionTypes;
  apiDefinition['anytimeSequential'] = {
    "startingBuckets": 3
  };
  return apiDefinition;
}

/**
 * Testing experience so we can get define needs based on minute timeblocks, at any hour of the day
 */
const createMomentsOfTheHourTimelapse = () => {
  let apiDefinition = {
    _id: Random.id(),
    name: 'Moments of the Hour',
    participateTemplate: 'sunsetTimelapseParticipate',
    resultsTemplate: 'sunset',
    description: 'Create a timelapse of the hour with others around the country',
    notificationText: 'Take a photo that captures a moment of the hour!',
    callbacks: [{
      trigger: 'cb.incidentFinished()',
      function: sendNotificationSunset.toString()
    }]
  }

  contributionTypes = []
  let b = 2; // block size
  for (let i = 0; i < 60; i += b) {
    let needName = `A moment at ${i} minutes past the hour`;
    let detectorObjectKey = `block_starting_at_${i}`;
    let need = {
      needName: needName,
      situation: {
        detector: getDetectorUniqueKey(DETECTORS[detectorObjectKey]),
        number: 1
      },
      toPass: {
        instruction: 'Take a photo that captures a moment of the hour!',
      },
      numberNeeded: 1,
      notificationDelay: 1
    }
    contributionTypes.push(need);
  }

  apiDefinition['contributionTypes'] = contributionTypes;
  apiDefinition['anytimeSequential'] = {
    "startingBuckets": 3
  };
  return apiDefinition;
}


export default ANYTIME_OCES = {
  sunsetTimelapse: createSunsetTimelapse(75, 15, 2),
  momentsOfHourTimelapse: createMomentsOfTheHourTimelapse()
}