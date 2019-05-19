
/**
 * Create Storytime Helper.
 *
 * @param version [number] determines which detector comes first
 * @return {{_id: string, name: string, participateTemplate: string, resultsTemplate: string, contributionTypes: *[], description: string, notificationText: string, callbacks: *[]}}
 */
function createStorytime(version) {
  // setup places and detectors for storytime
  let places = ["niceish_day", "beer", "train", "forest", "dinning_hall", "castle", "field", "gym"];
  let detectorIds = places.map((x) => { return Random.id(); });
  let detectorNames = [];
  let dropdownText = [
    'Swirling Clouds',
    'Drinking butterbeer',
    'Hogwarts Express',
    'Forbidden Forest',
    'Dinner at the Great Hall',
    'Hogwarts Castle',
    'Quidditch Pitch',
    'Training in the Room of Requirement ',
  ];

  _.forEach(places, (place, i) => {
    let newVars = JSON.parse(JSON.stringify(DETECTORS[place]['variables']));
    newVars.push(`var participatedInStorytime${version};`);
    newVars.push(`var mechanismRich;`);
    let newRules = JSON.parse(JSON.stringify(DETECTORS[place]['rules']));
    // modify last detector rule
    // when rules has a flat structure where rules.length == 1, last rule is the predicate
    // i.e. ['(diners || restaurants || cafeteria || food_court);']
    // when rules have a nested structure where rules.length > 1, last rule is the predicate
    // i.e. ['worship_places = (buddhist_temples || churches);', '(worship_places || landmarks);']
    let lastRule = newRules.pop();
    // each rule has a `;` at end, i.e. (rain && park);
    // in order to modify the rule, must add predicate preceding the rule
    let lastRuleNoSemicolon = lastRule.split(';')[0];
    lastRule = `(mechanismRich && (!participatedInStorytime${version} && (${lastRuleNoSemicolon})));`;
    newRules.push(lastRule);

    let detectorName = `${place}_storytime${version}_mechanismRich`;
    detectorNames.push(detectorName);

    DETECTORS[detectorName] = {
      '_id': detectorIds[i],
      'description': `${DETECTORS[place].description} storytime${version} mechanismRich`,
      'variables': newVars,
      'rules': newRules
    };
  });

  // Don't assume the Random detectorIds we created actually exist
  detectorIds = detectorNames.map((name) => { return getDetectorId(DETECTORS[name]); });
  let DROPDOWN_OPTIONS = _.zip(dropdownText, detectorIds);
  // create story starting point
  let sentences = [
    'Ron looked up at the clouds swirling above him.',
    'Hermoine looked into her goblet, hardly realizing the unusual color of the concoction she was being forced to drink.',
    'Harry prepared himself for a lunge, and then dove forward towards the Platform 9 3/4 wall.',
    'The wizard looked down at their feet, hardly believing the magical plants growing in the Forbidden Forest.',
    'Any young wizard who has their first meal in the Hogwarts Great Hall has to be surprised by the type of food on the menu.',
    'Hogwarts castle had looked so good in photos, but this new wizard looked up at it unimpressed.',
    'Harry Potter saw the snitch diving towards the ground. He aimed his broom towards the grassy ground and followed, reaching his hand out to grab it.',
    'The new wizard of Dumbledore\'s Army was training very hard in the Room of Requirement.'
  ];
  let firstSentence = sentences[version];
  let [firstSituation, firstDetector] = DROPDOWN_OPTIONS[version];
  // notify users when story is complete
  let sendNotification = function (sub) {
    let uids = Submissions.find({iid: sub.iid}).fetch().map(function (x) {
      return x.uid;
    });

    notify(uids, sub.iid, 'Our story is finally complete. Click here to read it!',
      '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
  };

  /**
   * NOTE: if callback depends on any variables defined outside of its scope, we must use some solution so that
   * the variables values are substituted into the callback.toString()
   *
   * For a dynamic code generation solution,
   * @see https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string
   * @see https://medium.com/@oprearocks/serializing-object-methods-using-es6-template-strings-and-eval-c77c894651f0
   * @param sub
   */
  let storytimeCallback = function (sub) {
    Meteor.users.update({
      _id: sub.uid
    }, {
      $set: {
        ['profile.staticAffordances.participatedInStorytime${version}']: true
      }
    });

    // set affordances for storytime
    let affordance = sub.content.affordance;

    // HACKY TEMPLATE DYNAMIC CODE GENERATION
    let options = eval('${JSON.stringify(DROPDOWN_OPTIONS)}');

    let [situation, detectorId] = options.find(function(x) {
      return x[1] === affordance;
    });

    // options = options.filter(function (x) {
    //   return x[1] !== affordance;
    // });

    // add need if not all pages are done
    let needName = 'page' + Random.id(3);
    if (cb.numberOfSubmissions() === 7) {
      needName = 'pageFinal'
    }

    // create and add contribution
    let contribution = {
      needName: needName,
      situation: {
        detector: affordance,
        number: '1'
      },
      toPass: {
        instruction: sub.content.sentence,
        situation: situation,
        previousUserId: sub.uid,
        dropdownChoices: {
          name: 'affordance',
          options: options
        }
      },
      numberNeeded: 1,
      notificationDelay: 90
    };

    addContribution(sub.iid, contribution);
  };

  // FIXME(rlouie): Can't have more than version 0,1,2
  let exp_names = [
    "A Ron Weasley Story",
    "A Hermoine Granger Story",
    "A Harry Potter Story"
  ];

  // create and return storytime experience
  return {
    _id: Random.id(),
    name: exp_names[version],
    participateTemplate: 'storyPage',
    resultsTemplate: 'storybook',
    contributionTypes: [{
      needName: 'pageOne',
      situation: {
        detector: firstDetector,
        number: '1'
      },
      toPass: {
        instruction: firstSentence,
        firstSentence: firstSentence,
        situation: firstSituation,
        dropdownChoices: {
          name: 'affordance',
          options: DROPDOWN_OPTIONS
        }
      },
      numberNeeded: 1,
      notificationDelay: 90
    }],
    description: 'We\'re writing a Harry Potter spin-off story',
    notificationText: 'View this and other available experiences',
    callbacks: [
      {
        trigger: 'cb.newSubmission() && (cb.numberOfSubmissions() <= 7)',
        // substitute any variables used outside of the callback function scope
        function: eval('`' + storytimeCallback.toString() + '`'),
      },
      {
        trigger: 'cb.incidentFinished()',
        function: sendNotification.toString()
      }]
  };
}

const createIndependentStorybook = () => {

  let place_situation_delay = [
    ["niceish_day",'Swirling Clouds', 5],
    ["beer", 'Drinking butterbeer', 90],
    ["train", 'Hogwarts Express', 90],
    ["forest",'Forbidden Forest', 90],
    ["dinning_hall",'Dinner at the Great Hall', 90],
    ["castle",'Hogwarts Castle', 90],
    ["field",'Quidditch Pitch', 90],
    ["gym",'Training in the Room of Requirement', 90]
  ];

  return {
    _id: Random.id(),
    name: 'Humans of Hogwarts',
    participateTemplate: 'storyPage_noInterdependence',
    resultsTemplate: 'storyBook_noInterdependence',
    contributionTypes: addStaticAffordanceToNeeds('mechanismPoor', (function(place_situation_delay) {
      return place_situation_delay.map((x) => {
        let [place, situation, delay] = x;
        return {
          needName: situation,
          situation: {
            detector: getDetectorId(DETECTORS[place]),
            number: '1',
          },
          toPass: {
            situation: situation
          },
          numberNeeded: 2,
          notificationDelay: delay
        }
      });
    })(place_situation_delay)),
    description: 'We\'re writing a Harry Potter spin-off story',
    notificationText: 'View this and other available experiences',
    callbacks: [
      {
        trigger: 'cb.newSubmission()',
        function: (notifyUsersInIncident('Someone added to Humans of Hogwarts',
          'View photos and lines others have created')).toString()
      },
      {
        trigger: 'cb.incidentFinished()',
        function: (notifyUsersInIncident('Humans of Hogwarts has finished',
          "View everyone's photos and lines that were contributed")).toString()
      }]
  };
};