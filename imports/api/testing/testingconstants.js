import {addContribution} from '../incidents/methods';
import {Submissions} from "../submissions/submissions";
import {serverLog} from "../logs";
import {Meteor} from "meteor/meteor";
import { Detectors } from "../detectors/detectors";

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
    '_id': 'rEbK6WMQnPPAGAXMX',
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
    '_id': 'x7EgLErQx3qmiemqt',
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
    '_id': 'Wth3TB9Lcf6me6vgy',
    'description': 'places where it\'s nighttime,',
    'variables': [
      'var nighttime;',
    ],
    'rules': [
      '(nighttime)'
    ]
  },
  'sunset': {
    '_id': '44EXNzHS7oD2rbF68',
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
    '_id': 'tyZMZvPKkkSPR4FpG',
    'description': 'places where it\'s daytime,',
    'variables': [
      'var daytime;'
    ],
    'rules': [
      'daytime'
    ]
  },
  'library': {
    '_id': '5LqfPRajiQRe9BwBT',
    'description': ' libaries,',
    'variables': [
      'var  libraries;'
    ],
    'rules': [
      ' libraries'
    ]
  },
  'gym': {
    '_id': '3XqHN8A4EpCZRpegS',
    'description': ' gym',
    'variables': [
      'var  gyms;'
    ],
    'rules': [
      ' gyms'
    ]
  },
  'produce': {
    '_id': 'oHCMYfBBcaphXqQnT',
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
    '_id': 'ksxGTXMaSpCFdmqqN',
    'description': 'rainbow flag',
    'variables': [
      'var gay_bars;'
    ],
    'rules': [
      'gay_bars'
    ]
  },
  'drugstore': {
    '_id': 'k8KFfv3ATtbg2tnFB',
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
    '_id': 'ECPk2mjuHJtrMotGg',
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
    '_id': '5CJGGtjqyY89n55XP',
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
    '_id': 'eG4no7zpSnthwwcv5',
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
  'eating_alone': { //collective narrative
    '_id': 'eG4no7zpSnthwwcv6',
    'description': 'eating_alone',
    'variables': [
      'var food_court;',
      'var dinning_hall;',
    ],
    'rules': [
      '(food_court || dinning_hall)'
    ]
  },
  'gas_station': {
    '_id': 'xZBgjwdPw8rtg86eo',
    'description': 'gas_stations',
    'variables': [
      'var gas_stations;'
    ],
    'rules': [
      'gas_stations'
    ]
  },
  'coffee': {
    '_id': '5DrGWRyMpu7WWFo7m',
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
    '_id': 'qR9s4EtPngjZeEp9u',
    'description': 'banks',
    'variables': [
      'var banks___credit_unions;'
    ],
    'rules': [
      'banks___credit_unions'
    ]
  },
  'beer': {
    '_id': 'i3yMtjdjTyJQRendD',
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
    '_id': 'mu8JcPRF7mEernyNQ',
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
    '_id': 'FfZnzP72ip4SLY4eR',
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
    '_id': 'sSK7rbbC9sHQBN94Y',
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
    '_id': 'kMNownPaYRKxBXJfm',
    'description': 'castle',
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
    '_id': 'JLq2pGg8fizWGdZe2',
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
    '_id': 'jtCXkXBi4k6oJerxP',
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
  'lake': {
    '_id': '9iEpW4mb4ysHY5thP',
    'description': 'lake',
    'variables': [
      'var lakes;'
    ],
    'rules': [
      '(lakes)'
    ]
  },
  'rainy': {
    '_id': 'puLHKiGkLCJWpKc62',
    'description': 'rainy',
    'variables': [
      'var rain;'
    ],
    'rules': [
      '(rain)'
    ]
  },
  'sunny': {
    '_id': '6vyrBtdDAyRArMasj',
    'description': 'clear',
    'variables': [
      'var clear;',
      'var daytime;',
    ],
    'rules': [
      '(clear && daytime)'
    ]
  },
  'cloudy': {
    '_id': 'sorCvK53fyi5orAmj',
    'description': 'clouds',
    'variables': [
      'var clouds;',
      'var daytime;',
    ],
    'rules': [
      '(clouds && daytime)'
    ]
  },

  'restaurant': {
    '_id': 'MzyBGuc6fLGR8Kjii',
    'description': 'restaurant',
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
      'var sandwiches;',
      'var imported_food;',
      'var restaurants;',
      'var diners;',
      'var barbeque;',
      'var soup;'
    ],
    'rules': [
      '( american__traditional_ || american__new_ || latin_american || pizza || pasta_shops || burgers || italian || dominican || trinidadian || halal || food_court || arabian || pakistani || indian || himalayan_nepalese || afghan || persian_iranian || lebanese || vegetarian || middle_eastern || kosher || chinese || mediterranean || filipino || puerto_rican || ethnic_food || african || soul_food || pub_food || buffets || mongolian || brazilian || hot_pot || fast_food || vegan || sushi_bars || salad || japanese || korean || sandwiches || imported_food || restaurants || diners || barbeque || soup )'
    ]
  }, 'exercising':
    {
      "_id": "cTJmt5D6JGMNiJ3Yq",
      "description": "exercising",
      "variables": [
        'var fitness___instruction;',
        'var climbing;',
        'var rock_climbing;',
        'var badminton;',
        'var parks;',
        'var golf;',
        'var bowling;',
        'var kickboxing;',
        'var circuit_training_gyms;',
        'var soccer;',
        'var professional_sports_teams;',
        'var boxing;',
        'var boot_camps;',
        'var amateur_sports_teams;',
        'var tennis;',
        'var cardio_classes;',
        'var interval_training_gyms;',
        'var pool_halls;',
        'var beach_volleyball;',
        'var fencing_clubs;',
        'var physical_therapy;',
        'var barre_classes;',
        'var trainers;',
        'var spin_classes;',
        'var cycling_classes;',
        'var gyms;',
        'var pilates;',
        'var squash;',
        'var martial_arts;',
        'var dance_studios;',
        'var surfing;',
        'var muay_thai;',
        'var weight_loss_centers;',
        'var sports_clubs;',
        'var aerial_fitness;',
        'var pole_dancing_classes;',
        'var brazilian_jiu_jitsu;',
        'var community_centers;'
      ],
      "rules": [
        "((((soccer || professional_sports_teams) || ((amateur_sports_teams || tennis) || ((pool_halls || beach_volleyball) || (fencing_clubs || physical_therapy)))) || ((kickboxing || circuit_training_gyms) || ((boxing || boot_camps) || ((cardio_classes || interval_training_gyms) || ((barre_classes || trainers) || ((spin_classes || cycling_classes) || ((gyms || fitness___instruction) || ((pilates || squash) || ((martial_arts || dance_studios) || ((surfing || muay_thai) || ((weight_loss_centers || sports_clubs) || ((aerial_fitness || pole_dancing_classes) || (brazilian_jiu_jitsu || community_centers))))))))))))) || (climbing || rock_climbing)) || (((badminton || parks) || (golf || bowling)) || fitness___instruction)"
      ]
    }

};


function createStorytime() {

  let storytimeCallback = function (sub) {

    Meteor.users.update({
      _id: sub.uid
    }, {
      $set: {'profile.staticAffordances.participatedInStorytime': true}
    });

    var affordance = sub.content.affordance;

    let options = [
      ['Drinking butterbeer', CONSTANTS.DETECTORS.beer_storytime._id],
      ['Hogwarts Express at Platform 9 3/4', CONSTANTS.DETECTORS.train_storytime._id],
      ['Forbidden Forest', CONSTANTS.DETECTORS.forest_storytime._id],
      ['Dinner at the Great Hall', CONSTANTS.DETECTORS.dinning_hall_storytime._id],
      ['Hogwarts Castle', CONSTANTS.DETECTORS.castle_storytime._id],
      ['Quidditch Pitch', CONSTANTS.DETECTORS.field_storytime._id],
      ['Training in the Room of Requirement ', CONSTANTS.DETECTORS.gym_storytime._id]
    ];
    options = options.filter(function (x) {
      return x[1] !== affordance;
    });

    let needName = 'page' + Random.id(3);
    if (cb.numberOfSubmissions() == 7) {
      needName = 'pageFinal'
    }
    let contribution = {
      needName: needName, situation: {detector: affordance, number: '1'},
      toPass: {
        instruction: sub.content.sentence,
        dropdownChoices: {name: 'affordance', options: options}
      }, numberNeeded: 1
    };
    addContribution(sub.iid, contribution);
  };

  let places = ["beer", "train", "forest", "dinning_hall", "castle", "field", "gym"];
  let detectorIds = ["N3uajhH3chDssFq3r", "Ly9vMvepymC4QNJqA", "52j9BfZ8DkZvSvhhf", "AKxSxuYBFqKP3auie", "LTnK6z94KQTJKTmZ8", "cDFgLqAAhtFWdmXkd", "H5P9ga8HHpCbxBza8", "M5SpmZQdc82GJ7xDj"];
  let i = 0;
  _.forEach(places, (place) => {

    let newVars = JSON.parse(JSON.stringify(DETECTORS[place]['variables']));
    newVars.push('var participatedInStorytime;');

    DETECTORS[place + "_storytime"] = {
      '_id': detectorIds[i],
      'description': DETECTORS[place].description + "_storytime",
      'variables': newVars,
      'rules': ['(' + DETECTORS[place].rules[0] + ' ) && !participatedInStorytime;']
    };

    i++;
  });

  let dropdownOptions = [
    ['Drinking butterbeer', DETECTORS.beer_storytime._id],
    ['Hogwarts Express at Platform 9 3/4', DETECTORS.train_storytime._id],
    ['Forbidden Forest', DETECTORS.forest_storytime._id],
    ['Dinner at the Great Hall', DETECTORS.dinning_hall_storytime._id],
    ['Hogwarts Castle', DETECTORS.castle_storytime._id],
    ['Quidditch Pitch', DETECTORS.field_storytime._id],
    ['Training in the Room of Requirement ', DETECTORS.gym_storytime._id]
  ];

  let firstSentence = 'Harry Potter looked up at the clouds swirling above him.';

  let sendNotification = function (sub) {
    let uids = Submissions.find({iid: sub.iid}).fetch().map(function (x) {
      return x.uid;
    });
    notify(uids, sub.iid, 'Our story is finally complete. Click here to read it!', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);

  };


  let experience = {
    _id: "wGWTtQjmgEYSuRtrk", //Random.id(),
    name: 'Storytime',
    participateTemplate: 'storyPage',
    resultsTemplate: 'storybook',
    contributionTypes: [{
      needName: 'pageOne', situation: {detector: DETECTORS.niceish_day._id, number: '1'},
      toPass: {
        instruction: firstSentence,
        firstSentence: firstSentence,
        dropdownChoices: {
          name: 'affordance', options: dropdownOptions
        }
      },
      numberNeeded: 1
    },
    ],
    description: 'We\'re writing a Harry Potter spin-off story',
    notificationText: 'Help write a Harry Potter spin-off story!',
    callbacks: [{
      trigger: 'cb.newSubmission() && (cb.numberOfSubmissions() <= 7)',
      function: storytimeCallback.toString(),
    }, {
      trigger: 'cb.incidentFinished()',
      function: sendNotification.toString()
    }]
  };
  return experience;
}


function createBumped() {
  let experience = {
    name: 'Bumped',
    participateTemplate: 'bumped',
    resultsTemplate: 'bumpedResults',
    contributionTypes: [],
    description: 'You just virtually bumped into someone!',
    notificationText: 'You just virtually bumped into someone!',
    callbacks: []
  };

  let bumpedCallback = function (sub) {
    let otherSub = Submissions.findOne({
      uid: {$ne: sub.uid},
      iid: sub.iid,
      needName: sub.needName
    });

    notify([sub.uid, otherSub.uid], sub.iid, 'See a photo from who you virtually bumped into!', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
  };

  let relationships = ['lovesDTR', 'lovesGarrett', 'lovesMeg', 'lovesMaxine'];
  let places = [['bar', 'bar'], ['coffee', 'coffee shop'], ['grocery', 'grocery store'], ['restaurant', "restaurant"]];
  _.forEach(relationships, (relationship) => {
    _.forEach(places, (place) => {

      let newVars = JSON.parse(JSON.stringify(DETECTORS[place[0]]['variables']));
      newVars.push('var ' + relationship + ';');

      let detector = {
        '_id': Random.id(),
        'description': DETECTORS[place[0]].description + relationship,
        'variables': newVars,
        'rules': ['(' + DETECTORS[place[0]].rules[0] + ' && ' + relationship + ');']
      };
      DETECTORS[place[0] + relationship] = detector;

      for (let i = 0; i < 10; i++) {
        let need = {
          needName: place[0] + relationship + i,
          situation: {detector: detector._id, number: '2'},
          toPass: {instruction: 'You are at a  ' + place[1] + ' at the same time as '},
          numberNeeded: 2
        };
        let callback = {
          trigger: 'cb.numberOfSubmissions(\'' + place[0] + relationship + i + '\') === 2',
          function: bumpedCallback.toString(),
        };


        experience.contributionTypes.push(need);
        experience.callbacks.push(callback)

      }


    })
  });

  return experience;

}

let sendNotificationScavenger = function (sub) {
  let uids = Submissions.find({iid: sub.iid}).fetch().map(function (x) {
    return x.uid;
  });
  notify(uids, sub.iid, 'Wooh! All the scavenger hunt items were found. Click here to see all of them.', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);

};
let sendNotificationSunset = function (sub) {
  let uids = Submissions.find({iid: sub.iid}).fetch().map(function (x) {
    return x.uid;
  });
  notify(uids, sub.iid, 'Our sunset timelapse is complete! Click here to see it.', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);

};

let update_chapter_map = function (chapter_title, next_chapter_title) {
    chapter_map.chapter_title = next_chapter_title;
};

let chapter_map;

function Setting(name, contexts) {
    this.name = name;
    this.contexts = contexts;
}

function Chapter(title, setting, characters, objects) {
    this.title = title;
    this.setting = setting;
    this.characters = characters;
    this.objects = objects || [];
    this.find_participants_for_character = find_participants_for_character;
}

function Character(name, owner_chapters, owned_objects, actions, contexts, first_chapter_appearance) {
    this.name = name;
    this.owner_chapters = owner_chapters;
    this.owned_objects = owned_objects || [];
    this.actions = actions || {};   // map of arrays based on chapter
    this.contexts = contexts || {}; // map of chapter_title to list of contexts
    this.current_participant = null;
    this.active_chapter = first_chapter_appearance;
}


function Action(description, change_character_and_object, priority) {
    this.description = description;
    this.change_character_and_object = change_character_and_object;
    this.priority = priority;
}

function Object(name, owner, first_chapter_appearance) {
    this.name = name;
    this.owner = owner || null;
    this.active_chapter = first_chapter_appearance;
}

let find_participants_for_chapter = function (setting) {
    // query database
};

let find_participants_for_character = function (character, chapter) {
    var setting = new Setting(character.context[chapter]);
    // query database
};

let update_chapter_context = function (chapters) {
    // add chapter-specific context
    for (var i = 0; i < chapters.length; i++) {
        chapter = chapters[i];
        for (var j = 0; j < chapter.characters.length; j++) {
            chapter.characters[j].contexts[chapter.title] += chapter.setting.contexts;
        }
    }
}

let update_character_context = function (character, chapter, contexts) {
    var chapter_title = chapter.title;
    // add character-specific context for this chapter
    character.contexts[chapter_title] += " && " + contexts;
};

let add_action_to_character = function (character, chapter, action) {
    character.actions[chapter.title].push(action);
};

function writeNarrative() {
    // create setting
    var Common_Room = new Setting("Common ROOM", "restaurant" /* "Common Room", "inside_a_building || in_a_school_building" */);
    var Bedroom = new Setting("bedroom", "restaurant" /* "Bedroom", "inside_a_building || in_a_dorm" */);

    // create character
    var bottle = new Object("bottle", "hermione", "1");
    var health = new Object("health", "ron", "2B");
    // name, chapters, objects, actions, contexts, first appearance
    var harry = new Character("harry", ["1", "2A"], [],
        {"1" : [], "2A" : [], "2B" : []}, {"1" : "", "2A" : "", "2B" : ""}, "1");
    var ron = new Character("ron", ["2B"], [],
        {"1" : [], "2A" : [], "2B" : []}, {"1" : "", "2A" : "", "2B" : ""}, "2B");
    var hermione = new Character("hermione", ["1", "2B"], [],
        {"1" : [], "2A" : [], "2B" : []}, {"1" : "", "2A" : "", "2B" : ""}, "1");

    // create chapter
    var chapter_one = new Chapter("1", Common_Room, [harry, hermione], [bottle]);
    var chapter_twoA = new Chapter("2A", Bedroom, [harry], []);
    var chapter_twoB = new Chapter("2B", Common_Room, [harry, ron, hermione], []);

    // update context
    update_chapter_context([chapter_one, chapter_twoA, chapter_twoB]);
    /*
    update_character_context(harry, chapter_one, "sitting_by_table");
    update_character_context(harry, chapter_twoA, "sitting_by_bed");
    update_character_context(hermione, chapter_one, "has_a_bottle");
    update_character_context(ron, chapter_twoB, "sitting_by_table");
    */

    // update action
    let a1_give_harry_bottle = function () {
        bottle.owner = "harry";
        harry.owned_objects.push(bottle);
    };

    let a1_take_potion_to_bed = function () {
        update_chapter_map("1", "2");
    };

    let a1_leave_potion_on_table = function () {
        bottle.owner = null;
        harry.owned_objects.remove(bottle);
        update_chapter_map("1", "2B");
    };

    let a2_leave_bedroom = function () {
        bottle.owner = null;
        harry.owned_objects.remove(bottle);
    };

    let a2B_drink_potion_bottle = function () {
        health.owner = null;
        ron.owned_objects.remove(health);
    };

    let a2B_rush_ron_outside = function () {
        hermione.active_chapter = "3B";
        ron.active_chapter = "3B";
    };

    let a2B_take_potion_to_class = function () {
        bottle.owner = "harry";
        harry.owned_objects.push(bottle);
    };

    add_action_to_character(harry, chapter_one, new Action("Take potion bottle with him to bed", a1_take_potion_to_bed, 1));
    add_action_to_character(harry, chapter_one, new Action("Leave potion bottle on table", a1_leave_potion_on_table, 1));
    add_action_to_character(harry, chapter_twoA, new Action("Leave the bedroom", a2_leave_bedroom, 0));
    add_action_to_character(harry, chapter_twoB, new Action("Takes potion bottle with him to class", a2B_take_potion_to_class, 2));

    add_action_to_character(ron, chapter_twoB, new Action("Drinks out of potion bottle", a2B_drink_potion_bottle, 0));

    add_action_to_character(hermione, chapter_one, new Action("Give Harry a potion bottle", a1_give_harry_bottle, 0));
    add_action_to_character(hermione, chapter_twoB, new Action("Rush Ron outside", a2B_rush_ron_outside, 1));

    return chapter_one;
}

function convertChapterToExperience(chapter) {
  // total list of actions that will be completed in the chapter

  console.log("DEBUG [creating chapter actions]");
  let chapterActions = [];

  for (let character of chapter.characters) {
   for (let action of character.actions[chapter.title]) {
         chapterActions.push(new Action(action.description, Random.id(), action.priority));
         console.log("DEBUG action description = " + action.description);
         console.log("DEBUG action priority = " + action.priority);
     }
  }
  // find the first action
  let first_action = chapterActions[0];
  let max_priority_allowed = 0;
  console.log("DEBUG first_action created = " + first_action.description);

  for (let action of chapterActions) {
   if (action.priority < first_action.priority) {
     first_action = action;
   }
   if (action.priority > max_priority_allowed) {
     max_priority_allowed = action.priority;
   }
  }
  console.log("DEBUG first_action updated = " + first_action.description);
  console.log("DEBUG max_priority_allowed = " + max_priority_allowed);

  //need a way to keep number of already completed actions
  let number_of_actions_done = 0;

  chapterActions = chapterActions.filter(function(x) {
      return x.priority == number_of_actions_done;
  });

  console.log("DEBUG chapterAction size updated = " + chapterActions.length);

  console.log("DEBUG [creating send notification]");
  let sendNotification = function(sub) {
      let uids = Submissions.find({ iid: sub.iid }).fetch().map(function(x) {
          return x.uid;
      });
      notify(
          uids,
          sub.iid,
          "Chapter 1 is complete. Find out what happened here!",
          "",
          "/apicustomresults/" + sub.iid + "/" + sub.eid
      );
  };

  console.log("DEBUG [creating callback]");
  let hpStoryCallback = function(sub) {
      console.log("DEBUG in callback");
      var newSet = "profile.staticAffordances.participatedInPotterNarrative" + chapter.title;
      Meteor.users.update(
          {_id: sub.uid},
          {$set: {newSet : true}}
          );
      // an action has now been performed
      number_of_actions_done += 1;
      //not sure if this is still needed
      let affordance = sub.content.affordance;
      // takes the list of actions within the chapter
      let options = chapterActions;
      // filters out all the actions that cannot be done at the moment
      options = options.filter(function(x) {
          return x[2] == number_of_actions_done;
      });
      // which action in the chapter is being completed
      let needName = "Action" + Random.id(3);
      if (cb.numberOfSubmissions() === 2) {
          needName = "pageFinal";
      }
      //finding the character of the action
      let next_action = options[0];
      let next_character;
      for (let character of chapter.characters) {
        for (let action of character.actions[chapter.title]) {
          if (action.description == next_action.description) {
            next_character = character;
          }
        }
      }
      let contribution = {
          needName: needName,
          situation: { detector: affordance, number: "1" },
          toPass: {
              characterName: next_character.name,
              instruction:  sub.needName,
              dropdownChoices: {
                  name: "affordance",
                  options: [chapterActions[0], DETECTORS.restaurant._id]
              }
          },
          numberNeeded: 1
      };
      addContribution(sub.iid, contribution);
  };

  console.log("DEBUG [creating character contexts]");
  var character_contexts = [];

  for (let character of chapter.characters) {
      let character_context = [character.contexts[chapter.title], character.name];
      console.log("DEBUG character context = " + character_context[0]);
      console.log("DEBUG character name = " + character_context[1]);
      character_contexts.push(character_context);
  }
  console.log("DEBUG character contexts size = " + character_contexts.length);

  console.log("DEBUG [creating experience]");
  let experience = {
      name: "Harry Potter story chapter " + chapter.title,
      participateTemplate: "Harry_Potter_Story",
      resultsTemplate: "Harry_Potter_Story_Result",
      contributionTypes: [],
      description: "You are invited to participate in Harry Potter story",
      notificationText: "You are invited to participate in Harry Potter story",
      callbacks: [
        {
            //trigger: "cb.newSubmission() && (cb.numberOfSubmissions() <= " + max_priority_allowed + ")",
            trigger: "cb.newSubmission()",
            function: hpStoryCallback.toString()
        },
        {
            trigger: "cb.incidentFinished()",
            function: sendNotification.toString() //start the next chapter
        }
      ]
  };
  console.log("DEBUG experience name = " + experience.name);
  console.log("DEBUG experience resultsTemplate = " + experience.resultsTemplate);
  console.log("DEBUG experience contributionTypes size = " + experience.contributionTypes.length);
  console.log("DEBUG experience description = " + experience.description);
  console.log("DEBUG experience notificationText = " + experience.notificationText);
  console.log("DEBUG experience callbacks size = " + experience.callbacks.length);

  // set up detectors
  console.log("DEBUG [creating detectors]");
  let detectorIds = [
      "oFCWkpZ3MSdXXyKbu",
      "oFCWkpZ3MSdXXyKbb"
  ];
  let i = 0;
  _.forEach(character_contexts, character_context => {
      let newVars = JSON.parse(
          JSON.stringify(DETECTORS[character_context[0]]["variables"])
      );
      newVars.push("var participatedInPotterNarrative" + chapter.title + ";");

      let detector = {
          '_id': detectorIds[i],
          'description': DETECTORS[character_context[0]].description + "_PotterNarrative_" + chapter.title,
          'variables': newVars,
          'rules': [
              "(" + DETECTORS[character_context[0]].rules[0] +
              " ) && participatedInPotterNarrative" + chapter.title + ";"]
      };
      console.log("DEBUG detector [" + i + "]");
      console.log("DEBUG id = " + detector._id);
      console.log("DEBUG description = " + detector.description);
      console.log("DEBUG variables = " + detector.variables);
      console.log("DEBUG rules = " + detector.rules[0]);

      // DETECTORS[character_context[0]] = detector;
      Detectors.insert(detector, (err, docs) => {
        if (err) {
          console.log("ERROR");
          console.log("error = " + err);
        } else {
          console.log("Detector added -");
          console.log("docs = " + docs);
        }
      });

      let first_character;
      for (let character of chapter.characters) {
          for (let action of character.actions[chapter.title]) {
              if (action.description == first_action.description) {
                  first_character = character;
              }
          }
      }

      if (i == 0) {
        // insert first need
        let need = {
          needName: first_action.description, //should be the title of the action
          situation: {detector: DETECTORS[character_context[0]]._id, number: "1"},
          toPass: {
              characterName: first_character.name,
              instruction: "Please choose from the following list of actions",
              firstSentence: chapter.title,
              dropdownChoices: {
                  name: "affordance",
                  options:  [[first_action.description, DETECTORS.restaurant._id]]
              }
          },
          numberNeeded: 1
        };
        experience.contributionTypes.push(need);
      }
      i++;
  });
  // Experiences.insert(["HPStory": exp]);
  //let incident = createIncidentFromExperience(exp);
  //startRunningIncident(incident);
  return experience;
}

let chapterOne = writeNarrative();

let EXPERIENCES = {
  'hpstory': convertChapterToExperience(chapterOne),
  //'bumped': createBumped(),
  // 'sunset': {
  //   _id: Random.id(),
  //   name: 'Sunset',
  //   participateTemplate: 'uploadPhoto',
  //   resultsTemplate: 'sunset',
  //   contributionTypes: [{
  //     needName: 'sunset', situation: {detector: DETECTORS.sunset._id, number: '1'},
  //     toPass: {instruction: 'Take a photo of the sunset!'}, numberNeeded: 20
  //   }],
  //   description: 'Create a timelapse of the sunset with others around the country',
  //   notificationText: 'Take a photo of the sunset!',
  //   callbacks: [{
  //     trigger: 'cb.incidentFinished()',
  //     function: sendNotificationSunset.toString()
  //   }]
  // },
  // 'scavengerHunt': {
  //   _id: Random.id(),
  //   name: 'St. Patrick\'s Day Scavenger Hunt',
  //   participateTemplate: 'scavengerHuntParticipate',
  //   resultsTemplate: 'scavengerHunt',
  //   contributionTypes: [{
  //     needName: 'beer', situation: {detector: DETECTORS.beer._id, number: '1'},
  //     toPass: {instruction: 'Can you take a photo of beer?'}, numberNeeded: 1
  //   }, {
  //     needName: 'greenProduce', situation: {detector: DETECTORS.produce._id, number: '1'},
  //     toPass: {instruction: 'Can you take a photo of green vegetables? #leprechaunfood'}, numberNeeded: 1
  //   }, {
  //     needName: 'coins', situation: {detector: DETECTORS.drugstore._id, number: '1'},
  //     toPass: {instruction: 'Can you take a photo of chocolate gold coins on display?'}, numberNeeded: 1
  //   }, {
  //     needName: 'leprechaun', situation: {detector: DETECTORS.costume_store._id, number: '1'},
  //     toPass: {instruction: 'Can you take a photo of a Leprechaun costume?'}, numberNeeded: 1
  //   }, {
  //     needName: 'irishSign', situation: {detector: DETECTORS.irish._id, number: '1'},
  //     toPass: {instruction: 'Can you take a photo of an Irish sign?'}, numberNeeded: 1
  //   }, {
  //     needName: 'trimmings', situation: {detector: DETECTORS.hair_salon._id, number: '1'},
  //     toPass: {instruction: 'Can you take a photo of some Leprechaun beard trimmings?'}, numberNeeded: 1
  //   }, {
  //     needName: 'liquidGold',
  //     situation: {detector: DETECTORS.gas_station._id, number: '1'},
  //     toPass: {instruction: 'Can you take a photo of liquid gold that Leprechauns use to power their vehicles?'},
  //     numberNeeded: 1
  //   }, {
  //     needName: 'potOfGold',
  //     situation: {detector: DETECTORS.bank._id, number: '1'},
  //     toPass: {instruction: 'Can you take a photo of a bank where Leprechauns hide their pots of gold?'},
  //     numberNeeded: 1
  //   }, {
  //     needName: 'rainbow', situation: {detector: DETECTORS.rainbow._id, number: '1'},
  //     toPass: {instruction: 'Can you take a photo of a rainbow flag?'}, numberNeeded: 1
  //   }
  //   ],
  //   description: 'Find an item for a scavenger hunt',
  //   notificationText: 'Help us complete a St. Patrick\'s day scavenger hunt',
  //   callbacks: [{
  //     trigger: 'cb.incidentFinished()',
  //     function: sendNotificationScavenger.toString()
  //   }]
  // },
  // 'natureHunt': {
  //   _id: Random.id(),
  //   name: 'Nature Scavenger Hunt',
  //   participateTemplate: 'scavengerHuntParticipate',
  //   resultsTemplate: 'scavengerHunt',
  //   contributionTypes: [{
  //     needName: 'tree', situation: {detector: DETECTORS.forest._id, number: '1'},
  //     toPass: {instruction: 'Can you take a photo of a tree?'}, numberNeeded: 1
  //   }, {
  //     needName: 'leaf', situation: {detector: DETECTORS.forest._id, number: '1'},
  //     toPass: {instruction: 'Can you take a photo of a leaf?'}, numberNeeded: 1
  //   }, {
  //     needName: 'grass', situation: {detector: DETECTORS.field._id, number: '1'},
  //     toPass: {instruction: 'Can you take a photo of the grass?'}, numberNeeded: 1
  //   }, {
  //     needName: 'lake', situation: {detector: DETECTORS.lake._id, number: '1'},
  //     toPass: {instruction: 'Can you take a photo of the lake?'}, numberNeeded: 1
  //   }, {
  //     needName: 'moon', situation: {detector: DETECTORS.night._id, number: '1'},
  //     toPass: {instruction: 'Can you take a photo of the moon?'}, numberNeeded: 1
  //   }, {
  //     needName: 'sun', situation: {detector: DETECTORS.sunny._id, number: '1'},
  //     toPass: {instruction: 'Can you take a photo of the sun?'}, numberNeeded: 1
  //   }, {
  //     needName: 'blueSky', situation: {detector: DETECTORS.sunny._id, number: '1'},
  //     toPass: {instruction: 'Can you take a photo of the blue sky?'}, numberNeeded: 1
  //   }, {
  //     needName: 'clouds', situation: {detector: DETECTORS.cloudy._id, number: '1'},
  //     toPass: {instruction: 'Can you take a photo of the clouds?'}, numberNeeded: 1
  //   }, {
  //     needName: 'puddle', situation: {detector: DETECTORS.rainy._id, number: '1'},
  //     toPass: {instruction: 'Can you take a photo of the puddle?'}, numberNeeded: 1
  //   },
  //   ],
  //   description: 'Find an item for a scavenger hunt',
  //   notificationText: 'Help us out with our nature scavenger hunt',
  //   callbacks: [{
  //     trigger: 'cb.incidentFinished()',
  //     function: sendNotificationScavenger.toString()
  //   }]
  // },
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
