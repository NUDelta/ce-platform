import {DETECTORS} from "../DETECTORS";
import { getDetectorUniqueKey, addStaticAffordanceToNeeds } from "../oce_api_helpers";

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
      notificationDelay: 0
    }
    contributionTypes.push(need);
  }

  apiDefinition['contributionTypes'] = contributionTypes;
  apiDefinition['anytimeSequential'] = {
    "startingBuckets": 3
  };
  return apiDefinition;
}

let sendNotificationSunset = function (sub) {
  let uids = Submissions.find({ iid: sub.iid }).fetch().map(function (x) {
    return x.uid;
  });

  notify(uids, sub.iid, 'Three new snapshots were added to the sunset timelapse! Click here to see it.', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
};

const createSunsetNeeds = (minutes_before, minutes_after, interval_size) => {
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
        number: 1
      },
      toPass: {
        instruction: ('<p>Do you have <span style="color: #ffa500; font-weight: bold;">a clear view of sunset</span>?</p>' +
          '<p>If <b>no</b>, try to find higher ground where the sun is not covered. Otherwise, <a style="font-weight: bold" href="/affordances">ignore this opportunity and go back</a></p><br>' +
          '<p>If <b>yes</b>, take a snapshot 📸 for the timelapse!</p>'),
        minutes_before: minutes_before,
        minutes_after: minutes_after,
      },
      numberNeeded: 1,
      notificationDelay: 0
    }
    contributionTypes.push(need);
  }
  return contributionTypes;
}

const createSunsetTimelapse = (minutes_before, minutes_after, interval_size) => {

  let apiDefinition = {
    _id: Random.id(),
    name: '🌇 Sunset Timelapse 🌄',
    participateTemplate: 'sunsetTimelapseParticipate',
    resultsTemplate: 'sunset',
    description: 'Create a timelapse of the sunset with others around the country',
    notificationText: 'Do you have a clear view of the sunset? If yes, add to the timelapse!',
    callbacks: [{
      trigger: 'cb.numberOfSubmissions() % 3 === 0',
      function: sendNotificationSunset.toString()
    }],
    anytimeSequential: {
      startingBuckets: 3
    },
  }

  // NOTE: anytime static affordance, so people are assigned properly for the experiment
  apiDefinition['contributionTypes'] = addStaticAffordanceToNeeds('anytime', createSunsetNeeds(minutes_before, minutes_after, interval_size));
  return apiDefinition;
}

const createBaselineSunsetTimelapse = (minutes_before, minutes_after, interval_size) => {
  let apiDefinition = {
    _id: Random.id(),
    name: '🌇 Sunset Timelapse 🌄',
    participateTemplate: 'sunsetTimelapseParticipate',
    resultsTemplate: 'sunset',
    description: 'Create a timelapse of the sunset with others around the country',
    notificationText: 'Do you have a clear view of the sunset? If yes, add to the timelapse!',
    callbacks: [{
      trigger: 'cb.numberOfSubmissions() % 3 === 0',
      function: sendNotificationSunset.toString()
    }],
    // NOTE: explicitly ignore anytimeSequential
  }

  // NOTE: baseline static affordance, so people are assigned properly for the experiment
  apiDefinition['contributionTypes'] = addStaticAffordanceToNeeds('baseline', createSunsetNeeds(minutes_before, minutes_after, interval_size));
  return apiDefinition;
};

export default ANYTIME_OCES = {
  sunsetTimelapse: createSunsetTimelapse(120, 0, 2),
  baselineSunsetTimelapse: createBaselineSunsetTimelapse(120, 0, 2),
  momentsOfHourTimelapse: createMomentsOfTheHourTimelapse()
}
