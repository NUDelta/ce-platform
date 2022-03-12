import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import {Experiences} from './experiences.js';
import {Schema} from '../../schema.js';
import {getUnfinishedNeedNames} from '../progressorHelper';
import {
  getPlaceKeys,
  applyDetector,
  onePlaceNotThesePlacesSets,
  placeSubsetAffordances
} from "../../UserMonitor/detectors/methods";
// import { createNewId } from '../../../startup/server/fixtures.js';

import {Incidents} from './experiences';
import {Detectors} from '../../UserMonitor/detectors/detectors';
import {Assignments, Availability, ParticipatingNow} from '../../OpportunisticCoordinator/databaseHelpers';
import {Submissions} from '../../OCEManager/currentNeeds';
import {serverLog} from "../../logs";
import {setIntersection} from "../../custom/arrayHelpers";

const util = require('util');
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
  console.time('findMatchesForUser full')
  console.time('findMatchesForUser setup')
  let matches = {};
  let unfinishedNeeds = getUnfinishedNeedNames();

  // @see detectors.tests.js -- Helpers for Nested {Place: {Affordance: true}} for more details
  let placeKeys = getPlaceKeys(affordances);
  let currentPlace_notThesePlaces = onePlaceNotThesePlacesSets(placeKeys);
  console.timeEnd('findMatchesForUser setup')

  //console.log('unfinishedNeeds', unfinishedNeeds);

  // constructing matches to look like {iid : [ (place, needName, distance), ... ], ... }
  // unfinishedNeeds = {iid : [needName] }
  _.forEach(unfinishedNeeds, (needNames, iid) => {
    console.time('Checking all needNames')
    const incident = Incidents.findOne(iid);
    // old time: approx six to twelve seconds on server
    // new time: ~1 - 7 seconds, 15 seconds?!
    _.forEach(needNames, (needName) => {
      console.time('Checking a needName')
      serverLog.call({message: ` .     For findMatchesForUser, uid = ${uid}, needName = ${needName}`});
      // old time: approx half second on server
      // new time: still about half a second...

      console.time('Looking at the need and detector')
      const need = incident.contributionTypes.find(contributionType => contributionType.needName === needName);
      const detectorUniqueKey = need.situation.detector;
      const detector = Detectors.findOne({ description : detectorUniqueKey });
      console.timeEnd('Looking at the need and detector')

      // Or do we ignore this check because we are doing time/weather based stuff?
      // we check whether a place is sustained for a detector?
      console.time('Checking all the places for a need')
      _.forEach(currentPlace_notThesePlaces, (placeToMatch_ignoreThesePlaces) => {
        let [placeToMatch, ignoreThesePlaces] = placeToMatch_ignoreThesePlaces;
        let [affordanceSubsetToMatchForPlace, distInfo] = placeSubsetAffordances(affordances, ignoreThesePlaces);
        const doesMatchPredicate = applyDetector(affordanceSubsetToMatchForPlace, detector.variables, detector.rules);
        if (doesMatchPredicate) {
          if (matches[iid]) {
            let place_needs = matches[iid];
            place_needs.push([placeToMatch, needName, distInfo['distance']]);
            matches[iid] = place_needs;
          } else {
            matches[iid] = [[placeToMatch, needName, distInfo['distance']]];
          }
        }
      });
      console.timeEnd('Checking all the places for a need')
      console.timeEnd('Checking a needName')
   });
   console.timeEnd('Checking all needNames')
  });

  console.timeEnd('findMatchesForUser full')
  return matches;
};

/**
 *
 * @param beforeAvails
 * @param afterAvails
 * @return sustainedAvailDict {{Object}}
 *    e.g., {"QybuLeDFSbTijxFbi":[["whole_foods_market_evanston_2","Shopping for groceries",5.108054606381277]]}
 */
export const sustainedAvailabilities = function(beforeAvails, afterAvails) {
  let incidentIntersection = setIntersection(Object.keys(beforeAvails), Object.keys(afterAvails));
  let sustainedAvailDict = {};
  _.forEach(incidentIntersection, (incident) => {
    let beforePlacesAndNeeds = beforeAvails[incident].map((place_need_dist) => place_need_dist.slice(0,2));
    let afterPlacesAndNeeds = afterAvails[incident].map((place_need_dist) => place_need_dist.slice(0,2));

    let sustainedPlace_Needs = setIntersection(beforePlacesAndNeeds, afterPlacesAndNeeds);
    // console.log(JSON.stringify(afterAvails[incident]));
    // console.log(JSON.stringify(sustainedPlace_Needs));
    if (sustainedPlace_Needs.length) {
      let sustainedPlace_Need_Distances = sustainedPlace_Needs.map(sustainedPlace_Need =>
        afterAvails[incident].find(place_need_dict =>
          JSON.stringify(place_need_dict.slice(0,2)) == JSON.stringify(sustainedPlace_Need)
        )
      );
      sustainedAvailDict[incident] = sustainedPlace_Need_Distances;
    }
  });
  return sustainedAvailDict;
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

/**
 * Not enough to remove experiences.
 * Incidents need to be removed.
 * Associated Submissions need to be removed.
 * Associated
 */
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
  },
  changeExperienceToPass({eid, needName, toPass, field}) {
    new SimpleSchema({
      eid: {type: String},
      needName: {type: String},
      toPass: {type: String},
      field: {type: String},
    }).validate({eid, needName, toPass, field});

    changeExperienceToPass(eid, needName, toPass, field);
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
    $push: {needUserMaps: {needName: contribution.needName, users: []}}
  });

  Assignments.update({
    _id: iid
  },{
    $push: {needUserMaps: {needName: contribution.needName, users: []}}
  });

  ParticipatingNow.update({
    _id: iid
  },{
    $push: {needUserMaps: {needName: contribution.needName, users: []}}
  });
};

//uhhhh this is too specific to imitation game
export const changeIncidentToPass = (iid, needName, field1, field2) => {
  let incident = Incidents.findOne({
    _id: iid,
  });

  let contributionTypeIndex = 0;

  if (incident){
    for (let i = 0; i < incident.contributionTypes.length; i++){
      if (incident.contributionTypes[i].needName === needName){
          contributionTypeIndex = i;
        }
      }
  };

  let search1 = `contributionTypes.${contributionTypeIndex}.toPass.${field1}`;
  let search2 = `contributionTypes.${contributionTypeIndex}.toPass.${field2}`

  Incidents.update({
    _id: iid
  }, {
   $set: {
     [search1] : false,
     [search2] : true
   }
  });
}


export const changeExperienceToPass = (eid, needName, toPass, field) => {
    //first must find correct contributionType via needName & then update
    //only that contributionType with new toPass
    let experience = Experiences.findOne({
      _id: eid,
    });

    let contributionTypeIndex = 0;

    if (experience){
      for (let i = 0; i < experience.contributionTypes.length; i++){
        if (experience.contributionTypes[i].needName === needName){
            contributionTypeIndex = i;
          }
        }
    };

    let search = `contributionTypes.${contributionTypeIndex}.toPass.${field}`;

    Experiences.update(
      {
        _id: eid
      }, {
       $set: {
          [search] : toPass
       }
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
      Submissions.insert({
        eid: eid,
        iid: iid,
        needName: need.needName,
      }, (err) => {
        if (err) {
          console.log('upload error,', err);
        }
      });
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
    needUserMaps.push({needName: need.needName, users: []});
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

  ParticipatingNow.insert({
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
    needUserMaps.push({needName: need.needName, users: []});
    // FIXME(rlouie): not accessing old need names here, so another function has to do this manually on submissions
  });

  Availability.update(
    {
      _id: incident._id,
    }, {
      $set: {
        needUserMaps: needUserMaps
      }
    }
  );

  Assignments.update(
    {
      _id: incident._id,
    }, {
      $set: {
        needUserMaps: needUserMaps
      }
    }
  );

  ParticipatingNow.update(
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
  // let need = experience.contributionTypes[0].needName;
  // need = createNewId("i", need)
  let incident = {
    // _id: need,
    eid: experience._id,
    callbacks: experience.callbacks,
    contributionTypes: experience.contributionTypes,
    allowRepeatContributions: experience.allowRepeatContributions
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
