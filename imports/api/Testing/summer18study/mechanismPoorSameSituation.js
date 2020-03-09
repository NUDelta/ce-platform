import {getDetectorUniqueKey, addStaticAffordanceToNeeds} from "../oce_api_helpers";
import {notifyUsersInNeed} from "../../OpportunisticCoordinator/server/noticationMethods";
import {DETECTORS} from "../DETECTORS"

export default MECHANISM_POOR_EXPERIENCES = {
  situationaware_sunny: {
    _id: Random.id(),
    name: 'Sunny Days',
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'photosByCategories',
    contributionTypes: addStaticAffordanceToNeeds('mechanismPoor', [{
      needName: 'Sunny Days',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.sunny),
        number: '1'
      },
      toPass: {
        instruction: 'Are you enjoying <span style="color: #0351ff">good weather today?</span> Share a photo of how you are experiencing the sun.'
      },
      numberNeeded: 50,
      notificationDelay: 1,
      allowRepeatContributions: true,
    }]),
    description: 'Appreciate the small moments with others who are doing the same',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: 'cb.newSubmission()',
      function: notifyUsersInNeed('New moment for Sunny Days', 'View the photo').toString()
    }]
  },
  situationaware_grocery: {
    _id: Random.id(),
    name: 'Feed yourself',
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'photosByCategories',
    contributionTypes: addStaticAffordanceToNeeds('mechanismPoor', [{
      needName: 'Feed yourself',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.grocery),
        number: 1
      },
      toPass: {
        instruction: 'Are you <span style="color: #0351ff">shopping for groceries?</span> Share a photo of what you are buying or looking at.'
      },
      numberNeeded: 50,
      notificationDelay: 90,
      allowRepeatContributions: true,
    }]),
    description: 'Appreciate the small moments with others who are doing the same',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: 'cb.newSubmission()',
      function: notifyUsersInNeed('New moment for Feed yourself', 'View the photo').toString()
    }]
  },
  situationaware_cafe: {
    _id: Random.id(),
    name: 'Cafe Days',
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'photosByCategories',
    contributionTypes: addStaticAffordanceToNeeds('mechanismPoor', [{
      needName: 'Cafe Days',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.coffee),
        number: 1
      },
      toPass: {
        instruction: 'Are you <span style="color: #0351ff">at a cafe?</span> Share a photo of yourself with what you purchased, or what you are doing.'
      },
      numberNeeded: 50,
      notificationDelay: 90,
      allowRepeatContributions: true,
    }]),
    description: 'Appreciate the small moments with others who are doing the same',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: 'cb.newSubmission()',
      function: notifyUsersInNeed('New moment for Cafe Days', 'View the photo').toString()
    }]
  },
  situationaware_bar: {
    _id: Random.id(),
    name: 'Hit the Bars',
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'photosByCategories',
    contributionTypes: addStaticAffordanceToNeeds('mechanismPoor', [{
      needName: 'Hit the Bars',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.bar),
        number: 1
      },
      toPass: {
        instruction: 'Are you out <span style="color: #0351ff">drinking at the bar?</span> Share a photo of yourself at this bar.',
      },
      numberNeeded: 50,
      notificationDelay: 90,
      allowRepeatContributions: true,
    }]),
    description: 'Appreciate the small moments with others who are doing the same',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: 'cb.newSubmission()',
      function: notifyUsersInNeed('New moment for Hit the Bars', 'View the photo').toString()
    }]
  },

  situationaware_religious: {
    _id: Random.id(),
    name: 'Religious Worship',
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'photosByCategories',
    contributionTypes: addStaticAffordanceToNeeds('mechanismPoor', [{
      needName: 'Religious Worship',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.castle),
        number: 1
      },
      toPass: {
        instruction: 'Are you at a <span style="color: #0351ff">center for religious worship?</span> Share a photo of something around you.'
      },
      numberNeeded: 50,
      notificationDelay: 30,
      allowRepeatContributions: true,
    }]),
    description: 'Appreciate the small moments with others who are doing the same',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: 'cb.newSubmission()',
      function: notifyUsersInNeed('New moment for Religious Worship', 'View the photo').toString()
    }]
  },
  situationaware_sunset: {
    _id: Random.id(),
    name: 'Catch the sunset',
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'photosByCategories',
    contributionTypes: addStaticAffordanceToNeeds('mechanismPoor', [{
      needName: 'Catch the sunset',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.sunset),
        number: 1
      },
      toPass: {
        instruction: 'Are you out during <span style="color: #0351ff">sunset?</span> Share a photo of what the sky looks like where you are.'
      },
      numberNeeded: 50,
      notificationDelay: 1,
      allowRepeatContributions: true,
    }]),
    description: 'Appreciate the small moments with others who are doing the same',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: 'cb.newSubmission()',
      function: notifyUsersInNeed('New moment for Catch the sunset', 'View the photo').toString()
    }]
  },
  situationaware_asian: {
    _id: Random.id(),
    name: 'Eating Asian Food',
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'photosByCategories',
    contributionTypes: addStaticAffordanceToNeeds('mechanismPoor', [{
      needName: 'Eating Asian Food',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.eating_with_chopsticks),
        number: 1
      },
      toPass: {
        instruction: 'Are you <span style="color: #0351ff">eating at an asian restaurant?</span> Share a photo of yourself dining out right now.'
      },
      numberNeeded: 50,
      notificationDelay: 90,
      allowRepeatContributions: true,
    }]),
    description: 'Appreciate the small moments with others who are doing the same',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: 'cb.newSubmission()',
      function: notifyUsersInNeed('New moment for Eating Asian Food', 'View the photo').toString()
    }]
  },
  situationaware_books: {
    _id: Random.id(),
    name: 'Reading a book',
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'photosByCategories',
    contributionTypes: addStaticAffordanceToNeeds('mechanismPoor', [{
      needName: 'Reading a book',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.library),
        number: 1
      },
      toPass: {
        instruction: 'Are you spending part of the day <span style="color: #0351ff">reading?</span> Share a photo of what you are doing.'
      },
      numberNeeded: 50,
      notificationDelay: 90,
      allowRepeatContributions: true,
    }]),
    description: 'Appreciate the small moments with others who are doing the same',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: 'cb.newSubmission()',
      function: notifyUsersInNeed('New moment for Reading a book', 'View the photo').toString()
    }]
  },
  situationaware_parks: {
    _id: Random.id(),
    name: 'I love parks',
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'photosByCategories',
    contributionTypes: addStaticAffordanceToNeeds('mechanismPoor', [{
      needName: 'I love parks',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.forest),
        number: 1
      },
      toPass: {
        instruction: 'Are you <span style="color: #0351ff">at a park?</span> Share a photo of what is going on around you.'
      },
      numberNeeded: 50,
      notificationDelay: 15,
      allowRepeatContributions: true,
    }]),
    description: 'Appreciate the small moments with others who are doing the same',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: 'cb.newSubmission()',
      function: notifyUsersInNeed('New moment for I love parks', 'View the photo').toString()
    }]
  },
  situationaware_rainy: {
    _id: Random.id(),
    name: 'Rainy Day',
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'photosByCategories',
    contributionTypes: addStaticAffordanceToNeeds('mechanismPoor', [{
      needName: 'Rainy Day',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.rainy),
        number: 1
      },
      toPass: {
        instruction: 'Is it <span style="color: #0351ff">raining</span> today? Share a photo of what it looks like outside.'
      },
      numberNeeded: 50,
      notificationDelay: 1,
      allowRepeatContributions: true,
    }]),
    description: 'Appreciate the small moments with others who are doing the same',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: 'cb.newSubmission()',
      function: notifyUsersInNeed('New moment for Rainy Day', 'View the photo').toString()
    }]
  },
  situationaware_eatout: {
    _id: Random.id(),
    name: "Eating out",
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'photosByCategories',
    contributionTypes: addStaticAffordanceToNeeds('mechanismPoor', [{
      needName: "Eating out",
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.restaurant),
        number: '1'
      },
      toPass: {
        instruction: 'Are you <span style="color: #0351ff">eating out</span> today? Share a photo of yourself at the restaurant.',
      },
      numberNeeded: 50,
      notificationDelay: 60,
      allowRepeatContributions: true,
    }]),
    description: 'Appreciate the small moments with others who are doing the same',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: 'cb.newSubmission()',
      function: notifyUsersInNeed('New moment for Eating out', 'View the photo').toString()
    }]
  },
}

/* These were deployed, but we found that if people contributed to these experiences while another was open,
   it would risk more incompletions */
export const OVERLAPPING_SITUATION_MECHANISM_POOR_EXPERIENCES = {
  situationaware_japanese: {
    _id: Random.id(),
    name: 'Eating Japanese Food',
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'photosByCategories',
    contributionTypes: addStaticAffordanceToNeeds('mechanismPoor', [{
      needName: 'Eating Japanese Food',
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.eating_japanese),
        number: 1
      },
      toPass: {
        instruction: 'Are you eating <span style="color: #0351ff">Japanese food?</span> Share a photo of yourself dining at this restaurant.'
      },
      numberNeeded: 50,
      notificationDelay: 90,
      allowRepeatContributions: true,
    }]),
    description: 'Appreciate the small moments with others who are doing the same',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: 'cb.newSubmission()',
      function: notifyUsersInNeed('New moment for Eating Japanese Food', 'View the photo').toString()
    }]
  },
  situationaware_pizza: {
    _id: Random.id(),
    name: "Eating some 'Za",
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'photosByCategories',
    contributionTypes: addStaticAffordanceToNeeds('mechanismPoor', [{
      needName: "Eating some 'Za",
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.eating_pizza),
        number: '1'
      },
      toPass: {
        instruction: 'Are you <span style="color: #0351ff">eating pizza</span> today? Share a photo of yourself at the pizza restaurant.',
      },
      numberNeeded: 50,
      notificationDelay: 60,
      allowRepeatContributions: true,
    }]),
    description: 'Appreciate the small moments with others who are doing the same',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: 'cb.newSubmission()',
      function: notifyUsersInNeed('New moment for Eating some \'Za', 'View the photo').toString()
    }]
  },
  situationaware_bigbite: {
    _id: Random.id(),
    name: "Eating Big Bites",
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'photosByCategories',
    contributionTypes: addStaticAffordanceToNeeds('mechanismPoor', [{
      needName: "Eating Big Bites",
      situation: {
        detector: getDetectorUniqueKey(DETECTORS.big_bite_restaurant),
        number: '1'
      },
      toPass: {
        instruction: 'Are you <span style="color: #0351ff">eating burritos, sandwiches, or burgers</span> today? Share a photo of yourself at the restaurant.',
      },
      numberNeeded: 50,
      notificationDelay: 60,
      allowRepeatContributions: true,
    }]),
    description: 'Appreciate the small moments with others who are doing the same',
    notificationText: 'View this and other available experiences',
    callbacks: [{
      trigger: 'cb.newSubmission()',
      function: notifyUsersInNeed('New moment for Eating Big Bites', 'View the photo').toString()
    }]
  },
}