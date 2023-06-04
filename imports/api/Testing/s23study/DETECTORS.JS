const createDetectors = function (pairNum) {
    return {
      activity1:{
        _id: Random.id(),
        description: 'activity1 ' + pairNum,
        variables: [
          `var ${pairNum};`,
        ],
        rules: [`${pairNum};`]
        // rules: ['(triad1)']
      },
    }
}

export let DETECTORS = {
  wedding:{
    _id: Random.id(),
    description: "wedding scene",
    variables: [
        'var hindu_temples;', 
        'var churches;', 
        'var countryclubs;', 
        'var weddingchappels;'],
        
    rules:['(hindu_temples || churches || countryclubs || weddingchappels);']
  },
  
  downtown: {
    _id: Random.id(),
    description: "scene for downtown",
    variables: [
        'var landmarks;',
        'var shoppingcenters;',
        'var publictransport;',
        'var civiccenter;',
    ],

    rules:['(landmarks || publictransport || civiccenter || shoppingcenters);']
  },
  Myownplace:{
    _id: Random.id(),
    description: "Detector for someone in their own place",
    variables: [
      'var university_housing;',
      'var apartments;'
    ],
    rules:['(university_housing || apartments);']
  },

  workplace:{
    _id: Random.id(),
    description: "Detector for someone at work",
    variables:
    [
      'var collegeuniv;',
      'var libraries;',
      'var gardeners;'
    ],

    rules:['(collegeuniv || libraries || gardeners)']


  },


  commuting:{
    _id: Random.id(),
    description: "Travel to work",
    variables:[
        'var daytime;',
        'var publictransport;',
        'var metrostations;',
        'var buses;',
        'var coffeeshops',

    ],

    rules:['daytime && (publictransport || metrostations || buses || coffeeshops)']
  },
  Personaltime:{
    _id: Random.id(),
    description: "places to spend some personal time after home",
    variables:[
        'var nighttime;',
        'var movietheaters;',
        'var sportsteams;',
        'var sportsclubs;',
        'var island_pub;',
    ],

    rules:['nighttime && (nighttime || movietheaters || sportsteams || sportsclubs || island_pub)']
    
  }
  
  


  


}
