import {getDetectorUniqueKey} from "../oce_api_helpers"
import { addContribution } from "../../OCEManager/OCEs/methods";
import {DETECTORS} from "../DETECTORS";


/**
 * createStorytimeImproved (improved on May 30th 2019)
 *
 * @param knowsGroup (e.g., "knowsOlin")
 * @param version (e.g., 0 determines a starting point in the story of 0)
 * @return {{contributionTypes: {notificationDelay: number, numberNeeded: number, needName: string, toPass: {firstSentence: string, instruction: string, dropdownChoices: {name: string, options: *}, situation}, situation: {number: string, detector}}[], participateTemplate: string, notificationText: string, name: string, resultsTemplate: string, description: string, callbacks: *[], _id: *}}
 */
export const createStorytimeImproved = (group, version) => {
  const knowsGroup = `knows${group}`;

  // setup places and detectors for storytime
  let places = ["niceish_day", "bar", "train", "forest", "restaurant", "gym"];
  let detectorUniqueKeys = places.map((x) => { return Random.id(); });
  let detectorNames = [];
  let dropdownText = [
    'Swirling Clouds',
    'Drinking butterbeer',
    'Hogwarts Express',
    'Forbidden Forest',
    'Dinner at the Great Hall',
    'Training in the Room of Requirement',
  ];
  const notificationSubjects = [
    'Is the weather cloudy today?',
    'Drinking at a bar?',
    'Waiting at a train station?',
    'Are you at a park?',
    'Eating out at a restaurant?',
    'Working out at the gym?'
  ];
  const notificationTexts = [
    'Create a story with others using the cloudy scene above you',
    'Create a story with others using the bar scene around you',
    'Create a story with others using the train station scene around you',
    'Create a story with others using the park scene around you',
    'Create a story with others using the dining scene around you',
    'Create a story with others using the gym scene around you',
  ];

  // updating detector rules to have static affordances
  _.forEach(places, (place, i) => {
    let newVars = JSON.parse(JSON.stringify(DETECTORS[place]['variables']));
    newVars.push(`var ${knowsGroup};`);
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
    lastRule = `(${knowsGroup} && (${lastRuleNoSemicolon}))`;
    newRules.push(lastRule);

    let detectorName = `${place}_storytime_${knowsGroup}`;
    detectorNames.push(detectorName);

    DETECTORS[detectorName] = {
      '_id': detectorUniqueKeys[i],
      'description': `${DETECTORS[place].description} storytime ${knowsGroup}`,
      'variables': newVars,
      'rules': newRules
    };
  });

  // Don't assume the Random detectorUniqueKeys we created actually exist
  detectorUniqueKeys = detectorNames.map((name) => { return getDetectorUniqueKey(DETECTORS[name]); });
  let DROPDOWN_OPTIONS = _.zip(dropdownText, detectorUniqueKeys);
  let NOTIF_SUBJECT_OPTIONS = _.zip(notificationSubjects, detectorUniqueKeys);
  let NOTIF_TEXT_OPTIONS = _.zip(notificationTexts, detectorUniqueKeys);

  // create story starting point
  let sentences = [
    'Ron looked up at the clouds swirling above him.',
    'Hermoine looked into her goblet, hardly realizing the unusual color of the concoction she was being forced to drink.',
    'Harry prepared himself for a lunge, and then dove forward towards the Platform 9 3/4 wall.',
    'The wizard looked down at their feet, hardly believing the magical plants growing in the Forbidden Forest.',
    'Any young wizard who has their first meal in the Hogwarts Great Hall has to be surprised by the type of food on the menu.',
    'The new wizard of Dumbledore\'s Army was training very hard in the Room of Requirement.'
  ];
  let firstSentence = sentences[version];
  let [firstSituation, firstDetector] = DROPDOWN_OPTIONS[version];
  let [firstNotificationSubject, _1] = NOTIF_SUBJECT_OPTIONS[version];
  let [firstNotificationText, _2] = NOTIF_TEXT_OPTIONS[version];
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
  const storytimeCallbackImproved = function (sub) {
    // coordinator/strategizer handles repitition in experiences

    // set affordances for storytime
    let affordance = sub.content.affordance;

    // HACKY TEMPLATE DYNAMIC CODE GENERATION
    let options = eval('${JSON.stringify(DROPDOWN_OPTIONS)}');
    let notification_subject_options = eval('${JSON.stringify(NOTIF_SUBJECT_OPTIONS)}');
    let notification_text_options = eval('${JSON.stringify(NOTIF_TEXT_OPTIONS)}');

    let [situation, detectorUniqueKey] = options.find(function(x) {
      return x[1] === affordance;
    });
    let [notificationSubject, _1] = notification_subject_options.find(function(x) {
      return x[1] === affordance;
    });
    let [notificationText, _2] = notification_text_options.find(function(x) {
      return x[1] === affordance;
    });


    // options = options.filter(function (x) {
    //   return x[1] !== affordance;
    // });

    // add need if not all pages are done
    let needName = 'page' + Random.id(3);
    if (cb.numberOfSubmissions() === 15) {
      needName = 'pageFinal'
    }

    // create and add contribution
    let contribution = {
      needName: needName,
      notificationSubject: notificationSubject,
      notificationText: notificationText,
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
    group: group,
    participateTemplate: 'storyPage',
    resultsTemplate: 'storybook',
    repeatContributionsToExperienceAfterN: 1, // let one people participate before I can again
    contributionTypes: [{
      needName: 'pageOne',
      notificationSubject: firstNotificationSubject,
      notificationText: firstNotificationText,
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
    description: "Create a story with others, told through people's everyday surroundings",
    callbacks: [
      {
        trigger: `cb.newSubmission() && (cb.numberOfSubmissions() <= 15)`,
        // substitute any variables used outside of the callback function scope
        function: eval('`' + storytimeCallbackImproved.toString() + '`'),
      },
      {
        trigger: 'cb.incidentFinished()',
        function: sendNotification.toString()
      }]
  };
};