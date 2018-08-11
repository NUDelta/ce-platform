import { Meteor } from "meteor/meteor";
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { log } from '../../logs.js';
import { Locations } from './locations.js';

import { findMatchesForUser, getNeedDelay, clearAvailabilitiesForUser } from
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
  serverLog.call({message: `Location update for ${ uid }: removing them from all availabilities and getting new affordances.`});

  // clear users current availabilities
  clearAvailabilitiesForUser(uid);

  // get affordances and begin coordination process
  getAffordancesFromLocation(uid, lat, lng, function (uid, affordances) {
    // attempt to find a user with the given uid
    let user = Meteor.users.findOne({_id: uid});

    if (user) {
      // get affordances via affordance aware
      let userAffordances = user.profile.staticAffordances;
      affordances = Object.assign({}, affordances, userAffordances);
      affordances = affordances !== null ? affordances : {};

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
      sendToMatcher(uid, sharedAffs, {'latitude': lat, 'longitude': lng});
    }
  });
};

/**
 * Finds the matches (findMatchesFunction in User::Experience Matcher) for the user for a user's
 * location update and sends found matches to the OpportunisticCoordinator.
 *
 * @param uid {string} uid of user who's location just changed
 * @param affordances {object} dictionary of user's affordances
 * @param currLocation {object} current location of user as object with latitude/longitude keys and float values.
 */
const sendToMatcher = (uid, affordances, currLocation) => {
  // should check whether a user is available before sending to OpportunisticCoordinator
  // TODO: replace false with config.debug global setting
  let userCanParticipate = userIsAvailableToParticipate(uid);

  if (userCanParticipate) {
    // get availabilities
    let availabilityDictionary = findMatchesForUser(uid, affordances);

    // get delays for each incident-need pair
    let incidentDelays = {};
    _.forEach(availabilityDictionary, (needs, iid) => {
      // create empty need object for each iid
      incidentDelays[iid] = {};

      // find and add delays for each need
      _.forEach(needs, (individualNeed) => {
        incidentDelays[iid][individualNeed] = getNeedDelay(iid, individualNeed);
      });
    });

    // start coordination process
    runCoordinatorAfterUserLocationChange(uid, availabilityDictionary, incidentDelays, currLocation);
  } else {
    serverLog.call({ message: `user ${ uid } cannot participate yet.`})
  }
};

/**
 * Returns whether a user can participate based on when they were last notified/last participated.
 * Debug mode shortens the time between experiences for easier debugging.
 * (1) If you participated in a need, we could let them continue and participate in more needs!
 * ... Otherwise if they take all the neds, let others have the opportunity to participate in other needs.
 * (2) If you were notified to participate, but you didn't get a chance, well don't limit this person!
 * .... They are out an about and are more likely to run into more experiences.
 * (3) If you are assigned to an experience currently, you've already been matched! Don't send additional experiences.
 * ... This could be confusing... which one do you choose to participate in right now? The moment doesn't hold
 * its rareness of mapping to one memory.
 * TODO(rlouie): Move this function to a file that is about identifying availability, instead of about location methods
 *
 * @param uid {string} uid of user who's location just changed
 * @returns {boolean} whether a user can participate in an experience
 */
export const userIsAvailableToParticipate = (uid) => {

  let time = 60 * 1000;

  // adjust time for dev vs prod deployment (lower in dev for testing)
  if (CONFIG.MODE === "DEV") {
    time = time * 2;
  } else if (CONFIG.MODE === "PROD") {
    time = time * 65;
  } else {
    time = time * 65;
  }

  return (Date.now() - Meteor.users.findOne(uid).profile.lastNotified)  > time;
};

/**
 * Computes distance between a start and end location in meters using the haversine forumla.
 *
 *  @param start {object} object with starting latitude/longitude keys and float values.
 *  @param end {object} object with ending latitude/longitude keys and float values.
 *  @returns {number} absolute distance between start and end in meters.
 */
export const distanceBetweenLocations = (start, end) => {
  const r = 6378137.0; // Earth’s mean radius in meters
  const degToRad = Math.PI / 180; // Degree to radian conversion.

  // compute differences and latitudes in degrees
  const dLat = (end.latitude - start.latitude) * degToRad;
  const dLng = (end.longitude - start.longitude) * degToRad;
  const lat1 = start.latitude * degToRad;
  const lat2 = end.latitude * degToRad;

  // compute c
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // return distance in meters
  return r * c;
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
