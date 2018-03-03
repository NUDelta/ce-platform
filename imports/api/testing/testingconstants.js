import {addContribution} from "../incidents/methods";

let LOCATIONS = {
  'park': {lat: 42.056838, lng: -87.675940},
  'lakefill': {lat: 42.054902, lng: -87.670197},
  'burgers': {lat: 42.046131, lng: -87.681559},
  'grocery': {lat: 42.047621, lng: -87.679488},
};

let USERS = {
  'aaa': {
    username: 'aaa',
    password: 'password',
  },
  'bbb': {
    username: 'bbb',
    password: 'password',
  },
  'ccc': {
    username: 'ccc',
    password: 'password',
  }
};

let DETECTORS = {
  'parks': {
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
      'var sunset;',
      'var clear;',
    ],
    'rules': [
      'sunset && clear'
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
  'burgers': {
    '_id': Random.id(),
    'description': ' burgers,',
    'variables': [
      'var  burgers;'
    ],
    'rules': [
      ' burgers'
    ]
  },
  'produce': {
    '_id': Random.id(),
    'description': ' places where you can find fuits and veggies',
    'variables': [
      'var grocery;',
      'var organic_stores;',
      'var fruits___veggies;',
      'var farmers_market;'
    ],
    'rules': [
      '(grocery || organic_stores || fruits___veggies || farmers_market)'
    ]
  },
  'rainbow': {
    '_id': Random.id(),
    'description': 'rainbow flag',
    'variables': [
      'var gay_bars;'
    ],
    'rules': [
      'gay_bars'
    ]
  },
  'drugstore': {
    '_id': Random.id(),
    'description': 'drugstores',
    'variables': [
      'var drugstores;',
      'var pharmacy;'
    ],
    'rules': [
      '(drugstores || pharmacy)'
    ]
  },
 'costume_store': {
    '_id': Random.id(),
    'description': 'costume_store',
    'variables': [
      'var costumes;',
      'var party_supplies;'
    ],
    'rules': [
      '(party_supplies || costumes)'
    ]
  },
  'irish': {
    '_id': Random.id(),
    'description': 'irish',
    'variables': [
      'var irish_pub;',
      'var irish;'
    ],
    'rules': [
      '(irish_pub || irish)'
    ]
  },
  'gas_stations': {
    '_id': Random.id(),
    'description': 'hairsalon',
    'variables': [
      'var men_s_hair_salons;',
      'var hair_salons;',
      'var hair_stylists;',
      'var blow_dry_out_services;',
      'var barbers;'
    ],
    'rules': [
      '(men_s_hair_salons || hair_salons || hair_stylists || blow_dry_out_services || barbers)'
    ]
  },
  'gas_station': {
    '_id': Random.id(),
    'description': 'gas_stations',
    'variables': [
      'var gas_stations;'
    ],
    'rules': [
      'gas_stations'
    ]
  },
  'coffee': {
    '_id': Random.id(),
    'description': 'coffee',
    'variables': [
      'var coffee___tea;',
      'var cafes;',
      'var coffeeshops;'
    ],
    'rules': [
      '(coffee___tea || cafes || coffeeshops)'
    ]
  },
  'bank': {
    '_id': Random.id(),
    'description': 'banks',
    'variables': [
      'var banks___credit_unions;'
    ],
    'rules': [
      'banks___credit_unions'
    ]
  },



};

let storytimeCallback = function (sub) {

  var affordance = sub.content.affordance;

  let options = [
    ["coffee", CONSTANTS.detectors.coffee._id], ["sunset", CONSTANTS.detectors.sunset._id],
    ["nighttime", CONSTANTS.detectors.night._id], ["daytime", CONSTANTS.detectors.daytime._id], ["park", CONSTANTS.detectors.rollTheGrass._id]
  ];

  options = options.filter(function (x) {
    return x[1] !== affordance;
  });

  let contribution = {
    needName: 'page' + Random.id(3), situation: {detector: affordance, number: '1'},
    toPass: {
      instruction: 'Take a photo to illustrate this sentence: ' + sub.content.sentence,
      dropdownChoices: {name: "affordance", options: options}
    }, numberNeeded: 1
  };

  addContribution(sub.iid, contribution);

};




function createBumped(){
  let experience = {
    name: 'Bumped',
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'basicPhotoList',
    contributionTypes: [ ],
    description: 'You just bumped into someone!',
    notificationText: 'You just bumped into someone!',
    callbacks: []
  };

  let bumpedCallback = function (sub) {
    let otherSub = Submissions.findOne({
      uid: { $ne: sub.uid },
      iid: sub.iid,
      needName: sub.needName
    });

    notify([sub.uid, otherSub.uid], sub.iid, 'Find out who you bumped into!', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
  };

  let relationships = ['lovesJennie'];
  let places = ['burgers', 'parks'];
  _.forEach(relationships, (relationship) =>{
    _.forEach(places, (place)=>{
      let newVars = DETECTORS[place]['variables'];
      newVars.push('var ' + relationship + ';');

      let detector = {
        '_id': Random.id(),
        'description': DETECTORS[place].description,
        'variables': newVars,
        'rules': ['(' + DETECTORS[place].rules[0] + ') && ' + relationship ]
      };

      DETECTORS[place+relationship] = detector;

      let need = {
        needName: place,
        situation: {detector: detector._id, number: '2'},
        toPass: {instruction: 'You are at a' + place + ' at the same time as someone else! Take a selfie and we\'ll let you know when they send one back!'},
        numberNeeded: 2
      };
      let callback = {
        trigger: 'cb.numberOfSubmissions(\'' + place + '\') === 2',
        function: bumpedCallback.toString(),
      };

      experience.contributionTypes.push(need);
      experience.callbacks.push(callback)
    })
  });

  return experience;

};

let EXPERIENCES = {
  // 'atThePark': {
  //   _id: Random.id(),
  //   name: 'You\'re at a park',
  //   participateTemplate: 'uploadPhoto',
  //   resultsTemplate: 'basicPhotoList',
  //   contributionTypes: [{
  //     needName: 'atPark', situation: {detector: DETECTORS.rollTheGrass._id, number: '1'},
  //     toPass: {instruction: 'Take a selfie at the park!'}, numberNeeded: 2
  //   }],
  //   description: 'This is a simple experience for testing',
  //   notificationText: 'Please participate in this test experience!',
  // },
  'bumped': createBumped(),
  'sunset': {
    _id: Random.id(),
    name: 'Sunset',
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'sunset',
    contributionTypes: [{
        needName: 'sunset', situation: {detector: DETECTORS.daytime._id, number: '1'},
        toPass: {instruction: 'Take a photo of the sunset!'}, numberNeeded: 35
      }],
    description: 'Help us create a time lapse of the sun setting',
    notificationText: 'Take a photo of the sunset!',
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
    }, {
      needName: 'night_sky', situation: {detector: DETECTORS.night._id, number: '1'},
      toPass: {instruction: 'Take a photo of the night sky'}, numberNeeded: 1
    }, {
      needName: 'sunset', situation: {detector: DETECTORS.sunset._id, number: '1'},
      toPass: {instruction: 'Take a photo of the sunset'}, numberNeeded: 1
    }, {
      needName: 'daytime_selfie', situation: {detector: DETECTORS.daytime._id, number: '1'},
      toPass: {instruction: 'Take a photo of yourself in the daytime!'}, numberNeeded: 1
    }, {
      needName: 'the_sun', situation: {detector: DETECTORS.daytime._id, number: '1'},
      toPass: {instruction: 'Take a photo of the sun!'}, numberNeeded: 1
    }, {
      needName: 'tree', situation: {detector: DETECTORS.parks._id, number: '1'},
      toPass: {instruction: 'Take a photo of a tree!'}, numberNeeded: 1
    }, {
      needName: 'leaf', situation: {detector: DETECTORS.parks._id, number: '1'},
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
        dropdownChoices: {
          name: "affordance", options: [
            ["coffee", DETECTORS.coffee._id], ["sunset", DETECTORS.sunset._id], ["nighttime", DETECTORS.night._id], ["daytime", DETECTORS.daytime._id], ["park", DETECTORS.parks._id]
          ]
        }
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


export const CONSTANTS = {
  'locations': LOCATIONS,
  'users': USERS,
  'experiences': EXPERIENCES,
  'detectors': DETECTORS

};

// Meteor.call('locations.updateUserLocationAndAffordances', {
//   uid: Accounts.findUserByUsername('b@gmail.com')._id,
//   lat: 42.054902,  //lakefill
//   lng: -87.670197
// });
// Meteor.call('locations.updateUserLocationAndAffordances', {
//   uid: Accounts.findUserByUsername('c@gmail.com')._id,
//   lat: 42.056975, //ford
//   lng:  -87.676575
// });
// Meteor.call('locations.updateUserLocationAndAffordances', {
//   uid: Accounts.findUserByUsername('d@gmail.com')._id,
//   lat: 42.059273, //garage
//   lng: -87.673794
// });
// Meteor.call('locations.updateUserLocationAndAffordances', {
//   uid: Accounts.findUserByUsername('e@gmail.com')._id,
//   lat: 42.044314,  //nevins
//   lng: -87.682157
// });
//
// Meteor.call('locations.updateUserLocationAndAffordances', {
//   uid: Accounts.findUserByUsername('g@gmail.com')._id,
//   lat: 42.044314,  //nevins
//   lng: -87.682157
// });
// Meteor.call('locations.updateUserLocationAndAffordances', {
//   uid: Accounts.findUserByUsername('h@gmail.com')._id,
//   lat: 42.045398,  //pubs
//   lng: -87.682431
// });
// Meteor.call('locations.updateUserLocationAndAffordances', {
//   uid: Accounts.findUserByUsername('i@gmail.com')._id,
//   lat: 42.047621, //grocery, whole foods
//   lng: -87.679488
// });
// Meteor.call('locations.updateUserLocationAndAffordances', {
//   uid: Accounts.findUserByUsername('j@gmail.com')._id,
//   lat: 42.042617, //beach
//   lng: -87.671474
