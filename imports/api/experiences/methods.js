import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {_} from 'meteor/underscore';
import {Experiences} from './experiences.js';
import {Schema} from '../schema.js';
import {getUnfinishedNeedNames} from "../submissions/methods";
import {Incidents} from "../incidents/incidents";
import {getNeedFromIncidentId} from "../incidents/methods";


/**
 * Loops through all unmet needs and returns all needs a user matches with.
 *
 * @param uid {string} uid of user to find matches for
 * @param lat {float} latitude of user's new location
 * @param lng {float} longitude of user's new location
 * @returns {{}}
 */
export const findMatchesForUser = function (uid, lat, lng) {
  let matches = {};
  let unfinishedNeeds = getUnfinishedNeedNames();
  console.log("unfinishedneeds", unfinishedNeeds);
  // unfinishedNeeds = {iid : [needName] }
  _.forEach(unfinishedNeeds, (needNames, iid) => {
    _.forEach(needNames, (needName) => {
      let doesMatchPredicate = doesUserMatchNeed(uid, lat, lng, iid, needName);

      if (doesMatchPredicate) {
        if (matches[iid]) {
          matches[iid] = matches[iid] + needName;
        } else {
          matches[iid] = [needName];
        }
      }
    });
  });

  return matches;
};

// TODO: ryan do this plz.
/**
 * Checks if a user matches a need.
 * Match determined using AA/Affinder to check what affordances a user has and determine if it matches the need.
 *
 * @param uid {string} uid of user
 * @param lat {float} latitude of user's new location
 * @param lng {float} longitude of user's new location
 * @param iid {string} iid of incident to determine matching
 * @param needName {string} name of need to determine match for
 * @returns {boolean} whether user matches need queried for
 */
export const doesUserMatchNeed = function(uid, lat, lng, iid, needName) {
  //@ryan, here is the detector for you to match with
  let detector = getNeedFromIncidentId(iid, needName).situation.detector;

  return true;
}



// TODO: Clean this up if possible
export const updateUserExperiences = new ValidatedMethod({
  name: 'experiences.updateUser',
  validate: new SimpleSchema({
    userId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),
  run({userId}) {
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
    Meteor.users.update(userId, {$set: {'profile.experiences': exps}});
    let subs = user.profile.subscriptions;
    subs = subs.filter((sub) => {
      return _.contains(exps, sub);
    });
    Meteor.users.update(userId, {$set: {'profile.subscriptions': subs}});
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
  run({experienceId}) {
    Experiences.remove(experienceId);
  }
});

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
    console.log("validated")
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
    }
    var id = Experiences.insert(experience, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        console.log(docs);
      }
    });
    console.log("Experience created" + id);
    return id;
  }
});
