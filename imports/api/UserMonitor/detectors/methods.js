import { Meteor } from 'meteor/meteor';
import { Detectors } from './detectors'
import {serverLog} from "../../logs";
import request from 'request';


/**
 * Gets affordances based on location, then calls a callback
 * @param {string} uid user id
 * @param {float} lat current latitude of location
 * @param {float} lng current longitude of location
 * @param {function} callback takes two arguments: uid and affordances
 */
export const getAffordancesFromLocation = function (uid, lat, lng, callback) {
  let url = `http://affordanceaware.herokuapp.com/location_keyvalues/${ lat }/${ lng }`;
  request(url, Meteor.bindEnvironment(function (error, response, body) {
    let affordances = {};
    if (!error && response.statusCode === 200) {
      affordances = JSON.parse(body);
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
    serverLog.call({  message: `Affordances successfully retrieved for ${ lat }, ${ lng }.` });
    callback(uid, affordances);
  }));
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

  return eval(mergedAffordancesWithRules);
};

/**
 * @param {Object} obj - key values that come from /location_keyvalues/{lat}/{lng}
 * @return {[String]} vardecl - each element has the form "var key = value;"
 */
const keyvalues2vardecl = function (obj) {
  let vardecl = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      vardecl.push("var " + key + " = " + obj[key] + ";")
    }
  }
  return vardecl;
};