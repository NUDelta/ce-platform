import {notifyUsersInIncident} from "../../OpportunisticCoordinator/server/noticationMethods";
import {getDetectorUniqueKey, addStaticAffordanceToNeeds} from "../oce_api_helpers";
import {DETECTORS} from "../DETECTORS";

export const createIndependentStorybook = () => {

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
            detector: getDetectorUniqueKey(DETECTORS[place]),
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

export default MECHANISM_POOR_STORY_EXPERIENCES = {
  mechanismPoorStory: createIndependentStorybook()
}