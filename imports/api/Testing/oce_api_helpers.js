import {DETECTORS} from "./DETECTORS";

/**
 *
 * @param {*} detector [Object] detector object
 */
export const getDetectorUniqueKey = (detector) => {
  return detector.description;
};

/**
 *
 * @param staticAffordances [String] the affordance to add
 *        i.e. 'mechanismRich'
 * @param contributionTypes [Array] list of all the needs by which to modify
 * @return
 */
export const addStaticAffordanceToNeeds = function(staticAffordance, contributionTypes) {
  return _.map(contributionTypes, (need) => {
      const detectorKey = _.keys(DETECTORS).find(key => getDetectorUniqueKey(DETECTORS[key]) === need.situation.detector);
      if (!detectorKey) {
        throw `Exception in addStaticAffordanceToNeeds: could not find corresponding detector for ${JSON.stringify(need)}`
      }
      const newDetectorKey = addStaticAffordanceToDetector(staticAffordance, detectorKey);
      need.situation.detector = getDetectorUniqueKey(DETECTORS[newDetectorKey]);
      return need;
    });
};

/**
 * Side effect: Changes the global DETECTORS object, adding another detector with key "detectorKey staticAffordance"
 *
 * @param staticAffordance
 * @param detectorKey
 * @returns newDetectorKey
 */
export const addStaticAffordanceToDetector = function(staticAffordance, detectorKey) {
  let newVars = JSON.parse(JSON.stringify(DETECTORS[detectorKey]['variables']));
  newVars.push(`var ${staticAffordance};`);
  let newRules = JSON.parse(JSON.stringify(DETECTORS[detectorKey]['rules']));
  // modify last detector rule
  // when rules has a flat structure where rules.length == 1, last rule is the predicate
  // i.e. ['(diners || restaurants || cafeteria || food_court);']
  // when rules have a nested structure where rules.length > 1, last rule is the predicate
  // i.e. ['worship_places = (buddhist_temples || churches);', '(worship_places || landmarks);']
  let lastRule = newRules.pop();
  // each rule has a `;` at end, i.e. (rain && park);
  // in order to modify the rule, must add predicate preceding the rule
  let lastRuleNoSemicolon = lastRule.split(';')[0];
  lastRule = `(${staticAffordance} && (${lastRuleNoSemicolon}));`;
  newRules.push(lastRule);

  let newDetectorKey = `${detectorKey}_${staticAffordance}`;
  // Change DETECTORS if newDetectorKey does not already exist (some experiences might have already created coffee_mechanismRich, for example)
  if (!(newDetectorKey in DETECTORS)) {
    DETECTORS[newDetectorKey] = {
      '_id': Random.id(),
      'description': `${DETECTORS[detectorKey].description} ${staticAffordance}`,
      'variables': newVars,
      'rules': newRules
    };
  }
  return newDetectorKey;
};