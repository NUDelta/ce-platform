import { HTTP } from 'meteor/http';

import { Detectors } from './detectors'

import { log, serverLog } from "../../logs";

/**
 * Gets place + weather and time affordances based on location, then calls a callback
 * @param {string} uid user id
 * @param location {object} location object from the background geolocation package
 * @param {function} callback takes three arguments: uid, bgLocationObject, and affordances
 */


export const getAffordancesFromLocation = function (uid, location, retrievePlaces, callback) {
  // setup url with lat and lng from tracking package
  let lat = location.coords.latitude;
  let lng = location.coords.longitude;
  let host = 'http://affordanceaware.herokuapp.com';
  // let host = 'http://0.0.0.0:5000';
  let url = retrievePlaces ? `${ host }/location_keyvalues/${ lat }/${ lng }` :
            `${ host }/location_weather_time_keyvalues/${ lat }/${ lng }`;

  // make request to affordance aware
  HTTP.get(url, {}, (error, response) => {
    let affordances = {};

    // check if valid response from affordance aware
    if (!error && response.statusCode === 200) {
      affordances = JSON.parse(response.content);
      if (affordances !== Object(affordances)) {
        serverLog.call({
          message: "Locations/methods expected type Object but did not receive an Object, doing nothing"
        });
      }
    } else {
      serverLog.call({
        message: "ERROR WITH AFFORDANCE AWARE: " + JSON.stringify(error)
      });
    }

    // callback with either retrieved affordances or empty object
    serverLog.call({  message: `Affordances successfully retrieved for ${ uid } at ${ lat }, ${ lng }.` });
    callback(uid, location, affordances);
  });
};

/**
 * e.g.,
 * input: {'trader_joes_evanston: { grocery: true }}
 * output: ['trader_joes_evanston']
 * @param aff {Object} possibly nested affordance dictionary
 * @return {Array} list of keys in dictionary, which are places
 */
export const getPlaceKeys = function(aff) {
  let placeKeys = [];
  _.forEach(Object.keys(aff), (key) => {
    let maybePlaceNestedAff = aff[key];
    if (typeof maybePlaceNestedAff === 'object' && maybePlaceNestedAff !== null) {
      placeKeys.push(key);
    }
  });
  return placeKeys;
};

/**
 *
 * @param placeKeys {Array}
 * @return {Array} list of (place, [notThisPlace1, notThisPlace2,...]) length 2 tuples
 *
 */
export const onePlaceNotThesePlacesSets = function(placeKeys) {
  let sets = [];
  for (let i = 0; i < placeKeys.length; i++) {
    let before = placeKeys.slice(0, i);
    let current = placeKeys[i];
    let after = placeKeys.slice(i+1, placeKeys.length);
    sets.push([current, before.concat(after)])
  }
  // add a '' place for affordances without place information
  sets.push(['', placeKeys]);
  return sets;

};

/**
 *
 * @param aff {Object} nested affordance dict
 * @param notThesePlaces {Array} list of string keys (of places) which should not be considered in subset
 * @return subsetAff {Object} flat affordance dict that can be used by matchAffordanceWithDetector
 */
export const placeSubsetAffordances = function(aff, notThesePlaces) {
  let subsetAff = {};
  _.forEach(Object.keys(aff), (key) => {
    if (!notThesePlaces.includes(key)) {
      let maybePlaceNestedAff = aff[key];
      if (typeof maybePlaceNestedAff === 'object' && maybePlaceNestedAff !== null) {
        Object.assign(subsetAff, maybePlaceNestedAff);
      }
      else {
        Object.assign(subsetAff, { [key] : aff[key]})
      }
    }
  });
  return subsetAff;
};

/**
 *
 * @param nestedAff {object} nested affordance dict
 * @return flatDict {object} flattened dict, without the place/business name, just categories
 */
export const flattenAffordanceDict = function(nestedAff) {
  let placeKeys = getPlaceKeys(nestedAff);
  let flatDict = {};
  _.forEach(nestedAff, (affVal, affKey) => {
    if (placeKeys.includes(affKey)) {
      // affVal looks like {grocery: true}
      Object.assign(flatDict, affVal);
    }
    else {
      flatDict[affKey] = affVal;
    }
  });
  return flatDict;
};

/**
 * Attempts to match affordances with a detector
 * @param {Object} affordances  key value pairs of { userAffordances: values }
 * @param {String} detectorId detector to attempt matching for
 * @returns {Boolean} whether affordances match detector
 */
export const matchAffordancesWithDetector = function (affordances, detectorId) {
  const detector = Detectors.findOne({ _id: detectorId });

  // check if no detector for detectorId exists, otherwise attempt to match affordances to detector
  if (typeof detector === 'undefined') {
    return false;
  }

  return applyDetector(affordances, detector.variables, detector.rules);
};

/**
 * Evaluates given the affordances of a user, if they match the definition given
 * by the detector.
 * @param {Object} userAffordances: key value pairs of (userAffordances: values)
 * @param {[String]} varDecl - variable declarations of the affordance keys used
 * @param {[String]} rules - context rules as Javascript logical operations
 * @return {Boolean} doesUserMatchSituation
 */
const applyDetector = function (userAffordances, varDecl, rules) {
  let affordancesAsJavascriptVars = keyvalues2vardecl(userAffordances);
  let mergedAffordancesWithRules = varDecl.concat(affordancesAsJavascriptVars)
    .concat(rules)
    .join('\n');

  try {
    return eval(mergedAffordancesWithRules);
  } catch (err) {
    log.debug(`userAffordances: ${JSON.stringify(userAffordances)}`);
    log.debug(`varDecl: ${JSON.stringify(varDecl)}`);
    log.debug(`rules: ${JSON.stringify(rules)}`);
    log.debug(`affordancesAsJavascriptVars: ${JSON.stringify(affordancesAsJavascriptVars)}`);
    log.debug(`mergedAffordancesWithRules: ${JSON.stringify(mergedAffordancesWithRules)}`);
    throw (err);
  }
};

/**
 * Takes a keyvalues object (i.e. JSON) and converts it to a javascript variable declaration.
 * For example,
 * If the keyvalues were
 * {daytime: true, hour: 13, sunset_predicted_weather: "rain"}
 * The function would output
 * ['var daytime = true', 'var hour = 13', 'var sunset_predicted_weather = "rain"']
 * @param {Object} obj - key values that come from /location_keyvalues/{lat}/{lng}
 * @return {[String]} vardecl - each element has the form "var key = value;"
 */
const keyvalues2vardecl = function (obj) {
  let vardecl = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // ensures that a value of type string will remain that type in the javascript variable declaration
      // i.e. sunset_predicted_weather: "rain" will convert to 'var sunset_predicted_weather = "rain"']
      let value = (typeof obj[key] === 'string' || obj[key] instanceof String) ? `"${obj[key]}"` : obj[key];

      vardecl.push(`var ${key} = ${value};`);
    }
  }
  return vardecl;
};