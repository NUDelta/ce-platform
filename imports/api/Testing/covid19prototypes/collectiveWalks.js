import {getDetectorUniqueKey, addStaticAffordanceToNeeds} from "../oce_api_helpers";
import {notifyUsersInNeed} from "../../OpportunisticCoordinator/server/noticationMethods";

import {DETECTORS} from "../DETECTORS";

const createColorsOfSpring = () => {
  /*
  Violet	455 – 390
  Blue	492 – 455
  Green	577 – 492
  Yellow	597 – 577
  Orange	622 – 597
  Red
  */
  const roygbiv = ['Red', 'Orange', 'Yellow', 'Green','Blue', 'Violet'];
  const rainbowColorChoices = _.zip(roygbiv, roygbiv);
  return {
    name: "Colors of Spring",
    /**
     * Importantly, this should put the framing on their walk, a thing they can look for
     * and think about. They might revisit the participate screen...
     *
     * Rather than be restrictive, I think the surfacing of the opportunity
     * should be simply if you're walking (if enough of your activity is walking)
     * And the assignment to which need is actually more dependent on the user?
     * Like the specific label they give the image / images would assign it
     * to its proper place in the the collage.
     * Obstacles;
     * (1) I want to take multiple pictures and participate multiple times.
     * (2) I want to be taken to a dynamic participate screen to input my affordance?
     *    Or do something similar to Cast... I guess the in the moment label is fine, although it kinda
     *    defeats the point.
     *
     */
    // participateTemplate: 'scavengerHuntParticipate',
    participateTemplate: 'ColorsOfSpringParticipate',
    /**
     * To make the results template work...
     * Ideally, we'd want this to be one of the first collage like experiences,
     * where the different colors are ordered in some rainbow, and the visualization
     * was dynamic depending on how it fit in.
     * Maybe it's okay to not focus too much on "visual interdependence" in
     * the first photo taking, but there should be a really cool collective
     * artifact that people could share on social media if they wanted to.
     */
    resultsTemplate: 'ColorsOfSpringResults',
    /**
     * So people participate when they are doing daily walks
     * The walks should be in their neighborhood or near a park because
     * we are looking for colors of flowers!
     *
     * To make the situations to work,
     * Person could be walking or stationary => no change
     *
     */
    contributionTypes: [{
      needName: '🌼',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.daytime), // TODO: walking?
        number: '1'
      },
      toPass: {
        instruction: 'On your walk, can you find flowers of different colors?',
        dropdownChoices: {
          name: 'color',
          options: rainbowColorChoices
        }
      },
      numberNeeded: 6 * 2,
      notificationDelay: 1
    }],
    description: 'Look for flowers on your walk. Together, we can find the colors of spring!',
    notificationText: 'Find 🌼 of different colors together!',
    callbacks: [{
      trigger: 'cb.incidentFinished()',
      function: notifyUsersInNeed('New participation for Colors of Spring', 'View the 🌸🌺🌼').toString()
    }],
  };
};

export default {
  colors_of_spring: createColorsOfSpring(),
  /**
  halfhalf_sunny_knowsDTR: {
    _id: Random.id(),
    name: 'Hand Silhouette',
    group: 'DTR',
    participateTemplate: 'halfhalfParticipate',
    resultsTemplate: 'halfhalfResults',
    contributionTypes: addStaticAffordanceToNeeds('knowsDTR', [{
      // needName MUST have structure "My Need Name XYZ"
      needName: 'Hand Silhouette 1',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.sunny),
        number: '1'
      },
      toPass: {
        instruction: 'Is the <span style="color: #0351ff">weather clear and sunny</span> where you are? Take a photo, <span style="color: #0351ff">holding your hand towards the sky, covering the sun.</span>',
        exampleImage: 'https://s3.us-east-2.amazonaws.com/ce-platform/oce-example-images/half-half-embodied-mimicry-hands-in-front.jpg'
      },
      numberNeeded: 2,
      numberAllowedToParticipateAtSameTime: 1,
      notificationDelay: 1,
    }]),
    description: 'Use the sun to make a silhouette of your hand',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: '(cb.numberOfSubmissions() % 2) === 0',
      function: halfhalfRespawnAndNotify('A hand silhouette was completed','View the photo').toString()
    }]
  }
  */
}