import {getDetectorUniqueKey} from "../oce_api_helpers";
import {DETECTORS} from "../DETECTORS";


// the scene object
Let scene = {
  scene_topic: "",
  scene_objective: "",
  subjects = [],
  location = []
}

let scene_1 = {
  needName: 1,
  scene_topic: "Debiasing Story between U.S and India",
  scene_objective: "I wanna showcase the difference between city scenes in India and U.S.",
  subjects:["Skycrappers", "midtown", "Empire State Building"],
  location:"Manhattan"
}
let sceen_2 = {
  Needname: 2,
  topic: "Street Food at your place",
  objective:" I want to elaborate on the street food in India and USA",
  location:["food court","downtown"],
  subjects: ["classical street food"]
}
let scene_3 = {
  needName: 3,
  topic: "Sellers in market place",
  objective:" I want to showcase the hardship these peddlers in face of",
  location:["farmer market","city street"],
  subjects: ["peddler selling food", "items"]
}

let scene_4 = {
  needName: 4,
  topic: "Wedding in your country",
  objective:" I want to showcase happiness of wedding",
  location:["lawn","church","hotel"],
  subjects: ["blissful", "Enchanting", "romantic"]

}   



highlevelauthordescription = {
  // narrative objects 
  story_topic:"Debiasing Story between U.S and India",
  instruction:"Please take a picture based on previous submissions and author's needs",
  let scene_array = [scene_1, sceen_2, scene_3, scene_4],
  num_contribution: 2,
  
  
  
		
}

  
  
  


// const compile() => {
//   return lowLevel
// }


export default DEBIAS = {
    sample: {
      _id: Random.id(),
      name: 'Debias',
      prestoryTemplate: 'debias_1',
      participateTemplate: 'debias',
      resultsTemplate: 'cookSlides',
      expandTemplate: 'seniorFinalsExpand',
      repeatContributionsToExperienceAfterN: 0,
      contributionTypes: [{

        needName: 'Context Building1',
        notificationSubject: "Hello! :)",
        notificationText: 'How is your DTR deliverable going?',
        situation: {
          detector: getDetectorUniqueKey(DETECTORS.cookingJourneyDetector), // set to "beginning detector" 
          number: '1'
        },
        toPass: {
          story_topic: 'Debiasing Story between U.S and India',
          instruction: "Please take a picture based on previous submissions and author's needs",
          Right_Image: false,
          Left_Image: true,
        
          scene_description:{
            topic: "City center that represent your city",
            objective:" I want to showcase the differences in city culture between India and USA",
            location:["city"],
            subjects: ["street", "people", "building"]
          },
          ExampleImageURL: "https://res.cloudinary.com/dwruudqoc/image/upload/v1683437513/nyc_pxzdmu.jpg",
        },
        numberNeeded: 2,
        notificationDelay: 1, // 1 seconds for debugging
        allowRepeatContributions : true
      },

      {
        needName: 'Character Introduction',
        notificationSubject: "Hello! :)",
        notificationText: 'How is your DTR deliverable going?',
        situation: {
          detector: getDetectorUniqueKey(DETECTORS.cookingJourneyDetector), // set to "beginning detector" 
          number: '1'
        },
        toPass: {
          story_topic: 'Debiasing Story between U.S and India',
          instruction: "Please take a picture based on previous submissions and author's needs",
          Right_Image: false,
          Left_Image: true,
          pastpic:{
            subjects:["Skycrappers", "midtown", "Empire State Building"],
            location:"Manhattan"
            
          },
          scene_description:{
            topic: "Street Food at your place",
            objective:" I want to elaborate on the street food in India and USA",
            location:["food court","downtown"],
            subjects: ["classical street food"]
          },
          ExampleImageURL: "https://res.cloudinary.com/dwruudqoc/image/upload/v1683437513/nyc_pxzdmu.jpg",         
        },
        numberNeeded: 2,
        notificationDelay: 1, // 1 seconds for debugging
        allowRepeatContributions : true
      },

      {
        needName: 'Conflict',
        notificationSubject: "Hello! :)",
        // notificationText: 'How is your DTR deliverable going?',
        situation: {
          detector: getDetectorUniqueKey(DETECTORS.cookingJourneyDetector), // set to "beginning detector" 
          number: '1'
        },
        toPass: {
          story_topic: 'Debiasing Story between U.S and India',
          instruction: "Please take a picture based on previous submissions and author's needs",
          Right_Image: false,
          Left_Image: true,
          scene_description:{
            topic: "Sellers in market place",
            objective:" I want to showcase the hardship these peddlers in face of",
            location:["farmer market","city street"],
            subjects: ["peddler selling food", "items"]
          },
          ExampleImageURL: "https://res.cloudinary.com/dwruudqoc/image/upload/v1683437513/nyc_pxzdmu.jpg",
        },
        numberNeeded: 2,
        notificationDelay: 1, // 1 seconds for debugging
        allowRepeatContributions : true
      },

      
      {
        needName: 'Conflict resolution',
        notificationSubject: "Hello! :)",
        // notificationText: 'How is your DTR deliverable going?',
        situation: {
          detector: getDetectorUniqueKey(DETECTORS.cookingJourneyDetector), // set to "beginning detector" 
          number: '1'
        },
        toPass: {
          story_topic: 'Debiasing Story between U.S and India',
          instruction: "Please take a picture based on previous submissions and author's needs",
          Right_Image: false,
          Left_Image: true,
          scene_description:{
            topic: "Wedding in your country",
            objective:" I want to showcase happiness of wedding",
            location:["lawn","church","hotel"],
            subjects: ["blissful", "Enchanting", "romantic"]
          },
          ExampleImageURL: "https://res.cloudinary.com/dwruudqoc/image/upload/v1683437513/nyc_pxzdmu.jpg",
        },
        numberNeeded: 2,
        notificationDelay: 1, // 1 seconds for debugging
        allowRepeatContributions : true
      },
      


      
    ]
    }
  }
