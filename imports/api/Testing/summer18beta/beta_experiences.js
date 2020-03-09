import { getDetectorUniqueKey } from "../oce_api_helpers";
import {DETECTORS} from "../DETECTORS";


const create24hoursContributionTypes = function(toPassConstructor, numberNeeded) {
  let needs = [];
  for (i = 0; i < 24; i++) {
    let need = {
      needName: `hour ${i}`,
      situation: {
        detector: getDetectorUniqueKey(DETECTORS[`hour${i}`]),
        number: 1
      },
      toPass: toPassConstructor(i),
      numberNeeded: numberNeeded,
      notificationDelay: 1
    };
    needs.push(need);
  }
  return needs;
};

const sendNotificationNew24HourPhotoAlbumSub = function(sub) {
  let uids = Submissions.find({ iid: sub.iid }).fetch().map(function (x) {
    return x.uid;
  });

  notify(uids, sub.iid, 'Someone added to the 24 hour photo album. Click here to see progress on the album.', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
};

const sendNotificationTwoHalvesCompleted = function(sub) {
  console.log("Another pair of halves completed a photo");

  let submissions = Submissions.find({
    iid: sub.iid,
    needName: sub.needName
  }).fetch();

  let participants = submissions.map((submission) => { return submission.uid; });

  notify(participants, sub.iid,
    `Two people completed a half half photo`,
    `See the results under ${sub.needName}`,
    '/apicustomresults/' + sub.iid + '/' + sub.eid);
};

export default BETA_EXPERIENCES = {
  halfhalfDay: {
    _id: Random.id(),
    name: 'Half Half Daytime',
    participateTemplate: 'halfhalfParticipate',
    resultsTemplate: 'halfhalfResults',
    contributionTypes: [{
      needName: 'half half: daytime', // FIXME: make more semantically meaningful
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.daytime),  // For testing during workday
        number: '1'
      },
      toPass: {
        instruction: 'Take a photo of like Half Half Travel!'
      },
      numberNeeded: 50, // arbitrarily high for a study
      notificationDelay: 1,
    }],
    description: 'Create adventures that meet halfway! Ready to live in a parallel with someone else?',
    notificationText: 'Participate in Half Half Travel!',
    callbacks: [{
      trigger: 'cb.numberOfSubmissions("half half: daytime") % 2 === 0',
      function: sendNotificationTwoHalvesCompleted.toString()
    }]
  },
  halfhalfNight: {
    _id: Random.id(),
    name: 'Half Half Nighttime',
    participateTemplate: 'halfhalfParticipate',
    resultsTemplate: 'halfhalfResults',
    contributionTypes: [{
      needName: 'half half: nighttime', // FIXME: make more semantically meaningful
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.night),  // For testing during evening
        number: '1'
      },
      toPass: {
        instruction: 'Take a photo of like Half Half Travel!'
      },
      numberNeeded: 50, // arbitrarily high for a study
      notificationDelay: 1, // no need to delay if its daytime outside
    }],
    description: 'Create adventures that meet halfway! Ready to live in a parallel with someone else?',
    notificationText: 'Participate in Half Half Travel!',
    callbacks: [{
      trigger: 'cb.numberOfSubmissions("half half: nighttime") % 2 === 0',
      function: sendNotificationTwoHalvesCompleted.toString()
    }]
  },
  halfhalf24: {
    _id: Random.id(),
    name: 'Half Half over 24 hours',
    participateTemplate: 'halfhalfParticipate',
    resultsTemplate: 'halfhalfResults', // FIXME(rlouie): should be a template grouped by time
    contributionTypes: create24hoursContributionTypes(
      function(i) {
        let zpad_i = ("00" + i).slice(-2);
        let toPass = {
          instruction: `<span style="color: #0351ff">This experience is for testing the Half Half Photo Experience!</span><b> Take a picture of what you are doing today at hour ${zpad_i}:00 today.</b>`
        };
        return toPass;
      },
      10
    ),
    description: 'Create a photo collage of what you and others are doing at each of the hours in a day',
    notificationText: 'Take a photo of what you are doing at this hour',
    callbacks: [{
      trigger: 'cb.newSubmission()',
      function: sendNotificationNew24HourPhotoAlbumSub.toString()
    }]
  },
}