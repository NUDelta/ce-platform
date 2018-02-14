import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {log} from '../logs.js';
import {Locations} from './locations.js';

import {findMatchesForUser} from '../experiences/methods'
import {runCoordinatorAfterUserLocationChange} from '../coordinator/methods'
import {updateAssignmentDbdAfterUserLocationChange} from "../coordinator/methods";

/**
 * Saves location in DB and sends data to sendToMatcher function.
 * Run on updates from LocationTracking package.
 *
 * @param uid {string} uid of user who's location just changed
 * @param lat {float} latitude of new location
 * @param lng {float} longitude of new location
 */
export const onLocationUpdate = function(uid, lat, lng) {
  console.log("recieved location update", lat, lng)
  updateLocationInDb(uid, lat, lng);
  updateAssignmentDbdAfterUserLocationChange(uid, lat, lng);
  sendToMatcher(uid, lat, lng);
}

/**
 * Finds the matches (findMatchesFunction in User::Experience Matcher) for the user for a user's location update and
 * sends found matches to the coordinator.
 *
 * @param uid {string} uid of user who's location just changed
 * @param lat {float} latitude of new location
 * @param lng {float} longitude of new location
 */
function sendToMatcher(uid, lat, lng) {
  // should check whether a user is available before sending to coordinator
  let userCanParticipate = userIsAvailableToParticipate(uid, false); // TODO: replace false with config.debug global setting

  if (userCanParticipate) {
    let availabilityDictionary = findMatchesForUser(uid, lat, lng);
    console.log("found matches", availabilityDictionary)
    runCoordinatorAfterUserLocationChange(uid, availabilityDictionary);
  }
}

// TODO: implement this
/**
 * Returns whether a user can participate based on when they were last notified/last participated.
 * Debug mode shortens the time between experiences for easier debugging.
 *
 * @param uid {string} uid of user who's location just changed
 * @param debug {boolean} choose to run in debug mode or not
 * @returns {boolean} whether a user can participate in an experience
 */
function userIsAvailableToParticipate(uid, debug) {
  if (typeof debug === 'undefined') {

  } else {

  }

  return true;
}

/**
 * Updates the location for a user in the database.
 *
 * @param uid {string} uid of user who's location just changed
 * @param lat {float} latitude of new location
 * @param lng {float} longitude of new location
 */
function updateLocationInDb(uid, lat, lng) {
  const entry = Locations.findOne({uid: uid});
  if (entry) {
    Locations.update(entry._id, {
      $set: {
        lat: lat,
        lng: lng,
        timestamp: Date.parse(new Date()),
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
      timestamp: Date.parse(new Date()),
    }, (err) => {
      if (err) {
        log.error("Locations/methods, can't add a new location", err);
      }
    });
  }
}
