const createDetectors = function (pairNum) {
  let DETECTORSPAIR = {
    // new detector for walk /////////////////////////////////////
    walk:{
      _id: Random.id(),
      description: 'Walk ' + pairNum,
      variables: [
        `var ${pairNum}`
        // 'var daytime;'
      ],
      rules: [`(${pairNum})`]
      // rules: ['(triad1)']
    },
  
    library:{
      _id: Random.id(),
      description: 'Library ' + pairNum,
      variables: [
        'var libraries;',
        'var usedbooks;',
        'var bookstores;',
        `var ${pairNum}`
      ],
      rules: [`${pairNum} && (libraries || bookstores);`]
      // rules: ['(triad2)']
    },
  
    // groceries_triad1:{
    //   _id: Random.id(),
    //   description: 'Groceries Triad 1',
    //   variables: [
    //     'var intlgrocery;',
    //     'var ethicgrocery;',
    //     'var markets;',
    //     'var wholesalers;',
    //     'var pharmacy;',
    //     'var grocery;',
    //     'var farmersmarket;',
    //     'var convenience;',
    //     'var importedfood;',
    //     'var herbsandspices;',
    //     'var drugstores;',
    //     'var seafoodmarkets;',
    //     'var marketstalls;',
    //     'var organic_stores;',
    //     'var publicmarkets;',
    //     'var triad3'
    //   ],
    //   // rules: ['(intlgrocery || ethicgrocery) || ((markets || wholesalers) || ((pharmacy || grocery) || ((farmersmarket || convenience) || ((importedfood || herbsandspices) || ((drugstores || seafoodmarkets) || ((organic_stores || publicmarkets) || marketstalls))))));']
    //   rules: ['(triad3)']
    // },
  
    // restaurant_triad1:{
    //   _id: Random.id(),
    //   description: 'Restaurant Triad 1',
    //   variables: [
    //     'var triad1',
    //     'var daytime;',
    //     'var triad1',
    //     'var coffeeroasteries;',
    //     'var coffee;',
    //     'var cafes;',
    //     'var coffeeshops;',
    //     'var coffeeteasupplies;',
    //     'var diners;',
    //     'var restaurants;',
    //     'var cafeteria;',
    //     'var food_court;',
    //     'var bars;',
    //   ],
    //   rules: ['(triad1 && daytime && (coffeeroasteries || coffee || coffeeshops || coffeeteasupplies || cafes || diners || restaurants || cafeteria || food_court || bars));']
    // },
  
    //  /////////////////////////////////////////////////////////
    /*end of progression triad 1*/
    
  };
  return DETECTORSPAIR
}

export const DETECTORS = {
  pair1: createDetectors("pair1"),
  pair2: createDetectors("pair2"),
  pair3: createDetectors("pair3"),
}

