import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';


export const matchAffordancesWithDetector = new ValidatedMethod({
  name: 'detectors.matchAffordancesWithDetector',

  validate: new SimpleSchema({
    userId: { type: String },
    detectorId: { type: String }
  }).validator(),

  run({ userId, detectorId }) {
    const userloc = Locations.findOne({ uid: userId });
    const detector = Detectors.findOne({ _id: detectorId });

    if (_.isEmpty(userloc.affordances)) {
      throw new Meteor.Error('detectors.matchAffordancesWithDetector',
        'Cannot match when a user affordances have not been sensed')
    }

    detector_output = applyDetector(userloc.affordances,
                                    detector.variables,
                                    detector.rules);
    console.log('detector_output')
    console.log(detector_output)

    return detector_output;
  }
});
// Test Method in Client Like So:
// Meteor.call('detectors.matchAffordancesWithDetector', {
//   userId: 'GozT7ZtXuu3diPPWc',
//   detectorId: 'cG4RJxsodeYfG7ATT'
// }, (err, res) => {
//   if (err) {
//     alert(err);
//   } else {
//     console.log(res);
//   }
// });

/**
 * Evaluates given the affordances of a user, if they match the definition given
 * by the detector. 
 * @param {Object} userAffordances: key value pairs of (userAffordances: values)
 * @param {[String]} varDecl - variable declarations of the affordance keys used
 * @param {[String]} rules - context rules as Javascript logical operations
 * @return {Boolean} doesUserMatchSituation
 */
applyDetector = function(userAffordances, varDecl, rules) {
  var affordancesAsJavascriptVars = keyvalues2vardecl(userAffordances);
  mergedAffordancesWithRules = varDecl.concat(affordancesAsJavascriptVars)
                                      .concat(rules)
                                      .join('\n');
  doesUserMatchSituation = eval(mergedAffordancesWithRules);
  return doesUserMatchSituation;
}

/**
 * @param {Object} obj - key values that come from /location_keyvalues/{lat}/{lng}
 * @return {[String]} vardecl - each element has the form "var key = value;"
 */
keyvalues2vardecl = function(obj) {
  vardecl = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      vardecl.push("var " + key + " = " + obj[key] + ";")      
    }
  }
  return vardecl;
}