export let DETECTORS = {
  field: {
    _id: 'XeepEbMjjW8yPzSAo',
    description: 'fields',
    variables: ['var stadiumsarenas;',
      'var baseballfields;',
      'var parks;',
      'var playgrounds;'
    ],
    rules: ['stadiumsarenas || ((parks || playgrounds) || baseballfields);']
  },
  niceish_day: {
    _id: 'x7EgLErQx3qmiemqt',
    description: 'niceish_day',
    variables: ['var clouds;', 'var clear;', 'var daytime;'],
    rules: ['daytime && (clouds || clear);']
  },
  night: {
    _id: 'Wth3TB9Lcf6me6vgy',
    description: 'places where it\'s nighttime,',
    variables: ['var nighttime;'],
    rules: ['(nighttime);']
  },
  sunset: {
    _id: '44EXNzHS7oD2rbF68',
    description: 'places where it\'s sunset,',
    variables: ['var sunset;'],
    rules: ['(sunset);']
  },
  daytime: {
    _id: 'tyZMZvPKkkSPR4FpG',
    description: 'places where it\'s daytime,',
    variables: ['var daytime;'],
    rules: ['daytime;']
  },
  anytime: {
    _id: Random.id(),
    description: 'all times for testing',
    variables: [
      'var daytime;',
      'var nighttime;',
      'var sunset;'
    ],
    rules: [('daytime || nighttime || sunset')]
  },
  anytime_triad1: {
    _id: Random.id(),
    description: 'all times for testing triad1',
    variables: [
      'var daytime;',
      'var nighttime;',
      'var sunset;',
      'var triad1'
    ],
    rules: [('triad1 && (daytime || nighttime || sunset)')]
  },
  anytime_triad2: {
    _id: Random.id(),
    description: 'all times for testing triad 2',
    variables: [
      'var daytime;',
      'var nighttime;',
      'var sunset;',
      'var triad2'
    ],
    rules: [('triad2 && (daytime || nighttime || sunset)')]
  },
  library: {
    _id: '5LqfPRajiQRe9BwBT',
    description: 'libraries and other books',
    variables: [
      'var libraries;',
      'var usedbooks;',
      'var bookstores;'
    ],
    rules: ['(libraries || bookstores);']
  },
  gym: {
    _id: '3XqHN8A4EpCZRpegS',
    description: ' gym',
    variables: ['var  gyms;'],
    rules: [' gyms;']
  },
  produce: {
    _id: 'xDtnmQW3PBMuqq9pW',
    description: 'places to find fruits and veggies',
    variables: ['var communitygardens;',
      'var intlgrocery;',
      'var ethicgrocery;',
      'var markets;',
      'var grocery;',
      'var farmersmarket;',
      'var organic_stores;'
    ],
    rules: ['communitygardens || ((intlgrocery || ethicgrocery) || ((markets || grocery) || (farmersmarket || organic_stores)));']
  },
  rainbow: {
    _id: 'ksxGTXMaSpCFdmqqN',
    description: 'rainbow flag',
    variables: ['var gaybars;'],
    rules: ['gaybars;']
  },
  drugstore: {
    _id: 'k8KFfv3ATtbg2tnFB',
    description: 'drugstores',
    variables: ['var drugstores;', 'var pharmacy;'],
    rules: ['(drugstores || pharmacy);']
  },
  costume_store: {
    _id: 'ECPk2mjuHJtrMotGg',
    description: 'costume_store',
    variables: ['var costumes;', 'var partysupplies;'],
    rules: ['(partysupplies || costumes);']
  },
  irish: {
    _id: '5CJGGtjqyY89n55XP',
    description: 'irish',
    variables: ['var irish_pubs;', 'var irish;'],
    rules: ['(irish_pubs || irish);']
  },
  hair_salon: {
    _id: 'S8oZZwAWpFo5qGq87',
    description: 'hairsalon',
    variables: ['var menshair;',
      'var hairstylists;',
      'var hair_extensions;',
      'var blowoutservices;',
      'var hair;',
      'var barbers;'
    ],
    rules: ['menshair || ((hairstylists || hair_extensions) || ((hair || barbers) || blowoutservices));']
  },
  gas_station: {
    _id: 'CctuBr3GtSXPkzNDQ',
    description: 'gas station',
    variables: ['var servicestations;'],
    rules: ['servicestations;']
  },
  coffee: {
    _id: 'saxQsfSaBiHHoSEYK',
    description: 'coffee',
    variables: ['var coffeeroasteries;',
      'var coffee;',
      'var cafes;',
      'var coffeeshops;',
      'var coffeeteasupplies;'
    ],
    rules: ['(coffeeroasteries || coffee) || ((coffeeshops || coffeeteasupplies) || cafes);']
  },
  bank: {
    _id: 'qR9s4EtPngjZeEp9u',
    description: 'banks',
    variables: ['var banks;'],
    rules: ['banks;']
  },
  beer: {
    _id: 'zrban5i9M6adgwMaK',
    description: 'beer',
    variables: ['var beergardens;',
      'var beertours;',
      'var sportsbars;',
      'var bars;',
      'var irish_pubs;',
      'var breweries;',
      'var divebars;',
      'var beerbar;',
      'var beergarden;',
      'var pubs;',
      'var beer_and_wine;'
    ],
    rules: ['(beergardens || beertours) || ((sportsbars || bars) || ((irish_pubs || breweries) || ((divebars || beerbar) || ((pubs || beer_and_wine) || beergarden))));']
  },
  train: {
    _id: '2wH5bFr77ceho5BgF',
    description: 'trains',
    variables: ['var publictransport;', 'var trainstations;', 'var trains;'],
    rules: ['(trainstations || trains) || publictransport;']
  },
  forest: {
    _id: 'dhQf4PLNAGLy8QDJe',
    description: 'forests',
    variables: ['var campgrounds;',
      'var parks;',
      'var zoos;',
      'var hiking;',
      'var gardens;'
    ],
    rules: ['(campgrounds || parks) || ((hiking || gardens) || zoos);']
  },
  dinning_hall: {
    _id: 'sSK7rbbC9sHQBN94Y',
    description: 'dinninghalls',
    variables: ['var diners;',
      'var restaurants;',
      'var cafeteria;',
      'var food_court;'
    ],
    rules: ['(diners || restaurants || cafeteria || food_court);']
  },
  castle: {
    _id: 'gDcxZQ49QrwxzY7Ye',
    description: 'castles',
    variables: ['var mini_golf;',
      'var buddhist_temples;',
      'var religiousschools;',
      'var synagogues;',
      'var hindu_temples;',
      'var weddingchappels;',
      'var churches;',
      'var mosques;'
    ],
    rules: ['((mini_golf || ((buddhist_temples || religiousschools) || ((synagogues || hindu_temples) || (weddingchappels || churches)))) || mosques);']
  },
  bar: {
    _id: '6urWtr6Tasohdb43u',
    description: 'bars',
    variables: ['var beergardens;',
      'var beertours;',
      'var champagne_bars;',
      'var cocktailbars;',
      'var sportsbars;',
      'var bars;',
      'var barcrawl;',
      'var pianobars;',
      'var brasseries;',
      'var irish_pubs;',
      'var tikibars;',
      'var nightlife;',
      'var breweries;',
      'var divebars;',
      'var poolhalls;',
      'var island_pub;',
      'var beerbar;',
      'var speakeasies;',
      'var irish;',
      'var pubs;',
      'var beer_and_wine;',
      'var distilleries;',
      'var beergarden;',
      'var clubcrawl;',
      'var gaybars;',
      'var whiskeybars;'
    ],
    rules: ['((champagne_bars || cocktailbars) || ((barcrawl || pianobars) || ((tikibars || nightlife) || ((poolhalls || island_pub) || ((speakeasies || irish) || ((clubcrawl || pubs) || (gaybars || whiskeybars))))))) || ((beergardens || beertours) || ((sportsbars || bars) || ((brasseries || irish_pubs) || ((breweries || divebars) || ((poolhalls || beerbar) || ((pubs || beer_and_wine) || (distilleries || beergarden)))))));']
  },
  beverage: {
    _id: Random.id(),
    description: `beverage`,
    variables: [
      'var coffeeroasteries;',
      'var coffee;',
      'var cafes;',
      'var coffeeshops;',
      'var coffeeteasupplies;',
      'var diners;',
      'var restaurants;',
      'var cafeteria;',
      'var food_court;',
      'var bars;',
    ],
    rules: ['(coffeeroasteries || coffee || coffeeshops || coffeeteasupplies || cafes || diners || restaurants || cafeteria || food_court || bars);']
  },
  grocery: {
    _id: 'N5H9w632dbyhqHEsi',
    description: 'grocery shopping',
    variables: ['var intlgrocery;',
      'var ethicgrocery;',
      'var markets;',
      'var wholesalers;',
      'var pharmacy;',
      'var grocery;',
      'var farmersmarket;',
      'var convenience;',
      'var importedfood;',
      'var herbsandspices;',
      'var drugstores;',
      'var seafoodmarkets;',
      'var marketstalls;',
      'var organic_stores;',
      'var publicmarkets;'
    ],
    rules: ['(intlgrocery || ethicgrocery) || ((markets || wholesalers) || ((pharmacy || grocery) || ((farmersmarket || convenience) || ((importedfood || herbsandspices) || ((drugstores || seafoodmarkets) || ((organic_stores || publicmarkets) || marketstalls))))));']
  },
  lake: {
    _id: '9iEpW4mb4ysHY5thP',
    description: 'lake',
    variables: ['var lakes;'],
    rules: ['(lakes);']
  },
  rainy: {
    _id: 'puLHKiGkLCJWpKc62',
    description: 'rainy',
    variables: ['var rain;'],
    rules: ['(rain);']
  },
  sunny: {
    _id: '6vyrBtdDAyRArMasj',
    description: 'clear',
    variables: ['var clear;', 'var daytime;'],
    rules: ['(clear && daytime);']
  },
  cloudy: {
    _id: 'sorCvK53fyi5orAmj',
    description: 'clouds',
    variables: ['var clouds;', 'var daytime;'],
    rules: ['(clouds && daytime);']
  },
  restaurant: {
    _id: 'tR4e2c7PPjWACwX87',
    description: 'eating restaurant',
    variables: ['var italian;',
      'var generic_restaurant;',
      'var lunch_places;',
      'var asian_places;',
      'var pastashops;',
      'var pizza;',
      'var spanish;',
      'var newcanadian;',
      'var scottish;',
      'var greek;',
      'var taiwanese;',
      'var hkcafe;',
      'var sandwiches;',
      'var delis;',
      'var dimsum;',
      'var shanghainese;',
      'var dominican;',
      'var burmese;',
      'var indonesian;',
      'var restaurants;',
      'var uzbek;',
      'var cambodian;',
      'var vegan;',
      'var indpak;',
      'var food_court;',
      'var delicatessen;',
      'var cheesesteaks;',
      'var himalayan;',
      'var thai;',
      'var buffets;',
      'var cantonese;',
      'var catering;',
      'var tuscan;',
      'var hotdog;',
      'var salad;',
      'var hungarian;',
      'var persian;',
      'var hotel_bar;',
      'var mediterranean;',
      'var asianfusion;',
      'var malaysian;',
      'var kosher;',
      'var modern_european;',
      'var gluten_free;',
      'var singaporean;',
      'var chinese;',
      'var szechuan;',
      'var panasian;',
      'var steak;',
      'var seafood;',
      'var pakistani;',
      'var vegetarian;',
      'var tapasmallplates;',
      'var african;',
      'var soup;',
      'var halal;',
      'var basque;',
      'var french;',
      'var bangladeshi;',
      'var wraps;',
      'var japacurry;',
      'var cafes;',
      'var hakka;'
    ],
    rules: ['italian = (pastashops || pizza) || ((sandwiches || delis) || ((italian || restaurants) || ((delicatessen || cheesesteaks) || ((catering || tuscan) || (hotdog || salad)))));',
      'generic_restaurant = (spanish || newcanadian) || ((dimsum || shanghainese) || ((uzbek || cambodian) || ((himalayan || italian) || ((hungarian || persian) || ((kosher || modern_european) || ((steak || seafood) || ((tapasmallplates || african) || ((basque || chinese) || (french || bangladeshi)))))))));',
      'lunch_places = (scottish || greek) || ((dominican || sandwiches) || ((vegan || indpak) || ((thai || delis) || ((hotel_bar || mediterranean) || ((gluten_free || buffets) || ((pakistani || vegetarian) || ((soup || halal) || ((delicatessen || wraps) || ((japacurry || catering) || ((cafes || hakka) || salad))))))))));',
      'asian_places = (taiwanese || hkcafe) || ((burmese || indonesian) || ((dimsum || food_court) || ((buffets || cantonese) || ((asianfusion || malaysian) || ((singaporean || chinese) || (szechuan || panasian))))));',
      '(italian || generic_restaurant) || (asian_places || lunch_places);'
    ]
  },
  exercising: {
    _id: '6eY5Z5vrfHcNrefM6',
    description: 'exercising',
    variables: ['var boxing;',
      'var kickboxing;',
      'var amateursportsteams;',
      'var religiousschools;',
      'var muaythai;',
      'var gyms;',
      'var physicaltherapy;',
      'var fencing;',
      'var tennis;',
      'var healthtrainers;',
      'var poledancingclasses;',
      'var badminton;',
      'var beachvolleyball;',
      'var football;',
      'var bootcamps;',
      'var pilates;',
      'var dancestudio;',
      'var brazilianjiujitsu;',
      'var trampoline;',
      'var cyclingclasses;',
      'var cardioclasses;',
      'var barreclasses;',
      'var intervaltraininggyms;',
      'var sports_clubs;',
      'var weightlosscenters;',
      'var active;',
      'var aerialfitness;',
      'var communitycenters;',
      'var yoga;',
      'var squash;',
      'var surfing;',
      'var circuittraininggyms;',
      'var fitness;',
      'var martialarts;'
    ],
    rules: ['(((amateursportsteams || religiousschools) || ((physicaltherapy || fencing) || ((beachvolleyball || football) || tennis))) || ((boxing || kickboxing) || ((muaythai || gyms) || ((badminton || healthtrainers) || ((bootcamps || pilates) || ((trampoline || dancestudio) || ((cyclingclasses || cardioclasses) || ((barreclasses || sports_clubs) || ((active || weightlosscenters) || ((yoga || aerialfitness) || ((surfing || fitness) || (martialarts || circuittraininggyms)))))))))))) || ((boxing || kickboxing) || ((muaythai || gyms) || ((healthtrainers || poledancingclasses) || ((bootcamps || pilates) || ((dancestudio || brazilianjiujitsu) || ((cyclingclasses || cardioclasses) || ((barreclasses || intervaltraininggyms) || ((sports_clubs || weightlosscenters) || ((aerialfitness || communitycenters) || ((squash || surfing) || ((fitness || martialarts) || circuittraininggyms)))))))))));']
  },
  eating_japanese: {
    _id: "vpP7boQqvLzxhDxjg",
    description: "eating a japanese meal",
    variables: [
      "var sushi;",
      "var japanese;",
      "var tonkatsu;",
      "var teppanyaki;",
      "var tempura;",
      "var ramen;",
      "var izakaya;",
      "var udon;"
    ],
    rules: ["(sushi || japanese) || ((tonkatsu || teppanyaki) || ((tempura || ramen) || (izakaya || udon)));"]
  },
  eating_with_chopsticks: {
    _id: "5Ay2Ys9DAH2PcPS4a",
    description: "eating with chopsticks",
    variables: [
      "var korean;",
      "var hawaiian;",
      "var japacurry;",
      "var sushi;",
      "var singaporean;",
      "var hakka;",
      "var laotian;",
      "var cambodian;",
      "var japanese;",
      "var tonkatsu;",
      "var chinese;",
      "var taiwanese;",
      "var vietnamese;",
      "var indonesian;",
      "var panasian;",
      "var thai;",
      "var noodles;",
      "var hotpot;",
      "var tcm;",
      "var cantonese;",
      "var asianfusion;",
      "var dimsum;",
      "var shanghainese;",
      "var burmese;",
      "var teppanyaki;",
      "var tempura;",
      "var szechuan;",
      "var hkcafe;",
      "var ramen;",
      "var izakaya;",
      "var malaysian;",
      "var udon;"
    ],
    rules: [
      "(((japacurry || sushi) || ((japanese || tonkatsu) || ((noodles || hotpot) || ((asianfusion || korean) || ((teppanyaki || tempura) || ((ramen || izakaya) || (malaysian || udon))))))) || (korean || hawaiian)) || (((singaporean || hakka) || ((chinese || taiwanese) || ((tcm || cantonese) || ((dimsum || shanghainese) || ((szechuan || hkcafe) || burmese))))) || ((laotian || cambodian) || ((vietnamese || indonesian) || (panasian || thai))));"
    ]
  },
  hour0: {
    _id: "v2ANTJr1I7wle3Ek8",
    description: "during 00:00",
    variables: ["var hour;"],
    rules: ["hour == 0"]
  },
  hour1: {
    _id: "kDIB1oQOnKktS1j4Z",
    description: "during 01:00",
    variables: ["var hour;"],
    rules: ["hour == 1"]
  },
  hour2: {
    _id: "ZId1ezjZGAkfbpcWB",
    description: "during 02:00",
    variables: ["var hour;"],
    rules: ["hour == 2"]
  },
  hour3: {
    _id: "qZRVcySQpf2g6xcfA",
    description: "during 03:00",
    variables: ["var hour;"],
    rules: ["hour == 3"]
  },
  hour4: {
    _id: "3JSnJAmYQzJFgqJpD",
    description: "during 04:00",
    variables: ["var hour;"],
    rules: ["hour == 4"]
  },
  hour5: {
    _id: "iosGAkRVqT0zYlHmA",
    description: "during 05:00",
    variables: ["var hour;"],
    rules: ["hour == 5"]
  },
  hour6: {
    _id: "RxDnq3KRXKQjLHymw",
    description: "during 06:00",
    variables: ["var hour;"],
    rules: ["hour == 6"]
  },
  hour7: {
    _id: "rnQQ9xRK4LyqPNSnN",
    description: "during 07:00",
    variables: ["var hour;"],
    rules: ["hour == 7"]
  },
  hour8: {
    _id: "WRaFXtU7Igw6mjpzd",
    description: "during 08:00",
    variables: ["var hour;"],
    rules: ["hour == 8"]
  },
  hour9: {
    _id: "7IlqQnNFaAoJmDLy6",
    description: "during 09:00",
    variables: ["var hour;"],
    rules: ["hour == 9"]
  },
  hour10: {
    _id: "K5Y0rpCXcxAdPIkBA",
    description: "during 10:00",
    variables: ["var hour;"],
    rules: ["hour == 10"]
  },
  hour11: {
    _id: "a5DzoZ3nb6fKQDaRn",
    description: "during 11:00",
    variables: ["var hour;"],
    rules: ["hour == 11"]
  },
  hour12: {
    _id: "htseIlmY5c7Q9Ihnh",
    description: "during 12:00",
    variables: ["var hour;"],
    rules: ["hour == 12"]
  },
  hour13: {
    _id: "t5CT9YiIQvsZufVq8",
    description: "during 13:00",
    variables: ["var hour;"],
    rules: ["hour == 13"]
  },
  hour14: {
    _id: "zepMCtTEOlELnXOM3",
    description: "during 14:00",
    variables: ["var hour;"],
    rules: ["hour == 14"]
  },
  hour15: {
    _id: "aHwbbglrhLeQqDYK6",
    description: "during 15:00",
    variables: ["var hour;"],
    rules: ["hour == 15"]
  },
  hour16: {
    _id: "tcftEov84sDlZHx1B",
    description: "during 16:00",
    variables: ["var hour;"],
    rules: ["hour == 16"]
  },
  hour17: {
    _id: "53puB2TSVHxsHtbZ2",
    description: "during 17:00",
    variables: ["var hour;"],
    rules: ["hour == 17"]
  },
  hour18: {
    _id: "Jdz8DFUyC37jqROOq",
    description: "during 18:00",
    variables: ["var hour;"],
    rules: ["hour == 18"]
  },
  hour19: {
    _id: "tV0Jt9xgGkME1MBla",
    description: "during 19:00",
    variables: ["var hour;"],
    rules: ["hour == 19"]
  },
  hour20: {
    _id: "LtUoOKZMm0ovNnsmX",
    description: "during 20:00",
    variables: ["var hour;"],
    rules: ["hour == 20"]
  },
  hour21: {
    _id: "X9YChduJTWV9UXVez",
    description: "during 21:00",
    variables: ["var hour;"],
    rules: ["hour == 21"]
  },
  hour22: {
    _id: "NFNWR5VMUse3B8j0B",
    description: "during 22:00",
    variables: ["var hour;"],
    rules: ["hour == 22"]
  },
  hour23: {
    _id: "NvegeW31LiB8Zm77M",
    description: "during 23:00",
    variables: ["var hour;"],
    rules: ["hour == 23"]
  },
  eating_pizza: {
    _id: "D5QSW6S4mNUsxZPq7",
    description: "eating pizza",
    variables: ["var pizza;"],
    rules: ["(pizza);"]
  },
  big_bite_restaurant: {
    _id : "kJQ8sCFbWddhMviMX",
    description : "hand-held meals eaten with big bites",
    variables : [
      "var mexican;",
      "var foodstands;",
      "var cafes;",
      "var delicatessen;",
      "var driveintheater;",
      "var cheesesteaks;",
      "var hotdog;",
      "var salvadoran;",
      "var colombian;",
      "var delis;",
      "var wraps;",
      "var hotdogs;",
      "var burgers;",
      "var tacos;",
      "var tex_mex;",
      "var newmexican;",
      "var foodtrucks;",
      "var bagels;",
      "var comfortfood;",
      "var sandwiches;",
      "var argentine;",
      "var bakeries;",
      "var cuban;"
    ],
    rules : [
      "(((cafes || delicatessen) || ((delis || wraps) || ((bagels || comfortfood) || ((sandwiches || argentine) || (bakeries || cuban))))) || ((driveintheater || cheesesteaks) || ((hotdogs || burgers) || hotdog))) || ((mexican || foodstands) || ((salvadoran || colombian) || ((tacos || tex_mex) || (newmexican || foodtrucks))));"
    ]
  }
};
