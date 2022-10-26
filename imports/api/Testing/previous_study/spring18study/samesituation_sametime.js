import {DETECTORS} from "../../DETECTORS";
import {getDetectorUniqueKey} from "../../oce_api_helpers";

const createBumped = () => {
  let experience = {
    name: 'Bumped',
    participateTemplate: 'bumped',
    resultsTemplate: 'bumpedResults',
    contributionTypes: [],
    description: 'You just virtually bumped into someone!',
    notificationText: 'You just virtually bumped into someone!',
    callbacks: []
  };

  let bumpedCallback = function (sub) {
    console.log("calling the bumped callback!!!");

    let otherSub = Submissions.findOne({
      uid: {
        $ne: sub.uid
      },
      iid: sub.iid,
      needName: sub.needName
    });

    notify([sub.uid, otherSub.uid], sub.iid, 'See a photo from who you virtually bumped into!', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
  };

  let relationships = ['lovesDTR', 'lovesGarrett', 'lovesMeg', 'lovesMaxine'];
  let places = [
    ["bar", "at a bar"],  // like Cheers!
    ["coffee", "at a coffee shop"],
    ["grocery", "at a grocery store"],
    ["restaurant", "at a restaurant"],
    ["train", "commuting"],
    ["exercising", "exercising"]
  ];
  _.forEach(relationships, (relationship) => {
    _.forEach(places, (place) => {

      let newVars = JSON.parse(JSON.stringify(DETECTORS[place[0]]['variables']));
      newVars.push('var ' + relationship + ';');

      let newRules = JSON.parse(JSON.stringify(DETECTORS[place[0]]['rules']));
      // modify last detector rule
      // when rules has a flat structure where rules.length == 1, last rule is the predicate
      // i.e. ['(diners || restaurants || cafeteria || food_court);']
      // when rules have a nested structure where rules.length > 1, last rule is the predicate
      // i.e. ['worship_places = (buddhist_temples || churches);', '(worship_places || landmarks);']
      let lastRule = newRules.pop();
      // each rule has a `;` at end, i.e. (rain && park);
      // in order to modify the rule, must add relationship predicate preceding the rule
      let lastRuleNoSemicolon = lastRule.split(';')[0];
      lastRule = `(${relationship} && (${lastRuleNoSemicolon}));`;
      newRules.push(lastRule);

      let detector = {
        '_id': Random.id(),
        'description': DETECTORS[place[0]].description + relationship,
        'variables': newVars,
        'rules': newRules
      };
      DETECTORS[place[0] + relationship] = detector;

      for (let i = 0; i < 1; i++) {
        let need = {
          needName: place[0] + relationship + i,
          situation: {
            detector: getDetectorUniqueKey(detector),
            number: '2'
          },
          toPass: {
            instruction: 'You are at a  ' + place[1] + ' at the same time as '
          },
          numberNeeded: 2,
          notificationDelay: 90
        };

        let callback = {
          trigger: 'cb.numberOfSubmissions(\'' + place[0] + relationship + i + '\') === 2',
          function: bumpedCallback.toString(),
        };

        experience.contributionTypes.push(need);
        experience.callbacks.push(callback)
      }
    })
  });

  return experience;
};

export default SAMESITUATION_SAMETIME = {
  bumped: createBumped()
}