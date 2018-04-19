import { ValidatedMethod } from "meteor/mdg:validated-method";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { log } from "../logs.js";
import { Locations } from "./locations.js";

import { findMatchesForUser } from "../experiences/methods";
import { runCoordinatorAfterUserLocationChange } from "../coordinator/server/methods";
import { updateAssignmentDbdAfterUserLocationChange } from "../coordinator/methods";
import { getAffordancesFromLocation } from "../detectors/methods";
import { CONFIG } from "../config";
import { Availability } from "../coordinator/availability";
import { Meteor } from "meteor/meteor";
import { Location_log } from "./location_log";
import { serverLog } from "../logs";

Meteor.methods({
  triggerUpdate(lat, lng, uid) {
    onLocationUpdate(uid, lat, lng, function() {
      serverLog.call({
        message: "triggering manual location update for: " + uid
      });
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
 */
export const onLocationUpdate = (uid, lat, lng, callback) => {
  //TODO: this could def be a clearner call or its own function
  let availabilityObjects = Availability.find().fetch();
  _.forEach(availabilityObjects, av => {
    _.forEach(av.needUserMaps, needEntry => {
      Availability.update(
        {
          _id: av._id,
          "needUserMaps.needName": needEntry.needName
        },
        {
          $pull: { "needUserMaps.$.uids": uid }
        }
      );
    });
  });

  getAffordancesFromLocation(lat, lng, function(affordances) {
    let user = Meteor.users.findOne(uid);
    if (user) {
      let userAffordances = user.profile.staticAffordances;
      affordances = Object.assign({}, affordances, userAffordances);
      updateLocationInDb(uid, lat, lng, affordances);
      callback();

      Meteor.setTimeout(function() {
        let newAffs = Locations.findOne({ uid: user._id }).affordances;
        let sharedKeys = _.intersection(
          Object.keys(newAffs),
          Object.keys(affordances)
        );

        let sharedAffs = [];
        _.forEach(sharedKeys, key => {
          sharedAffs[key] = newAffs[key];
        });

        updateAssignmentDbdAfterUserLocationChange(uid, sharedAffs);
        sendToMatcher(uid, sharedAffs);
      }, 5 * 0);
    }
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
const userIsAvailableToParticipate = uid => {
  let time = 60 * 1000;

  if (CONFIG.MODE === "DEV") {
    time = time * 2;
  } else if (CONFIG.MODE === "PROD") {
    time = time * 65;
  } else {
    time = time * 65;
  }
  // console.log("last notif:", uid, Meteor.users.findOne(uid).profile.lastNotified);
  // console.log("now: ", Date.now(), "time: ", time);
  // console.log("dif:",  (Date.now() - Meteor.users.findOne(uid).profile.lastNotified) );
  //
  // console.log("IS USER AVAIABLE TO PARTICPATE",  (Date.now() - Meteor.users.findOne(uid).profile.lastNotified)  > time)

  return Date.now() - Meteor.users.findOne(uid).profile.lastNotified > time;
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
    Locations.update(
      entry._id,
      {
        $set: {
          lat: lat,
          lng: lng,
          timestamp: Date.now(),
          affordances: affordances
        }
      },
      err => {
        if (err) {
          log.error("Locations/methods, can't update a location", err);
        }
      }
    );
  } else {
    Locations.insert(
      {
        uid: uid,
        lat: lat,
        lng: lng,
        timestamp: Date.now(),
        affordances: affordances
      },
      err => {
        if (err) {
          log.error("Locations/methods, can't add a new location", err);
        }
      }
    );
  }
  Location_log.insert({
    uid: uid,
    lat: lat,
    lng: lng,
    timestamp: Date.now(),
    affordances: affordances
  });
};
