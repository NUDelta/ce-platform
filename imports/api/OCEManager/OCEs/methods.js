import { Meteor } from "meteor/meteor";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import { SimpleSchema } from "meteor/aldeed:simple-schema";

import { Experiences } from "./experiences.js";
import { Schema } from "../../schema.js";
import { getUnfinishedNeedNames } from "../progressorHelper";
import {
  getPlaceKeys,
  matchAffordancesWithDetector,
  onePlaceNotThesePlacesSets,
  placeSubsetAffordances,
} from "../../UserMonitor/detectors/methods";
// import { createNewId } from '../../../startup/server/fixtures.js';

import { Incidents } from "./experiences";
import {
  Assignments,
  Availability,
  ParticipatingNow,
} from "../../OpportunisticCoordinator/databaseHelpers";
import { Submissions } from "../../OCEManager/currentNeeds";
import { serverLog } from "../../logs";
import { setIntersection } from "../../custom/arrayHelpers";

import { sendSystemMessage, postExpInChat } from "../../Messages/methods";
import { notify } from "../../OpportunisticCoordinator/server/noticationMethods";

/**
 * Loops through all unmet needs and returns all needs a user matches with.
 *
 * @param uid {string} uid of user to find matches for
 * @param affordances {object} dictionary of user's affordances, potentially nested
 * e.g.,
 * {
     'sunny': true,
     'trader_joes_evanston': {
       'grocery': true
     }
   }
 * @returns matches {object} object with keys as iids and values as array of matched [place, need] arrays
 *    e.g., { iid : [ (place1, needName1), (place2, needName1), (place3, needName2), ... ], ... }
 */
export const findMatchesForUser = (uid, affordances) => {
  let matches = {};
  let unfinishedNeeds = getUnfinishedNeedNames();

  // @see detectors.tests.js -- Helpers for Nested {Place: {Affordance: true}} for more details
  let placeKeys = getPlaceKeys(affordances);
  let currentPlace_notThesePlaces = onePlaceNotThesePlacesSets(placeKeys);

  //console.log('unfinishedNeeds', unfinishedNeeds);

  // constructing matches to look like {iid : [ (place, needName, distance), ... ], ... }
  // unfinishedNeeds = {iid : [needName] }
  _.forEach(unfinishedNeeds, (needNames, iid) => {
    _.forEach(needNames, (needName) => {
      _.forEach(
        currentPlace_notThesePlaces,
        (placeToMatch_ignoreThesePlaces) => {
          let [placeToMatch, ignoreThesePlaces] =
            placeToMatch_ignoreThesePlaces;
          let [affordanceSubsetToMatchForPlace, distInfo] =
            placeSubsetAffordances(affordances, ignoreThesePlaces);

          let doesMatchPredicate = doesUserMatchNeed(
            uid,
            affordanceSubsetToMatchForPlace,
            iid,
            needName
          );

          if (doesMatchPredicate) {
            if (matches[iid]) {
              let place_needs = matches[iid];
              place_needs.push([placeToMatch, needName, distInfo["distance"]]);
              matches[iid] = place_needs;
            } else {
              matches[iid] = [[placeToMatch, needName, distInfo["distance"]]];
            }
          }
        }
      );
    });
  });

  return matches;
};

/**
 *
 * @param beforeAvails
 * @param afterAvails
 * @return sustainedAvailDict {{Object}}
 *    e.g., {"QybuLeDFSbTijxFbi":[["whole_foods_market_evanston_2","Shopping for groceries",5.108054606381277]]}
 */
export const sustainedAvailabilities = function (beforeAvails, afterAvails) {
  let incidentIntersection = setIntersection(
    Object.keys(beforeAvails),
    Object.keys(afterAvails)
  );
  let sustainedAvailDict = {};
  _.forEach(incidentIntersection, (incident) => {
    let beforePlacesAndNeeds = beforeAvails[incident].map((place_need_dist) =>
      place_need_dist.slice(0, 2)
    );
    let afterPlacesAndNeeds = afterAvails[incident].map((place_need_dist) =>
      place_need_dist.slice(0, 2)
    );

    let sustainedPlace_Needs = setIntersection(
      beforePlacesAndNeeds,
      afterPlacesAndNeeds
    );
    console.log(JSON.stringify(afterAvails[incident]));
    console.log(JSON.stringify(sustainedPlace_Needs));
    if (sustainedPlace_Needs.length) {
      let sustainedPlace_Need_Distances = sustainedPlace_Needs.map(
        (sustainedPlace_Need) =>
          afterAvails[incident].find(
            (place_need_dict) =>
              JSON.stringify(place_need_dict.slice(0, 2)) ==
              JSON.stringify(sustainedPlace_Need)
          )
      );
      sustainedAvailDict[incident] = sustainedPlace_Need_Distances;
    }
  });
  return sustainedAvailDict;
};

// TODO: ryan do this plz.
/**
 * Checks if a user matches a need.
 * Match determined using AA/Affinder to check what affordances a user has and determine if it matches the need.
 *
 * @param uid {string} uid of user
 * @param affordances {object} dictionary of user's affordances
 * @param iid {string} iid of incident to determine matching
 * @param needName {string} name of need to determine match for
 * @returns {boolean} whether user matches need queried for
 */
export const doesUserMatchNeed = (uid, affordances, iid, needName) => {
  let need = getNeedFromIncidentId(iid, needName);
  if (!need) {
    // serverLog.call({message: `doesUserMatchNeed: need not found for {needName: ${needName}, iid: ${iid}}`});
    return false;
  } else {
    let detectorUniqueKey = need.situation.detector;
    return matchAffordancesWithDetector(affordances, detectorUniqueKey);
  }
};

// TODO: Clean this up if possible
export const updateUserExperiences = new ValidatedMethod({
  name: "experiences.updateUser",
  validate: new SimpleSchema({
    userId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  }).validator(),
  run({ userId }) {
    let user = Meteor.users.findOne(userId);
    let exps = Experiences.find()
      .fetch()
      .filter((doc) => {
        let match = true;

        doc.requirements.forEach((req) => {
          if (!user.profile.qualifications[req]) {
            match = false;
          }
        });

        return match;
      })
      .map((doc) => {
        return doc._id;
      });

    Meteor.users.update(userId, { $set: { "profile.experiences": exps } });

    let subs = user.profile.subscriptions;
    subs = subs.filter((sub) => {
      return _.contains(exps, sub);
    });

    Meteor.users.update(userId, { $set: { "profile.subscriptions": subs } });
  },
});

/**
 * Not enough to remove experiences.
 * Incidents need to be removed.
 * Associated Submissions need to be removed.
 * Associated
 */
export const removeExperience = new ValidatedMethod({
  name: "experiences.remove",
  validate: new SimpleSchema({
    experienceId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  }).validator(),
  run({ experienceId }) {
    Experiences.remove(experienceId);
  },
});

/**
 * FIXME(rlouie): define [Schema.ContributionTypes] and [Schema.CallbackPair]
 * so that we can use this ValidatedMethod for inserting experiences
 * in contrast to simply Experience.insert(exp) without checking the JSON
 */
export const createExperience = new ValidatedMethod({
  name: "api.createExperience",
  validate: new SimpleSchema({
    name: {
      type: String,
    },
    description: {
      type: String,
      label: "Experience description",
      optional: true,
    },
    image: {
      type: String,
      label: "Experience image url",
      optional: true,
    },
    participateTemplate: {
      type: String,
    },
    resultsTemplate: {
      type: String,
    },
    notificationText: {
      type: String,
    },
    contributionGroups: {
      type: [Schema.ContributionTypes],
    },
    callbackPair: {
      type: [Schema.CallbackPair],
    },
  }).validator(),
  run({
    name,
    description,
    image,
    participateTemplate,
    resultsTemplate,
    contributionGroups,
    notificationStrategy,
    notificationText,
    callbackPair,
  }) {
    //console.log('validated');

    const experience = {
      name: name,
      description: description,
      image: image,
      participateTemplate: participateTemplate,
      resultsTemplate: resultsTemplate,
      contributionGroups: contributionGroups,
      notificationStrategy: notificationStrategy,
      notificationText: notificationText,
      callbackPair: callbackPair,
    };

    return Experiences.insert(experience, (err) => {
      if (err) {
        console.log(err);
      }
    });
  },
});

Meteor.methods({
  createAndstartIncident(eid) {
    let experience = Experiences.findOne(eid);
    startRunningIncident(createIncidentFromExperience(experience));
  },
  addNeed({ iid, need }) {
    new SimpleSchema({
      iid: { type: String },
      need: { type: Schema.NeedType },
    }).validate({ iid, need });

    addContribution(iid, need);
  },
  updateSubmissionNeedName({ iid, eid, oldNeedName, newNeedName }) {
    new SimpleSchema({
      iid: { type: String },
      eid: { type: String },
      oldNeedName: { type: String },
      newNeedName: { type: String },
    }).validate({ iid, eid, oldNeedName, newNeedName });

    updateSubmissionNeedName(iid, eid, oldNeedName, newNeedName);
  },
  changeExperienceToPass({ eid, needName, toPass, field }) {
    new SimpleSchema({
      eid: { type: String },
      needName: { type: String },
      toPass: { type: String },
      field: { type: String },
    }).validate({ eid, needName, toPass, field });

    changeExperienceToPass(eid, needName, toPass, field);
  },
  expCompleteCallback(
    sub,
    setParticipatedKey,
    systemMsg,
    notifMsg,
    waitOnPartnerSubmissionKey
  ) {
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName,
    }).fetch();

    let expInChat = submissions.map((submission) => {
      return {
        uid: submission.uid,
        name: Meteor.users.findOne(submission.uid).profile.firstName,
        text: submission.content.sentence,
        image: submission.content.proof,
        time: submission.timestamp,
      };
    });

    let participants = submissions.map((submission) => {
      return submission.uid;
    });
    let userUpdateKey = "profile.staticAffordances." + setParticipatedKey;
    let submissionUpdateKey =
      "profile.waitOnPartnerSubmission." + waitOnPartnerSubmissionKey;
    let waitOnUserSubmissionKey = "profile.waitOnUserSubmission." + waitOnPartnerSubmissionKey;

    participants.forEach(function (p) {
      Meteor.users.update(
        {
          _id: p,
        },
        {
          $set: {
            [userUpdateKey]: true,
            [submissionUpdateKey]: false,
            [waitOnUserSubmissionKey]: false,
          },
        }
      );
    });

    let route = `/chat`;
    
    postExpInChat("", participants, expInChat);
    sendSystemMessage(systemMsg, participants, null);
    notify(participants, sub.iid, "Cerebro", notifMsg, route);

    //respawn the new experience
    let contributionTypes = Incidents.findOne({
      _id: sub.iid,
    }).contributionTypes;
    let need = contributionTypes.find((x) => {
      return x.needName === sub.needName;
    });
    // Convert Need Name i to Need Name i+1
    let splitName = sub.needName.split(" ");
    let iPlus1 = Number(splitName.pop()) + 1;
    splitName.push(iPlus1);
    let newNeedName = splitName.join(" ");

    need.needName = newNeedName;
    addContribution(sub.iid, need);
  },
  expInProgressCallback(
    sub,
    systemMsg,
    notifMsg,
    confirmationMsg,
    waitOnPartnerSubmissionKey
  ) {
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName,
    }).fetch();

    let participantId = submissions.map((submission) => {
      return submission.uid;
    });
    let participant = Meteor.users.findOne(participantId[0]);

    //update waitOnPartnerSubmission to true
    let updateKey =
      "profile.waitOnPartnerSubmission." + waitOnPartnerSubmissionKey;
    Meteor.users.update(
      {
        _id: participantId[0],
      },
      {
        $set: {
          [updateKey]: true,
        },
      }
    );

    //find partner
    let aff = participant.profile.staticAffordances;
    let pair = Object.keys(aff).filter((k) => k.search("pair") != -1)[0];
    let partner = Meteor.users
      .find()
      .fetch()
      .filter(
        (u) => u._id != participantId[0] && pair in u.profile.staticAffordances
      );
    partner = partner.map((u) => u._id);
    updateKey = "profile.waitOnUserSubmission." + waitOnPartnerSubmissionKey;
    Meteor.users.update(
      {
        _id: partner[0],
      },
      {
        $set: {
          [updateKey]: true,
        },
      }
    );

    sendSystemMessage(systemMsg, partner, "/chat");
    sendSystemMessage(confirmationMsg, participantId[0], null);
    Meteor.call("sendNotification", partner, "Cerebro", notifMsg);
  },
  selfIntroCompleteCallback(sub, setParticipatedKey, systemMsg, notifMsg) {
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName,
    }).fetch();

    let expInChat = submissions.map((submission) => {
      return {
        uid: submission.uid,
        name: Meteor.users.findOne(submission.uid).profile.firstName,
        text: submission.content.sentence,
        image: submission.content.proof,
        time: submission.timestamp,
      };
    });

    let participants = submissions.map((submission) => {
      return submission.uid;
    });
    let userUpdateKey = "profile.staticAffordances." + setParticipatedKey;

    participants.forEach(function (p) {
      Meteor.users.update(
        {
          _id: p,
        },
        {
          $set: {
            [userUpdateKey]: true,
          },
        }
      );
    });

    let route = `/chat`;

    sendSystemMessage(systemMsg, participants, null);
    postExpInChat("", participants, expInChat);
    notify(participants, sub.iid, "Cerebro", notifMsg, route);
  },
});

export const addContribution = (iid, contribution) => {
  Incidents.update(
    {
      _id: iid,
    },
    {
      $push: { contributionTypes: contribution },
    }
  );
  addEmptySubmissionsForNeed(iid, Incidents.findOne(iid).eid, contribution);

  Availability.update(
    {
      _id: iid,
    },
    {
      $push: { needUserMaps: { needName: contribution.needName, users: [] } },
    }
  );

  Assignments.update(
    {
      _id: iid,
    },
    {
      $push: { needUserMaps: { needName: contribution.needName, users: [] } },
    }
  );

  ParticipatingNow.update(
    {
      _id: iid,
    },
    {
      $push: { needUserMaps: { needName: contribution.needName, users: [] } },
    }
  );
};

//uhhhh this is too specific to imitation game
export const changeIncidentToPass = (iid, needName, field1, field2) => {
  let incident = Incidents.findOne({
    _id: iid,
  });

  let contributionTypeIndex = 0;

  if (incident) {
    for (let i = 0; i < incident.contributionTypes.length; i++) {
      if (incident.contributionTypes[i].needName === needName) {
        contributionTypeIndex = i;
      }
    }
  }

  let search1 = `contributionTypes.${contributionTypeIndex}.toPass.${field1}`;
  let search2 = `contributionTypes.${contributionTypeIndex}.toPass.${field2}`;

  Incidents.update(
    {
      _id: iid,
    },
    {
      $set: {
        [search1]: false,
        [search2]: true,
      },
    }
  );
};

export const changeExperienceToPass = (eid, needName, toPass, field) => {
  //first must find correct contributionType via needName & then update
  //only that contributionType with new toPass
  let experience = Experiences.findOne({
    _id: eid,
  });

  let contributionTypeIndex = 0;

  if (experience) {
    for (let i = 0; i < experience.contributionTypes.length; i++) {
      if (experience.contributionTypes[i].needName === needName) {
        contributionTypeIndex = i;
      }
    }
  }

  let search = `contributionTypes.${contributionTypeIndex}.toPass.${field}`;

  Experiences.update(
    {
      _id: eid,
    },
    {
      $set: {
        [search]: toPass,
      },
    }
  );
};

export const addEmptySubmissionsForNeed = (iid, eid, need) => {
  let i = 0;
  while (i < need.numberNeeded) {
    // let id;
    // if (i == 0) {
    //   id = need.needName + "Z";
    // } else {
    //   id = need.needName + "Y";
    // }
    // id = createNewId("s", id);
    i++;

    // if (!Submissions.findOne({_id: id})){
    Submissions.insert(
      {
        eid: eid,
        iid: iid,
        needName: need.needName,
      },
      (err) => {
        if (err) {
          console.log("upload error,", err);
        }
      }
    );
    // }
  }
};

/**
 *
 * @param iid
 * @param eid
 * @param oldNeedName
 * @param newNeedName
 */
export const updateSubmissionNeedName = (
  iid,
  eid,
  oldNeedName,
  newNeedName
) => {
  Submissions.update(
    {
      iid: iid,
      eid: eid,
      needName: oldNeedName,
    },
    {
      $set: {
        needName: newNeedName,
      },
    },
    {
      multi: true,
    }
  );
};

export const startRunningIncident = (incident) => {
  let needUserMaps = [];

  _.forEach(incident.contributionTypes, (need) => {
    needUserMaps.push({ needName: need.needName, users: [] });
    addEmptySubmissionsForNeed(incident._id, incident.eid, need);
  });

  Availability.insert({
    _id: incident._id,
    needUserMaps: needUserMaps,
  });

  Assignments.insert({
    _id: incident._id,
    needUserMaps: needUserMaps,
  });

  ParticipatingNow.insert({
    _id: incident._id,
    needUserMaps: needUserMaps,
  });
};

/**
 * For contributionTypes, please don't change up the number of needs! We don't handle that type of changes.
 * Changes in needName are fine.
 *
 * @param incident
 */
export const updateRunningIncident = (incident) => {
  let needUserMaps = [];

  _.forEach(incident.contributionTypes, (need) => {
    needUserMaps.push({ needName: need.needName, users: [] });
    // FIXME(rlouie): not accessing old need names here, so another function has to do this manually on submissions
  });

  Availability.update(
    {
      _id: incident._id,
    },
    {
      $set: {
        needUserMaps: needUserMaps,
      },
    }
  );

  Assignments.update(
    {
      _id: incident._id,
    },
    {
      $set: {
        needUserMaps: needUserMaps,
      },
    }
  );

  ParticipatingNow.update(
    {
      _id: incident._id,
    },
    {
      $set: {
        needUserMaps: needUserMaps,
      },
    }
  );
};

/**
 * Given an experience object, creates an incident
 * @param experience {object} of the created incident
 */
export const createIncidentFromExperience = (experience) => {
  // let need = experience.contributionTypes[0].needName;
  // need = createNewId("i", need)
  let incident = {
    // _id: need,
    eid: experience._id,
    callbacks: experience.callbacks,
    contributionTypes: experience.contributionTypes,
    allowRepeatContributions: experience.allowRepeatContributions,
  };

  Incidents.insert(incident, (err) => {
    if (err) {
      console.log("error,", err);
    } else {
    }
  });

  return incident;
};

/** Updates Incident based on experience definition;
 * The complement to `createIncidentFromExperience`.
 *
 * @param eid [String] existing experience id
 * @param experience [Object] comes from CONSTANTS.EXPERIENCES
 */
export const updateIncidentFromExperience = (eid, experience) => {
  let incident = {
    callbacks: experience.callbacks,
    contributionTypes: experience.contributionTypes,
  };

  Incidents.update(
    {
      eid: eid,
    },
    {
      $set: incident,
    }
  );

  return Incidents.findOne({ eid: eid });
};

/** Updates the experience in the Experience collection, but keeps the same _id
 * The complement to `Experience.insert(exp)`
 *
 * @param eid [String] existing experience id
 * @param experience [Object] comes from CONSTANTS.EXPERIENCES
 */
export const updateExperienceCollectionDocument = (eid, experience) => {
  delete experience._id;
  Experiences.update(
    {
      _id: eid,
    },
    {
      $set: experience,
    }
  );

  return Experiences.findOne({ _id: eid });
};

/**
 * Finds the need dictionary in an incident given the need's name
 *
 * @param iid {string} incident id we are looking up a need in
 * @param needName {string} name of the need we are looking up
 * @returns {object} need object
 */
export const getNeedFromIncidentId = (iid, needName) => {
  let incident = Incidents.findOne(iid);
  let output = undefined;

  if (!incident) {
    console.error(
      `Error in getNeedFromIncidentId: Could not find incident of iid = ${iid}`
    );
    return false;
  }

  _.forEach(incident.contributionTypes, (need) => {
    if (need.needName === needName) {
      output = need;
      return false;
    }

    // check if found
    if (typeof output === "undefined") {
      return false;
    }
  });

  return output;
};

/**
 * Finds and returns a need's notificationDelay given a iid and needName
 *
 * @param iid {string} incident id we are looking up a need in
 * @param needName {string} name of the need we are looking up
 * @returns {number} seconds to delay execution for the experience
 */
export const getNeedDelay = (iid, needName) => {
  let incident = Incidents.findOne(iid);
  let notificationDelayOutput = 0; // default to no delay if notificationDelay is not found

  _.forEach(incident.contributionTypes, (need) => {
    // set notification delay and terminate for loop early if need names match
    if (need.needName === needName) {
      notificationDelayOutput = need.notificationDelay;
      return false;
    }
  });

  return notificationDelayOutput;
};
