let LOCATIONS = {
  'park': { lat: 42.056838, lng: -87.675940 },
  'lakefill': { lat: 42.054902, lng: -87.670197 },
  'burgers': { lat: 42.046131, lng: -87.681559 },
  'grocery': { lat: 42.047621, lng: -87.679488 },
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
  'fruit': {
    '_id': Random.id(),
    'description': 'places one can buy fruit',
    'variables': [
      'var juice_bars___smoothies;',
      'var parks;',
      'var wholesalers;',
      'var specialty_food;',
      'var community_gardens;',
      'var flea_markets;',
      'var ethnic_grocery;',
      'var csa;',
      'var acai_bowls;',
      'var health_markets;',
      'var international_grocery;',
      'var organic_stores;',
      'var grocery;',
      'var attraction_farms;',
      'var farmers_market;',
      'var farms;',
      'var public_markets;',
      'var market_stalls;',
      'var pick_your_own_farms;',
      'var fruits___veggies;'
    ],
    'rules': [
      '(((((((((((((((((parks || fruits___veggies) || market_stalls) || public_markets) || farms) || farmers_market) || attraction_farms) || grocery) || organic_stores) || international_grocery) || health_markets) || acai_bowls) || csa) || ethnic_grocery) || flea_markets) || community_gardens) || specialty_food) || wholesalers) || juice_bars___smoothies;'
    ]
  },
  'night': {
    '_id': Random.id(),
    'description': 'places where it\'s nighttime,',
    'variables': [
      'var nighttime = true;'
    ],
    'rules': [
      'nighttime'
    ]
  },
  'sunset': {
    '_id': Random.id(),
    'description': 'places where it\'s sunset,',
    'variables': [
      'var sunset = true;'
    ],
    'rules': [
      'sunset'
    ]
  },
  'daytime': {
    '_id': Random.id(),
    'description': 'places where it\'s daytime,',
    'variables': [
      'var daytime = true;'
    ],
    'rules': [
      'daytime'
    ]
  }
};

let EXPERIENCES = {
  'atLocation': {
    _id: Random.id(),
    name: 'You\'re at a restaurant',
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'basicPhotoList',
    contributionTypes: [{
      needName: 'atFruit', situation: { detector: DETECTORS.fruit._id, number: '1' },
      toPass: { item: 'fruit' }, numberNeeded: 10
    }],
    description: 'This is a simple experience for testing',
    notificationText: 'Please participate in this test experience!',
  },
  'scavengerHunt': {
    _id: Random.id(),
    name: 'Scavenger Hunt',
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'basicPhotoList',
    contributionTypes: [{
      needName: 'night', situation: { detector: DETECTORS.night._id, number: '1' },
      toPass: { instruction: 'Take a photo of the night' }, numberNeeded: 10
    }, {
      needName: 'sunset', situation: { detector: DETECTORS.sunset._id, number: '1' },
      toPass: { instruction: 'Take a photo of the sunset' }, numberNeeded: 10
    }, {
      needName: 'daytime', situation: { detector: DETECTORS.daytime._id, number: '1' },
      toPass: { instruction: 'Take a photo of the daytime' }, numberNeeded: 10
    }],
    description: 'This is a simple experience for testing',
    notificationText: 'Please participate in this test experience!',
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