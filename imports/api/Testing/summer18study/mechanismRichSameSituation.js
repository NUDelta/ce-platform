import {getDetectorUniqueKey, addStaticAffordanceToNeeds} from "../oce_api_helpers";
import {halfhalfRespawnAndNotify} from "../oce_api_halfhalf_helpers";
import {DETECTORS} from "../DETECTORS";

export default MECHANISM_RICH_EXPERIENCES = {
  halfhalf_sunny: {
    _id: Random.id(),
    name: 'Hand Silhouette',
    participateTemplate: 'halfhalfParticipate',
    resultsTemplate: 'halfhalfResults',
    contributionTypes: addStaticAffordanceToNeeds('mechanismRich', [{
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
  },
  halfhalf_grocery: {
    _id: Random.id(),
    name: 'Grocery Buddies',
    participateTemplate: 'halfhalfParticipate',
    resultsTemplate: 'halfhalfResults',
    contributionTypes: addStaticAffordanceToNeeds('mechanismRich', [{
      // needName MUST have structure "My Need Name XYZ"
      needName: 'Grocery Buddies 1',
      notificationSubject: 'Inside a grocery store?',
      notificationText: 'Share an experience with others who are also grocery shopping',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.grocery),
        number: '1'
      },
      toPass: {
        instruction: 'Are you at the <span style="color: #0351ff">grocery store</span>? Take a photo, <span style="color: #0351ff">holding a fruit or vegetable</span> outstretched with your hands.',
        exampleImage: 'https://s3.us-east-2.amazonaws.com/ce-platform/oce-example-images/half-half-embodied-mimicry-fruit-in-hand.jpg'
      },
      numberNeeded: 2,
      numberAllowedToParticipateAtSameTime: 1,
      notificationDelay: 90,
    }]),
    description: 'While shopping for groceries, create a half half photo.',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: '(cb.numberOfSubmissions() % 2) === 0',
      function: halfhalfRespawnAndNotify('A Grocery Buddies photo completed','View the photo').toString()
    }]
  },
  halfhalf_coffee: {
    _id: Random.id(),
    name: 'Coffee Date',
    participateTemplate: 'halfhalfParticipate',
    resultsTemplate: 'halfhalfResults',
    contributionTypes: addStaticAffordanceToNeeds('mechanismRich', [{
      // needName MUST have structure "My Need Name XYZ"
      needName: 'Coffee Date 1',
      notificationSubject: 'Inside a coffee shop?',
      notificationText: 'Share an experience with others who are also at a coffee shop',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.coffee),
        number: '1'
      },
      toPass: {
        instruction: 'Are you at a <span style="color: #0351ff">cafe</span>? Take a photo, <span style="color: #0351ff">holding your cup, mug, or plate</span> towards the center of the screen.',
        exampleImage: 'https://s3.us-east-2.amazonaws.com/ce-platform/oce-example-images/half-half-embodied-mimicry-cafe.jpg'
      },
      numberNeeded: 2,
      notificationDelay: 90,
    }]),
    description: 'While enjoying a cafe beverage, create a half half photo.',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: '(cb.numberOfSubmissions() % 2) === 0',
      function: halfhalfRespawnAndNotify('A Coffee Date photo completed','View the photo').toString()
    }]
  },
  halfhalf_bar: {
    _id: Random.id(),
    name: 'Cheers',
    participateTemplate: 'halfhalfParticipate',
    resultsTemplate: 'halfhalfResults',
    contributionTypes: addStaticAffordanceToNeeds('mechanismRich', [{
      // needName MUST have structure "My Need Name XYZ"
      needName: 'Cheers 1',
      notificationSubject: 'Drinking at a bar?',
      notificationText: 'Share an experience with others who are also drinking at a bar',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.bar),
        number: '1'
      },
      toPass: {
        instruction: 'What are you <span style="color: #0351ff">drinking at the bar</span>? Take a photo, while <span style="color: #0351ff">raising your glass or bottle</span> in front of you.',
        exampleImage: 'https://s3.us-east-2.amazonaws.com/ce-platform/oce-example-images/half-half-embodied-mimicry-cheers.jpg'
      },
      numberNeeded: 2,
      numberAllowedToParticipateAtSameTime: 1,
      notificationDelay: 90
    }]),
    description: 'While enjoying your drink, create a half half photo.',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: '(cb.numberOfSubmissions() % 2) === 0',
      function: halfhalfRespawnAndNotify('A Cheers photo completed','View the photo').toString()
    }]
  },

  halfhalf_religious: {
    _id: Random.id(),
    name: 'Religious Architecture',
    participateTemplate: 'halfhalfParticipate',
    resultsTemplate: 'halfhalfResults',
    contributionTypes: addStaticAffordanceToNeeds('mechanismRich', [{
      // needName MUST have structure "My Need Name XYZ"
      needName: 'Religious Architecture 1',
      notificationSubject: 'Visiting a place of worship?',
      notificationText: 'Share an experience with others who are also visiting a place of worship',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.castle),
        number: '1'
      },
      toPass: {
        instruction: 'Do you notice the <span style="color: #0351ff">details of the religious building</span> near you? Do so now, by outstretching your hand and pointing out of the elements that stick out to you most.',
        exampleImage: 'https://s3.us-east-2.amazonaws.com/ce-platform/oce-example-images/half-half-embodied-mimicry-religious-building.jpg'
      },
      numberNeeded: 2,
      numberAllowedToParticipateAtSameTime: 1,
      notificationDelay: 90,
    }]),
    description: 'While visiting a place of worship, create a half half photo.',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: '(cb.numberOfSubmissions() % 2) === 0',
      function: halfhalfRespawnAndNotify('A Religious Architecture photo completed','View the photo').toString()
    }]
  },
  halfhalf_sunset: {
    _id: Random.id(),
    name: 'Sunset Together',
    participateTemplate: 'halfhalfParticipate',
    resultsTemplate: 'halfhalfResults',
    contributionTypes: addStaticAffordanceToNeeds('mechanismRich', [{
      // needName MUST have structure "My Need Name XYZ"
      needName: 'Sunset Together 1',
      notificationSubject: 'Can you see the sunset?',
      notificationText: 'Share an experience with others who are also watching the sunset',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.sunset),
        number: '1'
      },
      toPass: {
        instruction: 'What does the <span style="color: #0351ff">sunset</span> look like where you are? Find a good view; then, take a photo, with your hands outstretched towards the sun.',
        exampleImage: 'https://s3.us-east-2.amazonaws.com/ce-platform/oce-example-images/half-half-embodied-mimicry-sunset-heart.jpg'
      },
      numberNeeded: 2,
      numberAllowedToParticipateAtSameTime: 1,
      notificationDelay: 1,
    }]),
    description: 'While looking up at the sunset, create a half half photo.',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: '(cb.numberOfSubmissions() % 2) === 0',
      function: halfhalfRespawnAndNotify('A Sunset Together photo completed','View the photo').toString()
    }]
  },
  halfhalf_asian: {
    _id: Random.id(),
    name: 'Eating with Chopsticks',
    participateTemplate: 'halfhalfParticipate',
    resultsTemplate: 'halfhalfResults',
    contributionTypes: addStaticAffordanceToNeeds('mechanismRich', [{
      // needName MUST have structure "My Need Name XYZ"
      needName: 'Eating with Chopsticks 1',
      notificationSubject: 'Eating at an asian restaurant?',
      notificationText: 'Share an experience with others who are also eating asian food',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.eating_with_chopsticks),
        number: '1'
      },
      toPass: {
        instruction: 'Are you eating <span style="color: #0351ff">asian food</span> right now? Take a photo of what you are eating, <span style="color: #0351ff">holding your chopsticks.</span>',
        exampleImage: 'https://s3.us-east-2.amazonaws.com/ce-platform/oce-example-images/half-half-embodied-mimicry-holding-chopsticks.jpg'
      },
      numberNeeded: 2,
      numberAllowedToParticipateAtSameTime: 1,
      notificationDelay: 90
    }]),
    description: 'While eating asian food, create a half half photo.',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: '(cb.numberOfSubmissions() % 2) === 0',
      function: halfhalfRespawnAndNotify('An Eating with Chopsticks photo completed','View the photo').toString()
    }]
  },
  halfhalf_books: {
    _id: Random.id(),
    name: 'Book Buddies',
    participateTemplate: 'halfhalfParticipate',
    resultsTemplate: 'halfhalfResults',
    contributionTypes: addStaticAffordanceToNeeds('mechanismRich', [{
      // needName MUST have structure "My Need Name XYZ"
      needName: 'Book Buddies 1',
      notificationSubject: 'Are you at a library?',
      notificationText: 'Share an experience with others who are also at the library',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.library),
        number: '1'
      },
      toPass: {
        instruction: 'Sorry to interrupt your <span style="color: #0351ff">reading</span>! Find the nearest book, and take a photo <span style="color: #0351ff">holding up the book to your face.</span>',
        exampleImage: 'https://s3.us-east-2.amazonaws.com/ce-platform/oce-example-images/half-half-embodied-mimicry-book-face.jpg'
      },
      numberNeeded: 2,
      numberAllowedToParticipateAtSameTime: 1,
      notificationDelay: 90,
    }]),
    description: 'While reading a book, create a half half photo.',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: '(cb.numberOfSubmissions() % 2) === 0',
      function: halfhalfRespawnAndNotify('A Book Buddies photo completed','View the photo').toString()
    }]
  },

  halfhalf_leakmask: {
    _id: Random.id(),
    name: 'Leaf Mask',
    participateTemplate: 'halfhalfParticipate',
    resultsTemplate: 'halfhalfResults',
    contributionTypes: addStaticAffordanceToNeeds('mechanismRich', [{
      // needName MUST have structure "My Need Name XYZ"
      needName: 'Leaf Mask 1',
      notificationSubject: 'Are you at a park?',
      notificationText: 'Share an experience with others who are also at a park',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.forest),
        number: '1'
      },
      toPass: {
        instruction: 'Find a <span style="color: #0351ff">leaf in the park</span>. Take a photo of the <span style="color: #0351ff">leaf covering your face, like it was a mask.</span>',
        exampleImage: 'https://s3.us-east-2.amazonaws.com/ce-platform/oce-example-images/half-half-embodied-mimicry-leaf-face.jpg'
      },
      numberNeeded: 2,
      numberAllowedToParticipateAtSameTime: 1,
      notificationDelay: 90
    }]),
    description: 'While in the park, create a half half photo.',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: '(cb.numberOfSubmissions() % 2) === 0',
      function: halfhalfRespawnAndNotify('A Feet to the trees photo completed','View the photo').toString()
    }]
  },
  halfhalf_puddles: {
    _id: Random.id(),
    name: 'Puddle Feet',
    participateTemplate: 'halfhalfParticipate',
    resultsTemplate: 'halfhalfResults',
    contributionTypes: addStaticAffordanceToNeeds('mechanismRich', [{
      // needName MUST have structure "My Need Name XYZ"
      needName: 'Puddle Feet 1',
      notificationSubject: 'Are you outside while its raining?',
      notificationText: 'Share an experience with others who are enjoying or enduring the rain',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.rainy),
        number: '1'
      },
      toPass: {
        instruction: 'Is it <span style="color: #0351ff">raining</span> today? Find a <span style="color: #0351ff">puddle</span> on the ground. Take a photo of yourself, stomping on the puddle!',
        exampleImage: 'https://s3.us-east-2.amazonaws.com/ce-platform/oce-example-images/half-half-embodied-mimicry-puddle-feet.jpg'
      },
      numberNeeded: 2,
      numberAllowedToParticipateAtSameTime: 1,
      notificationDelay: 1,
    }]),
    description: 'With the puddles on a rainy day, create a half half photo.',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: '(cb.numberOfSubmissions() % 2) === 0',
      function: halfhalfRespawnAndNotify('A "Puddle Feet" photo completed','View the photo').toString()
    }]
  },
  halfhalf_bigbites: {
    _id: Random.id(),
    name: "Big Bites",
    participateTemplate: 'halfhalfParticipate',
    resultsTemplate: 'halfhalfResults',
    contributionTypes: addStaticAffordanceToNeeds('mechanismRich', [{
      needName: "Big Bites 1", // Any restaurant that would serve something you'd eat with your hands (burrito, tacos, hotdogs, sandwiches, wraps, burgers, tradamerican, newamerican )
      notificationSubject: 'Eating at a restaurant?',
      notificationText: 'Share an experience with others who are enjoying big bites of their meal',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.big_bite_restaurant),
        number: '1'
      },
      toPass: {
        instruction: `Are you <span style="color: #0351ff">eating food that would require a big bite</span> right now? Take a photo of yourself <span style="color: #0351ff">holding up your food</span> to the middle of the screen.`,
        exampleImage: 'https://s3.us-east-2.amazonaws.com/ce-platform/oce-example-images/half-half-embodied-mimicry-big-bite.jpg'
      },
      numberNeeded: 2,
      numberAllowedToParticipateAtSameTime: 1,
      notificationDelay: 90, // https://www.quora.com/Whats-the-average-time-that-customers-wait-between-entering-a-restaurant-and-getting-served
    }]),
    description: 'While eating some non-trivially sized food, create a half half photo.',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: '(cb.numberOfSubmissions() % 2) === 0',
      function: halfhalfRespawnAndNotify("A 'Big Bites' photo completed",'View the photo').toString()
    }]
  },
}

/* These were deployed, but we found that if people contributed to these experiences while another was open,
   it would risk more incompletions */
export const OVERLAPPING_SITUATION_MECHANISM_RICH_EXPERIENCES = {
  halfhalf_japanese: {
    _id: Random.id(),
    name: 'Itadakimasu',
    participateTemplate: 'halfhalfParticipate',
    resultsTemplate: 'halfhalfResults',
    contributionTypes: addStaticAffordanceToNeeds('mechanismRich', [{
      // needName MUST have structure "My Need Name XYZ"
      needName: 'Itadakimasu 1',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.eating_japanese),
        number: '1'
      },
      toPass: {
        instruction: 'Take a photo, while <span style="color: #0351ff">holding chopsticks in your hand</span>, saying "Itadakimasu" which translates to "I humbly receive this meal"',
        exampleImage: 'https://s3.us-east-2.amazonaws.com/ce-platform/oce-example-images/half-half-embodied-mimicry-itadakimasu.jpg'
      },
      numberNeeded: 2,
      notificationDelay: 90,
    }]),
    description: 'While eating Japanese Food, create a half half photo.',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: '(cb.numberOfSubmissions() % 2) === 0',
      function: halfhalfRespawnAndNotify('A Itadakimasu photo completed','View the photo').toString()
    }]
  },
  halfhalf_plantcircle: {
    _id: Random.id(),
    name: 'Hold a plant',
    participateTemplate: 'halfhalfParticipate',
    resultsTemplate: 'halfhalfResults',
    contributionTypes: addStaticAffordanceToNeeds('mechanismRich', [{
      // needName MUST have structure "My Need Name XYZ"
      needName: 'Hold a plant 1',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.forest),
        number: '1'
      },
      toPass: {
        instruction: 'Find a plant in the <span style="color: #0351ff">park or garden</span>. Take a photo, with your hand shaped as a half-circle.',
        exampleImage: 'https://s3.us-east-2.amazonaws.com/ce-platform/oce-example-images/half-half-embodied-mimicry-hand-circles-flower.jpg'
      },
      numberNeeded: 2,
      notificationDelay: 90,
    }]),
    description: 'While in the park, create a half half photo.',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: '(cb.numberOfSubmissions() % 2) === 0',
      function: halfhalfRespawnAndNotify('A Plant Circle photo completed','View the photo').toString()
    }]
  },
  halfhalf_feettotrees: {
    _id: Random.id(),
    name: 'Feet to the trees',
    participateTemplate: 'halfhalfParticipate',
    resultsTemplate: 'halfhalfResults',
    contributionTypes: addStaticAffordanceToNeeds('mechanismRich', [{
      // needName MUST have structure "My Need Name XYZ"
      needName: 'Feet to the trees 1',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.forest),
        number: '1'
      },
      toPass: {
        instruction: 'Find a <span style="color: #0351ff">patch of grass to lay your back on</span>. Then, raise your feet. Take a photo of your foot stretching high into the sky',
        exampleImage: 'https://s3.us-east-2.amazonaws.com/ce-platform/oce-example-images/half-half-embodied-mimicry-feet-towards-trees.jpg'
      },
      numberNeeded: 2,
      notificationDelay: 5,
    }]),
    description: 'While in the park, create a half half photo.',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: '(cb.numberOfSubmissions() % 2) === 0',
      function: halfhalfRespawnAndNotify('A Feet to the trees photo completed','View the photo').toString()
    }]
  },
  halfhalf_pizza: {
    _id: Random.id(),
    name: "Slice of 'Za",
    participateTemplate: 'halfhalfParticipate',
    resultsTemplate: 'halfhalfResults',
    contributionTypes: addStaticAffordanceToNeeds('mechanismRich', [{
      // needName MUST have structure "My Need Name XYZ"
      needName: "Slice of 'Za 1",
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.eating_pizza),
        number: '1'
      },
      toPass: {
        instruction: `Did you order <span style="color: #0351ff">pizza</span>? Hold up a <span style="color: #0351ff">slice of 'Za</span> and take a photo of half the slice!`,
        exampleImage: 'https://s3.us-east-2.amazonaws.com/ce-platform/oce-example-images/half-half-embodied-mimicry-pizza-slice.jpg'
      },
      numberNeeded: 2,
      notificationDelay: 90,
    }]),
    description: 'While eating pizza, create a half half photo.',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: '(cb.numberOfSubmissions() % 2) === 0',
      function: halfhalfRespawnAndNotify("A \"Slice of 'Za\" photo completed",'View the photo').toString()
    }]
  },
  halfhalf_creamwiththat: {
    _id: Random.id(),
    name: "Want cream with that",
    participateTemplate: 'halfhalfParticipate',
    resultsTemplate: 'halfhalfResults',
    contributionTypes: addStaticAffordanceToNeeds('mechanismRich', [{
      // needName MUST have structure "My Need Name XYZ"
      needName: "Want cream with that 1",
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.coffee), // any place that has cups (cafes + bars + restaurants)
        number: '1'
      },
      toPass: {
        instruction: `Do you have <span style="color: #0351ff">a cup or glass</span> you are drinking? Take a photo with it in the middle of the picture. You can even try to <span style="color: #0351ff">pour some extra "cream"</span> into it too!`,
        exampleImage: 'https://s3.us-east-2.amazonaws.com/ce-platform/oce-example-images/half-half-teasing-lotion-in-a-cup.jpg'
      },
      numberNeeded: 2,
      notificationDelay: 60,
    }]),
    description: 'While drinking coffee at a cafe, create a half half photo.',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: '(cb.numberOfSubmissions() % 2) === 0',
      function: halfhalfRespawnAndNotify("A 'Want cream with that' photo completed",'View the photo').toString()
    }]
  },
  halfhalf_eatfromsamebowl: {
    _id: Random.id(),
    name: "Share a plate",
    participateTemplate: 'halfhalfParticipate',
    resultsTemplate: 'halfhalfResults',
    contributionTypes: addStaticAffordanceToNeeds('mechanismRich', [{
      // needName MUST have structure "My Need Name XYZ"
      needName: "Share a plate 1", // bowl? Plate?  (basically all restaurants)
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.restaurant),
        number: '1'
      },
      toPass: {
        instruction: `Are you <span style="color: #0351ff">eating out</span> right now? Take a photo of yourself holding up <span style="color: #0351ff">a bowl or plate</span> to the middle of the screen.`,
        exampleImage: 'https://s3.us-east-2.amazonaws.com/ce-platform/oce-example-images/half-half-embodied-mimicry-bowls-up.jpg'
      },
      numberNeeded: 2,
      notificationDelay: 60,
    }]),
    description: 'While eating out at a restaurant, create a half half photo.',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: '(cb.numberOfSubmissions() % 2) === 0',
      function: halfhalfRespawnAndNotify("A 'Share a Plate' photo completed",'View the photo').toString()
    }]
  },
}