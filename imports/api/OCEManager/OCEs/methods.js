import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Experiences } from './experiences.js';
import { Schema } from '../../schema.js';
import { getUnfinishedNeedNames } from '../progressorHelper';
import { matchAffordancesWithDetector, getPlaceKeys,
  onePlaceNotThesePlacesSets, placeSubsetAffordances } from "../../UserMonitor/detectors/methods";

import { Incidents } from './experiences';
import { Assignments, Availability } from '../../OpportunisticCoordinator/databaseHelpers';
import { Submissions } from '../../OCEManager/currentNeeds';
import {serverLog} from "../../logs";


/**
 * Clears current availabilities for a user given a uid.
 * @param uid {string} user to clear data for
 */
export const clearAvailabilitiesForUser = (uid) => {
  let availabilityObjects = Availability.find().fetch();
  _.forEach(availabilityObjects, (av) => {
    // remove user for each need in each
    _.forEach(av.needUserMaps, (needEntry) => {
      Availability.update({
        _id: av._id,
        'needUserMaps.needName': needEntry.needName,
      }, {
        $pull: {'needUserMaps.$.uids': uid}
      });
    });
  });
};

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

  // constructing matches to look like {iid : [ (place, needName), ... ], ... }
  // unfinishedNeeds = {iid : [needName] }
  _.forEach(unfinishedNeeds, (needNames, iid) => {
    _.forEach(needNames, (needName) => {
      _.forEach(currentPlace_notThesePlaces, (placeToMatch_ignoreThesePlaces) => {
        let [placeToMatch, ignoreThesePlaces] = placeToMatch_ignoreThesePlaces;
        let affordanceSubsetToMatchForPlace = placeSubsetAffordances(affordances, ignoreThesePlaces);

        let doesMatchPredicate = doesUserMatchNeed(uid, affordanceSubsetToMatchForPlace, iid, needName);

        if (doesMatchPredicate) {
          if (matches[iid]) {
            let place_needs = matches[iid];
            place_needs.push([placeToMatch, needName]);
            matches[iid] = place_needs;
          } else {
            matches[iid] = [[placeToMatch, needName]];
          }
        }
      });
   });
  });

  return matches;
};

export const sustainedAvailabilities = function(beforeAvails, afterAvails) {
  let incidentIntersection = setIntersection(Object.keys(beforeAvails), Object.keys(afterAvails));
  let sustainedAvailDict = {};
  _.forEach(incidentIntersection, (incident) => {
    let sustainedPlace_Need = setIntersection(beforeAvails[incident], afterAvails[incident]);
    if (sustainedPlace_Need.length) {
      sustainedAvailDict[incident] = sustainedPlace_Need;
    }
  });
  return sustainedAvailDict;
};

export const setIntersection = function(A, B) {
  let A_with_string_elements = A.map((e) => { return JSON.stringify(e)});
  let B_with_string_elements = B.map((e) => { return JSON.stringify(e)});
  let beforeSet = new Set(A_with_string_elements);
  let afterSet = new Set(B_with_string_elements);

  let intersection = new Set(
    [...beforeSet].filter(x => afterSet.has(x)));

  return Array.from(intersection).map((e) => { return JSON.parse(e)});
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
    serverLog.call({message: `doesUserMatchNeed: need not found for {needName: ${needName}, iid: ${iid}}`});
    return false;
  } else {
    let detectorId = need.situation.detector;
    return matchAffordancesWithDetector(affordances, detectorId);
  }
};

// TODO: Clean this up if possible
export const updateUserExperiences = new ValidatedMethod({
  name: 'experiences.updateUser',
  validate: new SimpleSchema({
    userId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),
  run({ userId }) {
    let user = Meteor.users.findOne(userId);
    let exps = Experiences.find().fetch().filter((doc) => {
      let match = true;

      doc.requirements.forEach((req) => {
        if (!user.profile.qualifications[req]) {
          match = false;
        }
      });

      return match;
    }).map((doc) => {
      return doc._id;
    });

    Meteor.users.update(userId, { $set: { 'profile.experiences': exps } });

    let subs = user.profile.subscriptions;
    subs = subs.filter((sub) => {
      return _.contains(exps, sub);
    });

    Meteor.users.update(userId, { $set: { 'profile.subscriptions': subs } });
  }
});

export const removeExperience = new ValidatedMethod({
  name: 'experiences.remove',
  validate: new SimpleSchema({
    experienceId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),
  run({ experienceId }) {
    Experiences.remove(experienceId);
  }
});

/**
 * FIXME(rlouie): define [Schema.ContributionTypes] and [Schema.CallbackPair]
 * so that we can use this ValidatedMethod for inserting experiences
 * in contrast to simply Experience.insert(exp) without checking the JSON
 */
export const createExperience = new ValidatedMethod({
  name: 'api.createExperience',
  validate: new SimpleSchema({
    name: {
      type: String
    },
    description: {
      type: String,
      label: 'Experience description',
      optional: true
    },
    image: {
      type: String,
      label: 'Experience image url',
      optional: true
    },
    participateTemplate: {
      type: String
    },
    resultsTemplate: {
      type: String
    },
    notificationText: {
      type: String
    },
    contributionGroups: {
      type: [Schema.ContributionTypes]
    },
    callbackPair: {
      type: [Schema.CallbackPair]
    },
  }).validator(),
  run({
        name, description, image, participateTemplate, resultsTemplate, contributionGroups,
        notificationStrategy, notificationText, callbackPair
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
      callbackPair: callbackPair
    };

    return Experiences.insert(experience, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
});

Meteor.methods({
  createAndstartIncident(eid) {
    let experience = Experiences.findOne(eid);
    startRunningIncident(createIncidentFromExperience(experience));
  },
  addNeed({iid, need}) {
    new SimpleSchema({
      iid: {type: String},
      need: {type: Schema.NeedType}
    }).validate({iid, need});

    addContribution(iid, need);
  },
  updateSubmissionNeedName({iid, eid, oldNeedName, newNeedName}) {
    new SimpleSchema({
      iid: {type: String},
      eid: {type: String},
      oldNeedName: {type: String},
      newNeedName: {type: String}
    }).validate({iid, eid, oldNeedName, newNeedName});

    updateSubmissionNeedName(iid, eid, oldNeedName, newNeedName);
  }
});

export const addContribution = (iid, contribution) =>{
  Incidents.update({
    _id: iid,
  }, {
    $push: {contributionTypes: contribution}
  });
  addEmptySubmissionsForNeed(iid, Incidents.findOne(iid).eid, contribution);

  Availability.update({
    _id: iid
  },{
    $push: {needUserMaps: {needName: contribution.needName, uids: []}}
  });

  Assignments.update({
    _id: iid
  },{
    $push: {needUserMaps: {needName: contribution.needName, uids: []}}
  });
};

export const addEmptySubmissionsForNeed = (iid, eid, need) => {
  let i = 0;
  while (i < need.numberNeeded) {
    i++;

    Submissions.insert({
      eid: eid,
      iid: iid,
      needName: need.needName,
    }, (err) => {
      if (err) {
        console.log('upload error,', err);
      }
    });


  }
};

/**
 *
 * @param iid
 * @param eid
 * @param oldNeedName
 * @param newNeedName
 */
export const updateSubmissionNeedName = (iid, eid, oldNeedName, newNeedName) => {
  Submissions.update(
    {
      iid: iid,
      eid: eid,
      needName: oldNeedName
    }, {
      $set: {
        needName: newNeedName
      }
    }, {
      multi: true
    }
  )
};

export const startRunningIncident = (incident) => {
  let needUserMaps = [];

  _.forEach(incident.contributionTypes, (need) => {
    needUserMaps.push({needName: need.needName, uids: []});
    addEmptySubmissionsForNeed(incident._id, incident.eid, need);

  });

  Availability.insert({
    _id: incident._id,
    needUserMaps: needUserMaps
  });

  Assignments.insert({
    _id: incident._id,
    needUserMaps: needUserMaps
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
    needUserMaps.push({needName: need.needName, uids: []});
    // FIXME(rlouie): not accessing old need names here, so another function has to do this manually on submissions
  });

  // clear the user activeIncidents before clearing the availabilities
  let old_needUserMaps = Availability.find({_id: incident._id}).needUserMaps;
  _.forEach(old_needUserMaps, (needUserMap) => {
    if (needUserMap.uids.length > 0) {
      _.forEach(needUserMap.uids, (uid) => {
        Meteor.users.update(
          {
            _id: uid
          }, {
            $pull: {
              "profile.activeIncidents": incident._id
            }
          });
      });
    }
  });

  Availability.update(
    {
      _id: incident._id,
    }, {
      $set: {
        needUserMaps: needUserMaps
      }
    }
  )

  Assignments.update(
    {
      _id: incident._id,
    }, {
      $set: {
        needUserMaps: needUserMaps
      }
    }
  )


};

/**
 * Given an experience object, creates an incident
 * @param experience {object} of the created incident
 */
export const createIncidentFromExperience = (experience) => {
  let incident = {
    eid: experience._id,
    callbacks: experience.callbacks,
    contributionTypes: experience.contributionTypes,
  };

  Incidents.insert(incident, (err) => {
    if (err) {
      console.log('error,', err);
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
    contributionTypes: experience.contributionTypes
  };

  Incidents.update(
    {
      eid: eid
    }, {
      $set: incident
    });

  return Incidents.findOne({eid: eid});
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
      _id: eid
    }, {
      $set: experience
    });

  return Experiences.findOne({_id: eid});
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

  _.forEach(incident.contributionTypes, (need) => {
    if (need.needName === needName) {
      output = need;
      return false;
    }

    // check if found
    if (typeof output === 'undefined') {
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
