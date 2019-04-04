// import { resetDatabase } from 'meteor/xolvio:cleaner';
// import {
//   matchAffordancesWithDetector,
//   matchLocationWithDetector
// }
//   from './methods';
// import { Detectors } from './detectors';
// import { getPlaceKeys, onePlaceNotThesePlacesSets,
//          placeSubsetAffordances, flattenAffordanceDict} from './methods'
// import { CONSTANTS } from "../../Testing/testingconstants";
//
//
// describe('Small Detector Tests', function () {
//   let detectorId = CONSTANTS.DETECTORS.produce._id;
//
//   beforeEach(function () {
//     resetDatabase();
//
//     Detectors.insert(CONSTANTS.DETECTORS.produce);
//   });
//
//   it('should match "grocery" for "places one can buy produce"', function () {
//     let affordances = {
//       'grocery': true
//     };
//
//     if (!matchAffordancesWithDetector(affordances, detectorId)) {
//       chai.assert(false);
//     }
//   });
//
//   it('should not match "coffee" for "places one can buy produce"', function () {
//     let affordances = {
//       'coffee': true
//     };
//
//     if (matchAffordancesWithDetector(affordances, detectorId)) {
//       chai.assert(false);
//     }
//   });
//
//   // it('should match "whole foods in evanston" for "places one can buy produce"', function() {
//   //   //grocery, whole foods in evanston
//   //   let lat = 42.047621;
//   //   let lng = -87.679488;
//   //
//   //   matchLocationWithDetector(lat, lng, detectorId, function(doesUserMatchSituation) {
//   //     if (!doesUserMatchSituation) {
//   //       chai.assert(false);
//   //     }
//   //   });
//   // });
//   //
//   // it('should not match "shakespeare garden on northwestern" for "places one can buy produce"', function() {
//   //   // parks, shakespeare garden on northwestern
//   //   let lat = 42.056838;
//   //   let lng = -87.675940;
//   //
//   //   matchLocationWithDetector(lat, lng, detectorId, function(doesUserMatchSituation) {
//   //     if (doesUserMatchSituation) {
//   //       chai.assert(false);
//   //     }
//   //   });
//   //
//   // });
// });
//
// describe('Detectors in testingcontants.js are valid', function() {
//
//   before(function () {
//     resetDatabase();
//     _.forEach(Object.keys(CONSTANTS.DETECTORS), (key) => {
//       Detectors.insert(CONSTANTS.DETECTORS[key]);
//     });
//   });
//
//   it('should compile when applying the detector', function() {
//
//     // this affordance can be arbitrary
//     let affordances = {'grocery': true};
//
//     let allDetectors = Detectors.find().fetch();
//
//     _.forEach(allDetectors, (detector) => {
//       try {
//         matchAffordancesWithDetector(affordances, detector._id);
//       } catch(err) {
//         console.error(`Detector failed to compile with id (${detector._id}) and description (${detector.description})`)
//         throw(err);
//       }
//     });
//   });
//
// });
//
// describe('Helpers for Nested {Place: {Affordance: true}}', function() {
//
//   let aff0 = {
//     'sunny': true,
//     'trader_joes_evanston': {
//       'grocery': true,
//       'distance': 10.0
//     }
//   };
//
//   let aff1 = {
//     'rainy': true,
//     'ramen_dojo': {
//       'japanese': true,
//       'ramen':true,
//       'distance': 10.0
//     },
//     'kongs_chinese': {
//       'chinese': true,
//       'noodles': true,
//       'distance': 20.0
//
//     },
//     'onsen_spa': {
//       'japanese': true,
//       'spas': true,
//       // purposely no distance info
//     }
//   };
//
//   let aff3 = {
//     'rainy': true
//   };
//
//
//
//   it('getPlaceKeys from query with 3 places', function() {
//     let placeKeys = getPlaceKeys(aff1);
//     console.log(placeKeys);
//     let desired = [ 'ramen_dojo', 'kongs_chinese', 'onsen_spa' ];
//     chai.assert.equal(JSON.stringify(placeKeys), JSON.stringify(desired));
//   });
//
//   it('getPlaceKeys from query with 1 places', function() {
//     let placeKeys = getPlaceKeys(aff0);
//     console.log(placeKeys);
//     let desired = [ 'trader_joes_evanston'];
//     chai.assert.equal(JSON.stringify(placeKeys), JSON.stringify(desired));
//   });
//
//   it('getPlaceKeys from query with 0 places', function() {
//     let placeKeys = getPlaceKeys(aff3);
//     console.log(placeKeys);
//     let desired = [];
//     chai.assert.equal(JSON.stringify(placeKeys), JSON.stringify(desired));
//   });
//
//   it('onePlaceNotThesePlaces from query with 3 places', function() {
//     let placeKeys = [ 'ramen_dojo', 'kongs_chinese', 'onsen_spa' ];
//     let sets = onePlaceNotThesePlacesSets(placeKeys);
//     console.log(sets);
//     let desired = [ [ 'ramen_dojo', [ 'kongs_chinese', 'onsen_spa' ] ],
//                     [ 'kongs_chinese', [ 'ramen_dojo', 'onsen_spa' ] ],
//                     [ 'onsen_spa', [ 'ramen_dojo', 'kongs_chinese' ] ],
//                     [ '', [ 'ramen_dojo', 'kongs_chinese', 'onsen_spa' ]]];
//
//     chai.assert.equal(JSON.stringify(sets), JSON.stringify(desired));
//   });
//
//   it('onePlaceNotThesePlaces excluding 2 places (1 current place)', function() {
//     let placeKeys = [ 'trader_joes_evanston'];
//     let sets = onePlaceNotThesePlacesSets(placeKeys);
//     console.log(sets);
//     let desired = [ [ 'trader_joes_evanston', [ ]  ],
//                     [ '', ['trader_joes_evanston'] ] ];
//     chai.assert.equal(JSON.stringify(sets), JSON.stringify(desired));
//   });
//
//   it('subset affordances from query with 3 places', function() {
//     let placeKeys = [ 'ramen_dojo', 'kongs_chinese', 'onsen_spa' ];
//
//     let thisPlace = placeKeys[0];
//     let notThesePlaces = placeKeys.slice(1, placeKeys.length);
//     console.log('notThesePlaces: ' + notThesePlaces);
//
//     let [thisPlaceSubsetAffordances, thisPlaceDist] = placeSubsetAffordances(aff1, notThesePlaces);
//     console.log(thisPlaceSubsetAffordances);
//
//     let ramen_subset = {
//       'rainy': true,
//       'japanese': true, // from ramen_dojo
//       'ramen':true, // from ramen_dojo
//     };
//     chai.assert.equal(JSON.stringify(thisPlaceSubsetAffordances), JSON.stringify(ramen_subset));
//
//     console.log(thisPlaceDist);
//     let ramen_dist = {
//       'distance': 10.0
//     };
//     chai.assert.equal(JSON.stringify(thisPlaceDist), JSON.stringify(ramen_dist));
//   });
//
//   it('subset affordances from query excluding 0 places (1 current place) ', function() {
//     let placeKeys = [ 'trader_joes_evanston' ];
//
//     let thisPlace = placeKeys[0];
//     let notThesePlaces = placeKeys.slice(1, placeKeys.length);
//     console.log('notThesePlaces: ' + notThesePlaces);
//
//     let [thisPlaceSubsetAffordances, thisPlaceDist] = placeSubsetAffordances(aff0, notThesePlaces);
//     console.log(thisPlaceSubsetAffordances);
//     let grocery_subset = {
//       'sunny': true,
//       'grocery': true, // from tjs
//     };
//     chai.assert.equal(JSON.stringify(thisPlaceSubsetAffordances), JSON.stringify(grocery_subset));
//     console.log(thisPlaceDist);
//     let grocery_dist = {
//       'distance': 10.0
//     };
//     chai.assert.equal(JSON.stringify(thisPlaceDist), JSON.stringify(grocery_dist));
//
//   });
//
//   it('checking that placeSubsetAffordances returns an undefined distance, if no distance', function() {
//     let placeKeys = [ 'ramen_dojo', 'kongs_chinese', 'onsen_spa' ];
//
//     let thisPlace = placeKeys[2]; // onsen spa has no distance info
//     let notThesePlaces = placeKeys.slice(0, 2);
//     console.log('notThesePlaces: ' + notThesePlaces);
//
//     let [thisPlaceSubsetAffordances, thisPlaceDist] = placeSubsetAffordances(aff1, notThesePlaces);
//     console.log(thisPlaceSubsetAffordances);
//
//     let spa_subset = {
//       'rainy': true,
//       'japanese': true, // from onsen_spa
//       'spas':true, // from onsen_spa
//     };
//     chai.assert.equal(JSON.stringify(thisPlaceSubsetAffordances), JSON.stringify(spa_subset));
//
//     console.log(thisPlaceDist);
//     let undefined_dist = {
//       'distance': undefined
//     };
//     chai.assert.equal(JSON.stringify(thisPlaceDist), JSON.stringify(undefined_dist));
//
//   });
//
//   it('flattened affordances should look like it did previously without nesting', function() {
//     let flatDict = flattenAffordanceDict(aff0);
//     chai.assert.equal(JSON.stringify(flatDict), JSON.stringify({'sunny': true, 'grocery': true}))
//   });
//
// });
