import { Meteor } from "meteor/meteor";
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { log } from '../../logs.js';
import { Locations } from './locations.js';

import { findMatchesForUser, getDelayFromIncidentId, clearAvailabilitiesForUser } from
    '../../OCEManager/OCEs/methods'
import { runCoordinatorAfterUserLocationChange } from '../../OpportunisticCoordinator/server/executor'
import { updateAssignmentDbdAfterUserLocationChange } from "../../OpportunisticCoordinator/identifier";
import { getAffordancesFromLocation } from '../detectors/methods';
import { CONFIG } from "../../config";
import { Location_log } from "../../Logging/location_log";
import { serverLog } from "../../logs";

Meteor.methods({
  triggerUpdate(lat, lng, uid){
    onLocationUpdate(uid, lat, lng, function (uid) {
      serverLog.call({message: "triggering manual location update for: " + uid});
    });
  }
});

/**
 * Saves location in DB and sends data to sendToMatcher function.
 * Run on updates from LocationTracking package.
 *
 * @param uid {string} uid of user who's location just changed
 * @param lat {float} latitude of new location
 * @param lng {float} longitude of new location
 * @param callback {function} callback function to run after code completion
 */
export const onLocationUpdate = (uid, lat, lng, callback) => {
  serverLog.call({message: `removing ${ uid } from all availabilities.`});

  // clear users current availabilities
  clearAvailabilitiesForUser(uid);

  // get affordances and begin coordination process
  serverLog.call({message: `attempting to get affordances for ${ uid }`});
  getAffordancesFromLocation(uid, lat, lng, function (uid, affordances) {
    let delay = CONFIG.CONTEXT_DELAY;

    // attempt to find a user with the given uid
    let user = Meteor.users.findOne({_id: uid});

    if (user) {
      // get affordances via affordance aware
      let userAffordances = user.profile.staticAffordances;
      affordances = Object.assign({}, affordances, userAffordances);
      affordances = affordances !== null ? affordances : {};

      serverLog.call({message: `affordances found for ${ uid }: ${ JSON.stringify(affordances) }`});

      // update information in database
      updateLocationInDb(uid, lat, lng, affordances);
      callback(uid);

      // clear assignments and begin matching
      let newAffs = Locations.findOne({uid: user._id}).affordances;
      let sharedKeys = _.intersection(Object.keys(newAffs), Object.keys(affordances));

      let sharedAffs = [];
      _.forEach(sharedKeys, (key) => {
        sharedAffs[key] = newAffs[key];
      });

      updateAssignmentDbdAfterUserLocationChange(uid, sharedAffs);
      sendToMatcher(uid, sharedAffs);
    }
  });
};

/**
 * Finds the matches (findMatchesFunction in User::Experience Matcher) for the user for a user's
 * location update and sends found matches to the OpportunisticCoordinator.
 *
 * @param uid {string} uid of user who's location just changed
 * @param lat {float} latitude of new location
 * @param lng {float} longitude of new location
 */
const sendToMatcher = (uid, affordances) => {
  // should check whether a user is available before sending to OpportunisticCoordinator
  // TODO: replace false with config.debug global setting
  let userCanParticipate = userIsAvailableToParticipate(uid);

  if (userCanParticipate) {
    // get availabilities
    let availabilityDictionary = findMatchesForUser(uid, affordances);

    // get delays for each incident based on the experience delay
    let incidentDelays = {};
    _.forEach(availabilityDictionary, (need, iid) => {
      incidentDelays[iid] = getDelayFromIncidentId(iid);
    });

    // start coordination process
    serverLog.call({message: `starting coordination process`});
    runCoordinatorAfterUserLocationChange(uid, availabilityDictionary, incidentDelays);
  } else {
    serverLog.call({ message: `user ${ uid } cannot participate yet.`})
  }
};

/**
 * Returns whether a user can participate based on when they were last notified/last participated.
 * Debug mode shortens the time between experiences for easier debugging.
 *
 * @param uid {string} uid of user who's location just changed
 * @returns {boolean} whether a user can participate in an experience
 */
const userIsAvailableToParticipate = (uid) => {
  let time = 60 * 1000;

  if (CONFIG.MODE === "DEV") {
    time = time * 2;
  } else if (CONFIG.MODE === "PROD") {
    time = time * 65;
  } else {
    time = time * 65;
  }

  return (Date.now() - Meteor.users.findOne(uid).profile.lastNotified)  > time};

/**
 * Updates the location for a user in the database.
 *
 * @param uid {string} uid of user who's location just changed
 * @param lat {float} latitude of new location
 * @param lng {float} longitude of new location
 * @param affordances {object} affordances key/value dictionary
 */
const updateLocationInDb = (uid, lat, lng, affordances) => {
  // get user's current location and update, if exists. otherwise, create a new entry.
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

  // store location update in logs
  Location_log.insert({
    uid: uid,
    lat: lat,
    lng: lng,
    timestamp: Date.now(),
    affordances: affordances,
  });
};
