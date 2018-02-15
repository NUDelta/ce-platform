import {resetDatabase} from 'meteor/xolvio:cleaner';
import {matchAffordancesWithDetector,
        getAffordancesMatchWithDetector}
  from './methods';
import {Detectors} from './detectors';


describe('Detector Tests', function() {
  let userId = "GozT7ZtXuu3diPPWc";
  let detectorId = "cG4RJxsodeYfG7ATT";

  beforeEach(function() {
    resetDatabase();

    Detectors.insert({
      "_id" : detectorId,
      "description" : "places one can buy fruit",
      "variables" : [
        "var juice_bars___smoothies;",
        "var wholesalers;",
        "var specialty_food;",
        "var community_gardens;",
        "var flea_markets;",
        "var ethnic_grocery;",
        "var csa;",
        "var acai_bowls;",
        "var health_markets;",
        "var international_grocery;",
        "var organic_stores;",
        "var grocery;",
        "var attraction_farms;",
        "var farmers_market;",
        "var farms;",
        "var public_markets;",
        "var market_stalls;",
        "var pick_your_own_farms;",
        "var fruits___veggies;"
      ],
      "rules" : [
        "(((((((((((((((((pick_your_own_farms || fruits___veggies) || market_stalls) || public_markets) || farms) || farmers_market) || attraction_farms) || grocery) || organic_stores) || international_grocery) || health_markets) || acai_bowls) || csa) || ethnic_grocery) || flea_markets) || community_gardens) || specialty_food) || wholesalers) || juice_bars___smoothies;"
      ]
    });
  })

  it('should match "grocery" for "places one can buy fruit"', function() {
    let affordances = {
      'grocery': true
    };

    if (!matchAffordancesWithDetector(affordances, detectorId)) {
      chai.assert(false);
    }
  })

  it('should match "whole foods in evanston" for "places one can buy fruit"', function() {
    //grocery, whole foods in evanston
    let lat = 42.047621;
    let lng = -87.679488;

    getAffordancesMatchWithDetector(lat, lng, detectorId, function(result) {
      if (!result) {
        chai.assert(false);
      }
    })
  })
});