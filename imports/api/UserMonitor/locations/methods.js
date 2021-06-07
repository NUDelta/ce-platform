import { Meteor } from "meteor/meteor";
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { log } from '../../logs.js';
import { Locations } from './locations.js';

import { findMatchesForUser, getNeedDelay} from
    '../../OCEManager/OCEs/methods'
import { runCoordinatorAfterUserLocationChange } from '../../OpportunisticCoordinator/server/executor'
import {
  clearAvailabilitiesForUser,
  decomissionFromAssignmentsIfAppropriate
} from "../../OpportunisticCoordinator/server/identifier";
import { getAffordancesFromLocation } from '../detectors/methods';
import { CONFIG } from "../../config";
import { Location_log } from "../../Logging/location_log";
import { serverLog } from "../../logs";
import {EstimatedLocation_log} from "../../Logging/estimated_location_log";

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
 * @param location {object} location object from the background geolocation package
 * @param callback {function} callback function to run after code completion, takes in one argument, uid
 */
export const onLocationUpdate = (uid, location, callback) => {
  serverLog.call({message: `Location update for ${ uid }: removing them from all availabilities and getting new affordances.`});

  // clear users current availabilities
  clearAvailabilitiesForUser(uid);

  // obtain activity info
  let not_traveling_on_bicycle_or_vehicle;
  if ('activity' in location) {
    not_traveling_on_bicycle_or_vehicle = !((location.activity.type === "in_vehicle") || (location.activity.type === "on_bicycle"));
  } else {
    serverLog.call({message: `no activity data for ${uid}. defaulting to a value that allows location update`});
    not_traveling_on_bicycle_or_vehicle = true;
  }

  // attempt to find a user with the given uid
  let user = Meteor.users.findOne({_id: uid});
  serverLog.call({message: `user ${user}`});

  if (user) {

    let rawLocationId = insertRawLocationInDB(uid, location);

    // smooth location if not traveling on bicycle or vehicle
    if (not_traveling_on_bicycle_or_vehicle) {
      let [estimatedLat, estimatedLng] = estimateLocationViaAccuracyTimeWeightedAverage(lastNLocationsForUser(5, uid));

      // modify bgGeolocation object with estimated location, if appropriate
      location.coords['latitude'] = estimatedLat;
      location.coords['longitude'] = estimatedLng;
    }

    // retrieve place affordances if not traveling on bicycle or vehicle
    let retrievePlaces = not_traveling_on_bicycle_or_vehicle;

    // get affordances and begin coordination process
    getAffordancesFromLocation(uid, location, retrievePlaces, function (uid, bgLocationObject, affordances) {

      log.info(`success: getAffordancesFromLocation`);
      // get affordances via affordance aware
      let user = Meteor.users.findOne({_id: uid});
      if (!user) {
        log.error(`uid = ${uid} passed to getAffordancesFromLocation did not correspond to a user `);
        return;
      }
      let userAffordances = user.profile.staticAffordances;
      affordances = Object.assign({}, affordances, userAffordances);
      affordances = affordances !== null ? affordances : {};
      serverLog.call({message: `affordances ${affordances}`});

      // blocking, since everything in system works off of Locations collection
      updateLocationInDb(uid, bgLocationObject, affordances);

      // non-blocking, since its for post-hoc analysis
      insertEstimatedLocationLog(uid, bgLocationObject, affordances, rawLocationId);
      callback(uid);

      // clear assignments and begin matching
      let newLoc = Locations.findOne({uid: uid});
      if (!newLoc) {
        log.error(`uid = ${uid} did not have a current location in Locations collection`);
        return;
      }
      let newAffs = newLoc.affordances; // newest affordances
      // TODO(rlouie): Ask Kapil -- why do this intersection???
      let sharedKeys = _.intersection(Object.keys(newAffs), Object.keys(affordances));
      let sharedAffs = [];
      _.forEach(sharedKeys, (key) => {
        sharedAffs[key] = newAffs[key];
      });

      decomissionFromAssignmentsIfAppropriate(uid, sharedAffs);
      sendToMatcher(uid, sharedAffs);
    });
  }
};

/**
 * Finds the matches (findMatchesFunction in User::Experience Matcher) for the user for a user's
 * location update and sends found matches to the OpportunisticCoordinator.
 *
 * @param uid {string} uid of user who's location just changed
 * @param affordances {object} dictionary of user's affordances
 */
const sendToMatcher = (uid, affordances) => {
  // should check whether a user is available before sending to OpportunisticCoordinator
  // TODO: replace false with config.debug global setting
  let userCanParticipate = userIsAvailableToParticipate(uid);

  if (userCanParticipate) {
    // get availabilities containing iid/need/place/distance information
    let availabilityDictionary = findMatchesForUser(uid, affordances);

    // update availabilityDictionary of most recent location
    Locations.update({uid: uid}, {$set: {availabilityDictionary: availabilityDictionary}});

    // get delays for each incident-need pair
    let needDelays = {};
    _.forEach(availabilityDictionary, (place_need_distance_s, iid) => {
      // create empty need object for each iid
      needDelays[iid] = {};

      // find and add delays for each need
      _.forEach(place_need_distance_s, (individualPlace_individualNeed_individualDist) => {
        let individualNeed = individualPlace_individualNeed_individualDist[1];
        needDelays[iid][individualNeed] = getNeedDelay(iid, individualNeed);
      });
    });

    // start coordination process
    runCoordinatorAfterUserLocationChange(uid, availabilityDictionary, needDelays);
  } else {
    serverLog.call({ message: `user ${ uid } cannot participate yet.`})
  }
};

/**
 * Returns whether a user can participate based on when they were last notified/last participated.
 * Debug mode shortens the time between experiences for easier debugging.
 * (1) If you participated in a need, we could let them continue and participate in more needs! One argument
 *     allowing multiple participation in quick succession is that people are more likely to run into multiple
 *     opportunities, if they already out. The opportunity to participate (given our system model is dependent on
 *     being near places registered on Yelp) is very much tied to being out and about.
 *     The counter argument is that, we should not let a single user participate in all the needs,
 *     as to allow others to have the opportunity to participate in other needs.
 * (2) If you were notified to participate, but you didn't get a chance, well don't limit this person!
 * .... They are out an about and are more likely to run into more experiences.
 * TODO(rlouie): Move this function to a file that is about identifying availability, instead of about location methods
 * TODO(rlouie): decide if system should limit participation
 *
 * @param uid {string} uid of user who's location just changed
 * @returns {boolean} whether a user can participate in an experience
 */
export const userIsAvailableToParticipate = (uid) => {
  const user = Meteor.users.findOne(uid);
  return !userParticipatedTooRecently(user);
};

/**
 * Determines if user participated too recently within a time window specified internally to this function
 * @param user {Object} has Meteor.users Schema
 * @return {boolean} whether the user participated too recently or not
 */
export const userParticipatedTooRecently = (user) => {
  let minutes = 60 * 1000;
  let waitTimeAfterParticipating;
  // adjust time for local vs prod deployment (lower in local for testing)
  if (CONFIG.MODE === "local") {
    waitTimeAfterParticipating = minutes * 1;
  } else {
    //change this to some larger value after testing if i want them to be available to home screen
    waitTimeAfterParticipating = minutes * 1;
  }
  const lastParticipated = user.profile.lastParticipated;
  const now = Date.now();
  return (now - lastParticipated) < waitTimeAfterParticipating;
};

/**
 * User notified to recently within a time window specified internally to this function
 *
 * @param user {Object} has Meteor.users Schema
 * @return {boolean} whether the user was notified too recently or not
 */
export const userNotifiedTooRecently = (user) => {
  let minutes = 60 * 1000;
  let waitTimeAfterNotified;
  // adjust time for local vs prod deployment (lower in local for testing)
  if (CONFIG.MODE === "local") {
    waitTimeAfterNotified = minutes * 1;
  } else {
    waitTimeAfterNotified = minutes * 60;
  }
  const lastNotified = user.profile.lastNotified;
  const now = Date.now();
  return (now - lastNotified) < waitTimeAfterNotified;
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


const lastNLocationsForUser = function(N, uid) {
  let locs = Location_log.find({
    uid: uid
  }, {
    sort: {timestamp: -1},
    limit: N
  }).map((doc) => {return doc; });
  return locs;
};


const estimateLocationViaAccuracyTimeWeightedAverage = function(lastNLocations) {
  let weightedSumLat = 0;
  let weightedSumLng = 0;
  let totalWeight = 0;

  let accuracyArr = lastNLocations.map((loc) => { return (loc.accuracy < 10) ? 10 : loc.accuracy; });
  let timeArr = lastNLocations.map((loc) => { return loc.timestamp; });
  let latArr = lastNLocations.map((loc) => { return loc.lat; });
  let lngArr = lastNLocations.map((loc) => { return loc.lng; });

  for (let i = 0; i < accuracyArr.length; i++) {
    let dt = Math.abs(timeArr[0] - timeArr[i]) / 1000; // time difference in seconds
    let w_i;
    if (dt == 0) {
      // when dt = 0 seconds, time-weighting component = 1
      w_i = (10 / accuracyArr[i]);
    }
    else {
      // when dt > 0, time-weighting component =
      // 1 / ( log(dt + 1) ) =
      // 1 / ( log(0.1 + 1) ) =
      // 1 / ( log(1.1) ) =
      // 1 / ( some-positive-number )
      w_i = (10 / accuracyArr[i]) * (1 / (Math.log(dt + 2.719)));
      // w_i = (10 / accuracyArr[i]) * (10 / (dt + 10));
    }
    totalWeight += w_i;
    weightedSumLat += w_i * latArr[i];
    weightedSumLng += w_i * lngArr[i];
  }

  let averageLat = weightedSumLat / totalWeight;
  let averageLng = weightedSumLng / totalWeight;
  return [averageLat, averageLng]
};

/**
 * Inserts newest raw location into Locations_log,
 * @param uid
 * @param location
 */
export const insertRawLocationInDB = (uid, location) => {
  // check if nested objects exist
  if (!('activity' in location)) {
    location.activity = {}
  }

  if (!('battery' in location)) {
    location.battery = {}
  }

  let lat = location.coords.latitude;
  let lng = location.coords.longitude;

  // store location update in logs
  let _id = Location_log.insert({
    uid: uid,
    lat: lat,
    lng: lng,
    speed: location.coords.speed || -1,
    floor: location.coords.floor || -1,
    accuracy: location.coords.accuracy || -1,
    altitude_accuracy: location.coords.altitude_accuracy || -1,
    altitude: location.coords.altitude || -1,
    heading: location.coords.heading || -1,
    is_moving: location.is_moving || false,
    activity_type: location.activity.type || "",
    activity_confidence: location.activity.confidence || -1,
    battery_level: location.battery.level || -1,
    battery_is_charging: location.battery.is_charging || false,
    timestamp: location.simulation_timestamp || Date.now(),
  });

  return _id;
};


/**
 * Updates the estimated location for a user in the database.
 *
 * @param uid {string} uid of user who's location just changed
 * @param location {object} location object from the background geolocation package
 * @param affordances {object} affordances key/value dictionary
 */
const updateLocationInDb = (uid, location, affordances) => {
  let lat = location.coords.latitude;
  let lng = location.coords.longitude;

  // get user's current estimated location and update, if exists. otherwise, create a new entry.
  const entry = Locations.findOne({uid: uid});
  if (entry) {
    Locations.update(entry._id, {
      $set: {
        lat: lat,
        lng: lng,
        timestamp: Date.now(),
        affordances: affordances
      }
    }); // blocking
    // Locations.update(entry._id, {
    //   $set: {
    //     lat: lat,
    //     lng: lng,
    //     timestamp: Date.now(),
    //     affordances: affordances
    //   }
    // }, (err) => {
    //   if (err) {
    //     log.error("Locations/methods, can't update a location", err);
    //   }
    // });
  } else {
    Locations.insert({
      uid: uid,
      lat: lat,
      lng: lng,
      timestamp: Date.now(),
      affordances: affordances
    }); // blocking
    // Locations.insert({
    //   uid: uid,
    //   lat: lat,
    //   lng: lng,
    //   timestamp: Date.now(),
    //   affordances: affordances
    // }, (err) => {
    //   if (err) {
    //     log.error("Locations/methods, can't add a new location", err);
    //   }
    // });
  }
};


const insertEstimatedLocationLog = (uid, location, affordances, rawLocationId) => {
  let lat = location.coords.latitude;
  let lng = location.coords.longitude;
  let _id = EstimatedLocation_log.insert({
    uid: uid,
    raw_location_id: rawLocationId,
    lat: lat,
    lng: lng,
    timestamp: Date.now(),
    affordances: affordances
  }, (err) => {
    if (err) {
      log.error("EstimatedLocation_log, can't add a new estimated location", err);
    }
  });
  return _id;
};
