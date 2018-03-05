import {addContribution} from '../incidents/methods';
import {Submissions} from "../submissions/submissions";

let LOCATIONS = {
  'park': {lat: 42.056838, lng: -87.675940},
  'lakefill': {lat: 42.054902, lng: -87.670197},
  'burgers': {lat: 42.046131, lng: -87.681559},
  'grocery': {lat: 42.047621, lng: -87.679488},
};

let USERS = {
  'garrett': {
    username: 'garrett',
    password: 'password',
  },
  'garretts_brother': {
    username: 'garretts_brother',
    password: 'password',
  },
  'meg': {
    username: 'meg',
    password: 'password',
  },
  'megs_sister': {
    username: 'megs_sister',
    password: 'password',
  },
  'andrew': {
    username: 'andrew',
    password: 'password',
  },
  'josh': {
    username: 'josh',
    password: 'password',
  }
};

let DETECTORS = {
  'field': {
    '_id': Random.id(),
    'description': 'fields',
    'variables': [
        'var baseball_fields;',
        'var stadiums___arenas;',
        'var soccer;',
        'var parks;'
    ],
    'rules': [
      '(parks || soccer || baseball_fields || stadiums___arenas)'
    ]
  },
  'niceish_day': {
    '_id': Random.id(),
    'description': 'niceish_day',
    'variables': [
        'var clouds;',
        'var clear;',
        'var daytime;'
    ],
    'rules': [
      'daytime && (clouds || clear)'
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
  'library': {
    '_id': Random.id(),
    'description': ' libaries,',
    'variables': [
      'var  libraries;'
    ],
    'rules': [
      ' libraries'
    ]
  },
  'gym': {
    '_id': Random.id(),
    'description': ' gym,',
    'variables': [
      'var  gyms;'
    ],
    'rules': [
      ' gyms'
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
  'hair_salon': {
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
  'beer': {
    '_id': Random.id(),
    'description': 'beer',
    'variables': [
      'var beer_bar;',
      'var bars;',
      'var sports_bars;',
      'var dive_bars;',
      'var irish_pub;',
      'var pubs;',
      'var beer_tours;',
      'var beer_garden;',
      'var beer;',
      'var breweries;'
    ],
    'rules': [
      '(bars || sports_bars || beer_bar || beer || dive_bars || irish_pub || pubs || beer_tours || beer_garden || breweries)'
    ]
  },
  'train': {
    '_id': Random.id(),
    'description': 'trains',
    'variables': [
      'var public_transportation;',
      'var trains;',
      'var train_stations;'
    ],
    'rules': [
      '(trains || train_stations || public_transportation)'
    ]
  },
  'forest': {
    '_id': Random.id(),
    'description': 'forests',
    'variables': [
      'var campgrounds;',
      'var zoos;',
      'var parks;',
      'var botanical_gardens;',
      'var hiking;'
    ],
    'rules': [
      '(campgrounds || botanical_gardens || hiking || zoos || parks)'
    ]
  },
  'dinning_hall': {
    '_id': Random.id(),
    'description': 'dinninghalls',
    'variables': [
      'var diners;',
      'var restaurants;',
      'var cafeteria;',
      'var food_court;'
    ],
    'rules': [
      '(diners || restaurants || cafeteria || food_court)'
    ]
  },
  'castle': {
    '_id': Random.id(),
    'description': 'dinninghalls',
    'variables': [
      'var religious_schools;',
      'var churches;',
      'var landmarks___historical_buildings;',
      'var buddhist_temples;',
      'var hindu_temples;',
      'var synagogues;',
      'var mosques;'
    ],
    'rules': [
      '(mosques || hindu_temples || buddhist_temples || synagogues || churches || religious_schools || landmarks___historical_buildings)'
    ]
  },
  'bar': {
    '_id': Random.id(),
    'description': 'bars',
    'variables': [
        'var dive_bars;',
        'var gay_bars;',
        'var country_dance_halls;',
        'var tapas_bars;',
        'var pool_halls;',
        'var champagne_bars;',
        'var club_crawl;',
        'var tiki_bars;',
        'var sports_bars;',
        'var island_pub;',
        'var karaoke;',
        'var piano_bars;',
        'var pop_up_restaurants;',
        'var irish_pub;',
        'var speakeasies;',
        'var lounges;',
        'var pubs;',
        'var whiskey_bars;',
        'var music_venues;',
        'var bar_crawl;',
        'var irish;',
        'var cocktail_bars;',
        'var bars;',
        'var nightlife;'
    ],
    'rules': [
    '(dive_bars || gay_bars || tapas_bars || country_dance_halls || pool_halls || champagne_bars || club_crawl || tiki_bars || sports_bars || island_pub || karaoke || piano_bars || pop_up_restaurants || irish_pub || speakeasies || lounges || pubs || whiskey_bars || music_venues || bar_crawl || irish || bars || nightlife || cocktail_bars)'
    ]
  },
  'grocery': {
    '_id': Random.id(),
    'description': 'grocery',
    'variables': [
      'var ethnic_grocery;',
      'var international_grocery;',
      'var grocery;',
      'var fruits___veggies;',
      'var farmers_market;'
    ],
    'rules': [
      '(farmers_market || international_grocery || ethnic_grocery || grocery || fruits___veggies)'
    ]
  },
  'restaurant': {
    '_id': Random.id(),
      'description': 'grocery',
      'variables': [
      'var american__traditional_;',
      'var american__new_;',
      'var latin_american;',
      'var pizza;',
      'var pasta_shops;',
      'var burgers;',
      'var italian;',
      'var dominican;',
      'var trinidadian;',
      'var halal;',
      'var food_court;',
      'var arabian;',
      'var pakistani;',
      'var indian;',
      'var himalayan_nepalese;',
      'var afghan;',
      'var persian_iranian;',
      'var lebanese;',
      'var vegetarian;',
      'var middle_eastern;',
      'var kosher;',
      'var chinese;',
      'var mediterranean;',
      'var filipino;',
      'var puerto_rican;',
      'var ethnic_food;',
      'var african;',
      'var soul_food;',
      'var pub_food;',
      'var buffets;',
      'var mongolian;',
      'var brazilian;',
      'var hot_pot;',
      'var fast_food;',
      'var vegan;',
      'var sushi_bars;',
      'var salad;',
      'var japanese;',
      'var korean;',
      'var cafeteria;',
      'var sandwiches;',
      'var imported_food;',
      'var restaurants;',
      'var diners;',
      'var barbeque;',
      'var soup;'
    ],
    'rules': [
      '( american__traditional_ || american__new_ || latin_american || pizza || pasta_shops || burgers || italian || dominican || trinidadian || halal || food_court || arabian || pakistani || indian || himalayan_nepalese || afghan || persian_iranian || lebanese || vegetarian || middle_eastern || kosher || chinese || mediterranean || filipino || puerto_rican || ethnic_food || african || soul_food || pub_food || buffets || mongolian || brazilian || hot_pot || fast_food || vegan || sushi_bars || salad || japanese || korean || cafeteria || sandwiches || imported_food || restaurants || diners || barbeque || soup )'
    ]
  },

};


function createStorytime(){
  let storytimeCallback = function (sub) {

    Meteor.users.update({
      _id: sub.uid
    },{
      $set: {'profile.staticAffordances.participatedInStorytime': true }
    });

    var affordance = sub.content.affordance;

    let options = [
            ['Drinking butterbeer', CONSTANTS.DETECTORS.beer_storytime._id],
            ['Hogwarts Express at Platform 9 3/4', CONSTANTS.DETECTORS.train_storytime._id],
            ['Forbidden Forest', CONSTANTS.DETECTORS.forest_storytime._id],
            ['Dinner at the Great Hall', CONSTANTS.DETECTORS.dinning_hall_storytime._id],
            ['Castle', CONSTANTS.DETECTORS.castle_storytime._id],
            ['Quidditch Pitch', CONSTANTS.DETECTORS.field_storytime._id],
            ['Training in the Room of Requirement ', CONSTANTS.DETECTORS.gym_storytime._id]
          ];

    options = options.filter(function (x) {
      return x[1] !== affordance;
    });

    let contribution = {
      needName: 'page' + Random.id(3), situation: {detector: affordance, number: '1'},
      toPass: {
        instruction: 'Take a photo to illustrate this sentence: ' + sub.content.sentence,
        dropdownChoices: {name: 'affordance', options: options}
      }, numberNeeded: 1
    };

    addContribution(sub.iid, contribution);

  };

  let places = ["beer", "train", "forest", "dinning_hall", "castle", "field", "gym"];
  _.forEach(places, (place)=>{
    let newVars = JSON.parse(JSON.stringify(DETECTORS[place]['variables']));
    newVars.push('var participatedInStorytime;');

    let detector = {
      '_id': Random.id(),
      'description': DETECTORS[place].description + "_storytime",
      'variables': newVars,
      'rules': [ '(' + DETECTORS[place].rules[0] + ' ) && !participatedInStorytime;' ]
    };

    DETECTORS[place+"_storytime"] = detector;

  });

  let dropdownOptions = [
            ['Drinking butterbeer', DETECTORS.beer_storytime._id],
            ['Hogwarts Express at Platform 9 3/4', DETECTORS.train_storytime._id],
            ['Forbidden Forest', DETECTORS.forest_storytime._id],
            ['Dinner at the Great Hall', DETECTORS.dinning_hall_storytime._id],
            ['Castle', DETECTORS.castle_storytime._id],
            ['Quidditch Pitch', DETECTORS.field_storytime._id],
            ['Training in the Room of Requirement ', DETECTORS.gym_storytime._id]
          ];

  let firstSentence = 'Harry Potter looked up at the clouds swirling above him.'

  let sendNotification = function(sub){
    let uids = Submissions.find({iid: sub.iid}).fetch().map(function(x){
      return x.uid;
    });
    notify(uids, sub.iid, 'Our story is finally complete. Click here to read it!', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);

  };


  let experience = {
    _id: Random.id(),
    name: 'Storytime',
    participateTemplate: 'storyPage',
    resultsTemplate: 'storybook',
    contributionTypes: [{
      needName: 'pageOne', situation: {detector: DETECTORS.niceish_day._id, number: '1'},
      toPass: {
        instruction: 'Take a photo to illustrate the sentence: ' + firstSentence,
        firstSentence: firstSentence,
        dropdownChoices: {
          name: 'affordance', options: dropdownOptions
        }
      },
      numberNeeded: 1
    },
    ],
    description: 'We\'re writing a collective story!',
    notificationText: 'Help us write a story!',
    callbacks: [{
      trigger: 'cb.newSubmission() && (cb.numberOfSubmissions() <= 2)',
      function: storytimeCallback.toString(),
    }, {
      trigger:'cb.incidentFinished()',
      function: sendNotification.toString()
    }]
  };

  return experience;

}



function createBumped(){
  let experience = {
    name: 'Bumped',
    participateTemplate: 'bumped',
    resultsTemplate: 'bumpedResults',
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

  let relationships = ['lovesDTR', 'lovesGarrett', 'lovesMeg'];
  let places = [['bar','bar'], ['coffee', 'coffee shop'], ['grocery', 'grocery store'], ['restaurant', "restaurant"]];
  _.forEach(relationships, (relationship) =>{
    _.forEach(places, (place)=>{

      let newVars = JSON.parse(JSON.stringify(DETECTORS[place[0]]['variables']));
      newVars.push('var ' + relationship + ';');

      let detector = {
        '_id': Random.id(),
        'description': DETECTORS[place[0]].description + relationship,
        'variables': newVars,
        'rules': [ '(' + DETECTORS[place[0]].rules[0] + ' && ' + relationship + ');' ]
      };
      DETECTORS[place[0]+relationship] = detector;

      let need = {
        needName: place[0]+relationship,
        situation: {detector: detector._id, number: '2'},
        toPass: {instruction: 'You are at a  ' + place[1] + ' at the same time as '},
        numberNeeded: 2
      };
      let callback = {
        trigger: 'cb.numberOfSubmissions(\'' + place[0]+relationship + '\') === 2',
        function: bumpedCallback.toString(),
      };


      experience.contributionTypes.push(need);
      experience.callbacks.push(callback)
    })
  });

  return experience;

};

let sendNotificationScavenger = function(sub){
  let uids = Submissions.find({iid: sub.iid}).fetch().map(function(x){
    return x.uid;
  });
  notify(uids, sub.iid, 'Wooh! All the scavenger hunt items were found. Click here to see all of them.', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);

};
let sendNotificationSunset = function(sub){
  let uids = Submissions.find({iid: sub.iid}).fetch().map(function(x){
    return x.uid;
  });
  notify(uids, sub.iid, 'Our collective sunset is complete! Click here to see it.', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);

};


let EXPERIENCES = {
  'bumped': createBumped(),
  'sunset': {
    _id: Random.id(),
    name: 'Sunset',
    participateTemplate: 'uploadPhoto',
    resultsTemplate: 'sunset',
    contributionTypes: [{
      needName: 'sunset', situation: {detector: DETECTORS.daytime._id, number: '1'},
      toPass: {instruction: 'Take a photo of the sunset!'}, numberNeeded: 2
    }],
    description: 'Help us create a time lapse of the sun setting',
    notificationText: 'Take a photo of the sunset!',
    callbacks: [{
      trigger:'cb.incidentFinished()',
      function: sendNotificationSunset.toString()
    }]
  },
  'scavengerHunt': {
    _id: Random.id(),
    name: 'Scavenger Hunt',
    participateTemplate: 'scavengerHuntParticipate',
    resultsTemplate: 'scavengerHunt',
    contributionTypes: [{
      needName: 'beer', situation: {detector: DETECTORS.beer._id, number: '1'},
      toPass: {instruction: 'Can you take a photo of beer?'}, numberNeeded: 2
    }, {
      needName: 'greenProduce', situation: {detector: DETECTORS.produce._id, number: '1'},
      toPass: {instruction: 'Can you take a photo of green vegetables? #leprechaunfood'}, numberNeeded: 2
    }, {
      needName: 'coins', situation: {detector: DETECTORS.drugstore._id, number: '1'},
      toPass: {instruction: 'Can you take a photo of chocolate gold coins on display?'}, numberNeeded: 2
    }, {
      needName: 'leprechaun', situation: {detector: DETECTORS.costume_store._id, number: '1'},
      toPass: {instruction: 'Can you take a photo of a Leprechaun costume?'}, numberNeeded: 2
    }, {
      needName: 'irishSign', situation: {detector: DETECTORS.irish._id, number: '1'},
      toPass: {instruction: 'Can you take a photo of an Irish sign?'}, numberNeeded: 2
    }, {
      needName: 'trimmings', situation: {detector: DETECTORS.hair_salon._id, number: '1'},
      toPass: {instruction: 'Can you take a photo of some Leprechaun beard trimmings?'}, numberNeeded: 2
    }, {
      needName: 'liquidGold', situation: {detector: DETECTORS.gas_station._id, number: '1'},
      toPass: {instruction: 'Can you take a photo of liquid gold that Leprechauns use to power their vehicles?'}, numberNeeded: 2
    }, {
      needName: 'potOfGold', situation: {detector: DETECTORS.bank._id, number: '1'},
      toPass: {instruction: 'Can you take a photo of a bank where Leprechauns hide their pots of gold'}, numberNeeded: 2
    }, {
      needName: 'rainbow', situation: {detector: DETECTORS.rainbow._id, number: '1'},
      toPass: {instruction: 'Can you take a photo of a rainbow flag?'}, numberNeeded: 2
    }
    ],
    description: 'Help us complete a scavenger hunt',
    notificationText: 'Help us out with our scavenger hunt',
    callbacks: [{
      trigger:'cb.incidentFinished()',
      function: sendNotificationScavenger.toString()
    }]
  },
  'storyTime': createStorytime(),

};


export const CONSTANTS = {
  'LOCATIONS': LOCATIONS,
  'USERS': USERS,
  'EXPERIENCES': EXPERIENCES,
  'DETECTORS': DETECTORS

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
