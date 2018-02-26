import {addContribution} from "../incidents/methods";

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

let storytimeCallback = function(sub){

  var affordance = sub.content.affordance;

  let options = [
    ["coffee", CONSTANTS.detectors.coffee._id],["sunset", CONSTANTS.detectors.sunset._id],
    ["nighttime", CONSTANTS.detectors.night._id], ["daytime", CONSTANTS.detectors.daytime._id], ["park", CONSTANTS.detectors.rollTheGrass._id]
  ];

  options = options.filter(function(x){
    return x[1] !== affordance;
  });

  let contribution = {
    needName: 'page' + Random.id(3), situation: {detector: affordance, number: '1'},
    toPass: {instruction: 'Take a photo to illustrate this sentence: '+ sub.content.sentence,
      dropdownChoices: {name: "affordance", options: options}
    }, numberNeeded: 1
  };

  addContribution(sub.iid, contribution);

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
  'bumped': {
    _id: Random.id(),
    name: 'You just bumped into someone',
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'basicPhotoList',
    contributionTypes: [{
      needName: 'atPark', situation: {detector: DETECTORS.rollTheGrass._id, number: '2'},
      toPass: {instruction: 'Say something to the person you bumped into'}, numberNeeded: 1
    }],
    description: 'This is a simple experience for testing',
    notificationText: 'Please participate in this test experience!',
  },
  'scavengerHunt': {
    _id: Random.id(),
    name: 'Scavenger Hunt',
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'scavengerHunt',
    contributionTypes: [{
      needName: 'nighttime_selfie', situation: {detector: DETECTORS.night._id, number: '1'},
      toPass: {instruction: 'Take a photo of yourself at night!'}, numberNeeded: 1
    }, {
      needName: 'the_moon', situation: {detector: DETECTORS.night._id, number: '1'},
      toPass: {instruction: 'Take a photo of the moon'}, numberNeeded: 1
    },{
      needName: 'sunset', situation: {detector: DETECTORS.sunset._id, number: '1'},
      toPass: {instruction: 'Take a photo of the sunset'}, numberNeeded: 1
    }, {
      needName: 'daytime_selfie', situation: {detector: DETECTORS.daytime._id, number: '1'},
      toPass: {instruction: 'Take a photo of yourself in the daytime!'}, numberNeeded: 1
    }, {
      needName: 'the_sun', situation: {detector: DETECTORS.daytime._id, number: '1'},
      toPass: {instruction: 'Take a photo of the sun!'}, numberNeeded: 1
    }, {
      needName: 'tree', situation: {detector: DETECTORS.rollTheGrass._id, number: '1'},
      toPass: {instruction: 'Take a photo of a tree!'}, numberNeeded: 1
    }, {
      needName: 'leaf', situation: {detector: DETECTORS.rollTheGrass._id, number: '1'},
      toPass: {instruction: 'Take a photo of a leaf!'}, numberNeeded: 1
    }, {
      needName: 'coffee_maker', situation: {detector: DETECTORS.coffee._id, number: '1'},
      toPass: {instruction: 'Take a photo of a coffee maker'}, numberNeeded: 1
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
      needName: 'pageOne', situation: {detector: DETECTORS.daytime._id, number: '1'},
      toPass: {
        instruction: 'Take a photo to illustrate the sentence: Jimmy looked up at the sky!',
        firstSentence: "Jimmy looked up at the sky",
        dropdownChoices: {name: "affordance", options: [
          ["coffee", DETECTORS.coffee._id],["sunset", DETECTORS.sunset._id], ["nighttime", DETECTORS.night._id], ["daytime", DETECTORS.daytime._id], ["park", DETECTORS.rollTheGrass._id]
          ]}
      },
      numberNeeded: 1
    },
    ],
    description: 'We\'re writing a collective story!',
    notificationText: 'Help us write a story!',
    callbacks: [{
      trigger: 'cb.newSubmission() && (cb.numberOfSubmissions() < 5)',
      function: storytimeCallback.toString(),
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
