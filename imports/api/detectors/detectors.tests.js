import { resetDatabase } from 'meteor/xolvio:cleaner';
import {
  matchAffordancesWithDetector,
  matchLocationWithDetector
}
  from './methods';
import { Detectors } from './detectors';
import { CONSTANTS } from "../testing/testingconstants";


describe('Detector Tests', function () {
  let detectorId = CONSTANTS.detectors.fruit._id;

  beforeEach(function () {
    resetDatabase();

    Detectors.insert(CONSTANTS.detectors.fruit);
  });

  it('should match "grocery" for "places one can buy fruit"', function () {
    //console.log("detectorId", CONSTANTS.detectors.fruit._id)

    let affordances = {
      'grocery': true
    };

    if (!matchAffordancesWithDetector(affordances, detectorId)) {
      chai.assert(false);
    }
  });

  it('should not match "coffee" for "places one can buy fruit"', function () {
    let affordances = {
      'coffee': true
    };

    if (matchAffordancesWithDetector(affordances, detectorId)) {
      chai.assert(false);
    }
  });

  // it('should match "whole foods in evanston" for "places one can buy fruit"', function() {
  //   //grocery, whole foods in evanston
  //   let lat = 42.047621;
  //   let lng = -87.679488;
  //
  //   matchLocationWithDetector(lat, lng, detectorId, function(doesUserMatchSituation) {
  //     if (!doesUserMatchSituation) {
  //       chai.assert(false);
  //     }
  //   });
  // });
  //
  // it('should not match "shakespeare garden on northwestern" for "places one can buy fruit"', function() {
  //   // parks, shakespeare garden on northwestern
  //   let lat = 42.056838;
  //   let lng = -87.675940;
  //
  //   matchLocationWithDetector(lat, lng, detectorId, function(doesUserMatchSituation) {
  //     if (doesUserMatchSituation) {
  //       chai.assert(false);
  //     }
  //   });
  //
  // });
});