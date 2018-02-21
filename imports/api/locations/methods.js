import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { log } from '../logs.js';
import { Locations } from './locations.js';

import { findMatchesForUser } from '../experiences/methods'
import { runCoordinatorAfterUserLocationChange } from '../coordinator/server/methods'
import { updateAssignmentDbdAfterUserLocationChange } from "../coordinator/methods";
import { getAffordancesFromLocation } from '../detectors/methods';
import {CONFIG} from "../config";
import {Availability} from "../coordinator/availability";

/**
 * Saves location in DB and sends data to sendToMatcher function.
 * Run on updates from LocationTracking package.
 *
 * @param uid {string} uid of user who's location just changed
 * @param lat {float} latitude of new location
 * @param lng {float} longitude of new location
 */
export const onLocationUpdate = (uid, lat, lng, callback) => {
  console.log("received location update", lat, lng, uid);

  console.log("I think after they move we should wipe their availability");
  //TODO: this could def be a clearner call or its own function
  let availabilityObjects = Availability.find().fetch();
  _.forEach(availabilityObjects, (av) => {
    _.forEach(av.needUserMaps, (needEntry) => {
      console.log("removing user ", uid, "from need ", needEntry.needName);
      Availability.update({
        _id: av._id,
        'needUserMaps.needName': needEntry.needName,
      }, {
        $pull: {'needUserMaps.$.uids': uid}
      });
    });

    console.log(Availability.findOne(av._id));
    console.log(Availability.findOne(av._id).needUserMaps[0].uids);
  });


  getAffordancesFromLocation(lat, lng, function (affordances) {
    updateLocationInDb(uid, lat, lng, affordances);
    updateAssignmentDbdAfterUserLocationChange(uid, affordances);
    sendToMatcher(uid, affordances);

    callback();
  });

};

/**
 * Finds the matches (findMatchesFunction in User::Experience Matcher) for the user for a user's location update and
 * sends found matches to the coordinator.
 *
 * @param uid {string} uid of user who's location just changed
 * @param lat {float} latitude of new location
 * @param lng {float} longitude of new location
 */
const sendToMatcher = (uid, affordances) => {
  // should check whether a user is available before sending to coordinator
  // TODO: replace false with config.debug global setting
  let userCanParticipate = userIsAvailableToParticipate(uid);

  if (userCanParticipate) {
    let availabilityDictionary = findMatchesForUser(uid, affordances);

    runCoordinatorAfterUserLocationChange(uid, availabilityDictionary);
  }
};

// TODO: implement this
/**
 * Returns whether a user can participate based on when they were last notified/last participated.
 * Debug mode shortens the time between experiences for easier debugging.
 *
 * @param uid {string} uid of user who's location just changed
 * @param debug {boolean} choose to run in debug mode or not
 * @returns {boolean} whether a user can participate in an experience
 */
const userIsAvailableToParticipate = (uid) => {
  let time = 60 * 1000;

  if (CONFIG.DEBUG) {
    time = time * 1;
  } else {
    time = time * 60;
  }
  console.log("last notif:", Meteor.users.findOne(uid).profile.lastNotified);
  console.log("now: ", Date.now(), "time: ", time);
  console.log("dif:",  (Date.now() - Meteor.users.findOne(uid).profile.lastNotified) );

  console.log("IS USER AVAIABLE TO PARTICPATE",  (Date.now() - Meteor.users.findOne(uid).profile.lastNotified)  > time)

  return (Date.now() - Meteor.users.findOne(uid).profile.lastNotified)  > time ;
};

/**
 * Updates the location for a user in the database.
 *
 * @param uid {string} uid of user who's location just changed
 * @param lat {float} latitude of new location
 * @param lng {float} longitude of new location
 * @param affordances {object} affordances key/value dictionary
 */
const updateLocationInDb = (uid, lat, lng, affordances) => {
  const entry = Locations.findOne({ uid: uid });
  if (entry) {
    Locations.update(entry._id, {
      $set: {
        lat: lat,
        lng: lng,
        timestamp: Date.now(),
        affordances: affordances
      }
    }, (err) => {
      if (err) {
        log.error("Locations/methods, can't update a location", err);
      }
    });
  } else {
    Locations.insert({
      uid: uid,
      lat: lat,
      lng: lng,
      timestamp: Date.now(),
      affordances: affordances
    }, (err) => {
      if (err) {
        log.error("Locations/methods, can't add a new location", err);
      }
    });
  }
};
