import { Meteor } from 'meteor/meteor';
import {Detectors} from './detectors'


/**
 * Gets affordances based on location, checks if affordances of location
 * match the detector rules, and then calls a callback
 * @param {Number} lat
 * @param {Number} lng
 * @param {String} detectorId
 * @param {function} callback - with argument doesLocationMatchSituation
 */
export const getAffordancesMatchWithDetector = function(lat, lng, detectorId, callback) {
  getAffordancesFromLocation(lat, lng, function(affordances) {
    doesLocationMatchSituation = matchAffordancesWithDetector(affordances, detectorId);
    callback(doesLocationMatchSituation);
  })
};

/**
 * Gets affordances based on location, then calls a callback
 * @param {Number} lat
 * @param {Number} lng
 * @param {function} callback which with single argument affordances
 */
export const getAffordancesFromLocation = function(lat, lng, callback) {
  let request = require('request');
  let url = 'http://affordanceaware.herokuapp.com/location_keyvalues/' + lat.toString() + '/' + lng.toString();
  request(url, Meteor.bindEnvironment(function (error, response, body) {
    if (!error && response.statusCode === 200) {
      let affordances = JSON.parse(body);
      if (affordances !== Object(affordances)) {
        log.warning("Locations/methods expected type Object but did not receive an Object, doing nothing");
      }
      callback(affordances);
    }
  }));
};

export const matchAffordancesWithDetector = function(affordances, detectorId) {
  const detector = Detectors.findOne({ _id: detectorId });

  doesUserMatchSituation = applyDetector(affordances,
                                  detector.variables,
                                  detector.rules);
  return doesUserMatchSituation;
};

/**
 * Evaluates given the affordances of a user, if they match the definition given
 * by the detector. 
 * @param {Object} userAffordances: key value pairs of (userAffordances: values)
 * @param {[String]} varDecl - variable declarations of the affordance keys used
 * @param {[String]} rules - context rules as Javascript logical operations
 * @return {Boolean} doesUserMatchSituation
 */
applyDetector = function(userAffordances, varDecl, rules) {
  let affordancesAsJavascriptVars = keyvalues2vardecl(userAffordances);
  mergedAffordancesWithRules = varDecl.concat(affordancesAsJavascriptVars)
                                      .concat(rules)
                                      .join('\n');
  doesUserMatchSituation = eval(mergedAffordancesWithRules);
  return doesUserMatchSituation;
};

/**
 * @param {Object} obj - key values that come from /location_keyvalues/{lat}/{lng}
 * @return {[String]} vardecl - each element has the form "var key = value;"
 */
keyvalues2vardecl = function(obj) {
  vardecl = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      vardecl.push("var " + key + " = " + obj[key] + ";")      
    }
  }
  return vardecl;
};