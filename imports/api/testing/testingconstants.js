let LOCATIONS = {
  'park': {lat: 42.056838, lng: -87.675940},
  'lakefill': {lat: 42.054902, lng: -87.670197},
  'burgers': {lat: 42.046131, lng: -87.681559},
  'grocery': {lat: 42.047621, lng: -87.679488},
};

let USERS = {
  'a': {
    email: 'a@gmail.com',
    password: 'password',
  },
  'b': {
    email: 'b@gmail.com',
    password: 'password',
  },
  'c': {
    email: 'c@gmail.com',
    password: 'password',
  }
};

let DETECTORS = {
  'rollTheGrass': {
    '_id': Random.id(),
    'description': 'places to roll in the grass',
    'variables': [
      'var parks;',
      'var gardens;',
    ],
    'rules': [
      '(parks || gardens)'
    ]
  },
  'night': {
    '_id': Random.id(),
    'description': 'places where it\'s nighttime,',
    'variables': [
      'var nighttime;'
    ],
    'rules': [
      'nighttime'
    ]
  },
  'sunset': {
    '_id': Random.id(),
    'description': 'places where it\'s sunset,',
    'variables': [
      'var sunset;'
    ],
    'rules': [
      'sunset'
    ]
  },
  'daytime': {
    '_id': Random.id(),
    'description': 'places where it\'s daytime,',
    'variables': [
      'var daytime;'
    ],
    'rules': [
      'daytime'
    ]
  },
  'coffee': {
    '_id': Random.id(),
    'description': 'places where you can drink coffee,',
    'variables': [
      'var coffee___tea\n;'
    ],
    'rules': [
      'coffee___tea\n'
    ]
  },


};

let EXPERIENCES = {
  'atThePark': {
    _id: Random.id(),
    name: 'You\'re at a park',
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'basicPhotoList',
    contributionTypes: [{
      needName: 'atPark', situation: {detector: DETECTORS.rollTheGrass._id, number: '1'},
      toPass: {instruction: 'Take a selfie at the park!'}, numberNeeded: 2
    }],
    description: 'This is a simple experience for testing',
    notificationText: 'Please participate in this test experience!',
  },
  'scavengerHunt': {
    _id: Random.id(),
    name: 'Scavenger Hunt',
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'photosByCategories',
    contributionTypes: [{
      needName: 'night', situation: {detector: DETECTORS.night._id, number: '1'},
      toPass: {instruction: 'Take a photo of yourself at night!'}, numberNeeded: 3
    }, {
      needName: 'sunset', situation: {detector: DETECTORS.sunset._id, number: '1'},
      toPass: {instruction: 'Take a photo of the sunset'}, numberNeeded: 3
    }, {
      needName: 'daytime', situation: {detector: DETECTORS.daytime._id, number: '1'},
      toPass: {instruction: 'Take a photo of yourself in the daytime!'}, numberNeeded: 3
    }, {
      needName: 'park', situation: {detector: DETECTORS.rollTheGrass._id, number: '1'},
      toPass: {instruction: 'Take a photo of a tree!'}, numberNeeded: 3
    }, {
      needName: 'coffee', situation: {detector: DETECTORS.coffee._id, number: '1'},
      toPass: {instruction: 'Take a photo of coffee'}, numberNeeded: 3
    },
    ],
    description: 'Help us find all the items on our list!',
    notificationText: 'Help us out with our scavenger hunt!',
  },
  'storyTime': {
    _id: Random.id(),
    name: 'Storytime',
    participateTemplate: 'storyPage',
    resultsTemplate: 'storybook',
    contributionTypes: [{
      needName: 'daytime', situation: {detector: DETECTORS.daytime._id, number: '1'},
      toPass: {instruction: 'Take a photo for the story!'}, numberNeeded: 1
    },
    ],
    description: 'We\'re writing a collective story!',
    notificationText: 'Help us write a story!',
    callbacks: [{
      trigger: 'cb.newSubmission()',
      function:'function(submission) { console.log("OMG THE CALLBACK IS RUNNINIGINGNG", submission) }'
    }]
  },

};


console.log('setting up constants');
export const CONSTANTS = {
  'locations': LOCATIONS,
  'users': USERS,
  'experiences': EXPERIENCES,
  'detectors': DETECTORS

};

// Meteor.call('locations.updateUserLocationAndAffordances', {
//   uid: Accounts.findUserByEmail('b@gmail.com')._id,
//   lat: 42.054902,  //lakefill
//   lng: -87.670197
// });
// Meteor.call('locations.updateUserLocationAndAffordances', {
//   uid: Accounts.findUserByEmail('c@gmail.com')._id,
//   lat: 42.056975, //ford
//   lng:  -87.676575
// });
// Meteor.call('locations.updateUserLocationAndAffordances', {
//   uid: Accounts.findUserByEmail('d@gmail.com')._id,
//   lat: 42.059273, //garage
//   lng: -87.673794
// });
// Meteor.call('locations.updateUserLocationAndAffordances', {
//   uid: Accounts.findUserByEmail('e@gmail.com')._id,
//   lat: 42.044314,  //nevins
//   lng: -87.682157
// });
//
// Meteor.call('locations.updateUserLocationAndAffordances', {
//   uid: Accounts.findUserByEmail('g@gmail.com')._id,
//   lat: 42.044314,  //nevins
//   lng: -87.682157
// });
// Meteor.call('locations.updateUserLocationAndAffordances', {
//   uid: Accounts.findUserByEmail('h@gmail.com')._id,
//   lat: 42.045398,  //pubs
//   lng: -87.682431
// });
// Meteor.call('locations.updateUserLocationAndAffordances', {
//   uid: Accounts.findUserByEmail('i@gmail.com')._id,
//   lat: 42.047621, //grocery, whole foods
//   lng: -87.679488
// });
// Meteor.call('locations.updateUserLocationAndAffordances', {
//   uid: Accounts.findUserByEmail('j@gmail.com')._id,
//   lat: 42.042617, //beach
//   lng: -87.671474