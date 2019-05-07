import {sustainedAvailabilities} from "../../OCEManager/OCEs/methods";
import {setIntersection} from "../../custom/arrayHelpers";

describe('Sustained (place, need) Match for Availability Dictionary', function() {
  let availabilityDictionary = {
    "asianFoodCrawlIncident": [
      ['ramen_dojo', 'noodleNeed', 10.0],
      ['kongs_chinese', 'noodleNeed', 20.5]
    ],
    "groceryBuddiesIncident": [
      ['trader_joes', 'groceryNeed', 20.0]
    ],
    "sunsetTogether": [
      ['', 'sunsetTogetherNeed', undefined],
      ['ramen_dojo', 'sunsetTogetherNeed', undefined],
      ['kongs_chinese', 'sunsetTogetherNeed', undefined],
      ['trader_joes', 'sunsetTogetherNeed', undefined]
    ]
  };

  // sustained success - after notification delay
  let sustainedAfterAvailDict = {
    "asianFoodCrawlIncident": [
      ['ramen_dojo', 'noodleNeed', 3.0]
    ]
  };

  // sustained for not place need -- after notification delay
  let sustainedWeatherTimeNeedAfterAvailDict = {
    "sunsetTogether": [
      ['', 'sunsetTogetherNeed', undefined],
    ]
  };

  // not sustained - after notification delay
  let notSustainedAfterAvailDict = {
    "asianFoodCrawlIncident": [
      ['onsen_oden', 'noodleNeed', 25.0]
    ]
  };

  it('Sustained Incident', function() {
    let incidentIntersection = setIntersection(Object.keys(availabilityDictionary), Object.keys(sustainedAfterAvailDict));
    console.log(incidentIntersection);
    chai.assert.equal(
      JSON.stringify(incidentIntersection),
      JSON.stringify(["asianFoodCrawlIncident"]));
  });

  it('Sustained [Place, Needs]', function() {
    let incident = "asianFoodCrawlIncident";

    let beforePlacesAndNeeds = availabilityDictionary[incident].map((place_need_dist) => place_need_dist.slice(0,2));
    let afterPlacesAndNeeds = sustainedAfterAvailDict[incident].map((place_need_dist) => place_need_dist.slice(0,2));
    let place_need_intersection = setIntersection(
      beforePlacesAndNeeds, afterPlacesAndNeeds);

    chai.assert.equal(
      JSON.stringify(place_need_intersection),
      JSON.stringify([['ramen_dojo', 'noodleNeed']])
    )
  });

  // different places - after notification delay
  it('NOT Sustained [Place, Needs]', function() {
    let incident = "asianFoodCrawlIncident";

    let place_need_intersection = setIntersection(
      availabilityDictionary[incident],
      notSustainedAfterAvailDict[incident]);

    chai.assert.equal(
      JSON.stringify(place_need_intersection),
      JSON.stringify([])
    )
  });

  it('Sustained AvailDict', function() {
    let sustainedAvailDict = sustainedAvailabilities(availabilityDictionary, sustainedAfterAvailDict);
    chai.assert.equal(
      JSON.stringify(sustainedAvailDict),
      JSON.stringify({
        "asianFoodCrawlIncident": [
          ['ramen_dojo', 'noodleNeed', 3.0]
        ]
      })
    )
  });

  it('NOT Sustained AvailDict', function() {
    let sustainedAvailDict = sustainedAvailabilities(availabilityDictionary, notSustainedAfterAvailDict);
    chai.assert.equal(
      JSON.stringify(sustainedAvailDict),
      JSON.stringify({})
    );

    chai.assert.equal(Object.keys(sustainedAvailDict).length, 0);
  });

  it('Sustained NonPlace AvailDict', function() {
    let sustainedAvailDict = sustainedAvailabilities(availabilityDictionary, sustainedWeatherTimeNeedAfterAvailDict);
    chai.assert.equal(
      JSON.stringify(sustainedAvailDict),
      JSON.stringify({
        "sunsetTogether": [
          ['', 'sunsetTogetherNeed', undefined]
        ]
      })
    );
  });
});
