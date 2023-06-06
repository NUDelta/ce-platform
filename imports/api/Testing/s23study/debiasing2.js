import {getDetectorUniqueKey} from "../oce_api_helpers";
import {DETECTORS} from "./DETECTORS";

// the scene object
let scene = {
  scene_topic: "",
  scene_objective: "",
  contributor_instructions: "",
  key_descriptors: [],
  situation_detector: ""
};

// let scene_1 = {
//   needName: 1,
//   topic: "Debiasing Story between U.S and India",
//   objective: "I wanna showcase the difference between city scenes in India and U.S.",
//   subjects:["Skycrappers", "midtown", "Empire State Building"],
//   location:"Manhattan"
// }
// let sceen_2 = {
//   needName: 2,
//   topic: "Street Food at your place",
//   objective:" I want to elaborate on the street food in India and USA",
//   location:["food court","downtown"],
//   subjects: ["classical street food"]
// }
// let scene_3 = {
//   needName: 3,
//   topic: "Sellers in market place",
//   objective:" I want to showcase the hardship these peddlers in face of",
//   location:["farmer market","city street"],
//   subjects: ["peddler selling food", "items"]
// }

// let scene_4 = {
//   needName: 4,
//   topic: "Wedding in your country",
//   objective:" I want to showcase happiness of wedding",
//   location:["lawn","church","hotel"],
//   subjects: ["blissful", "Enchanting", "romantic"]

// }   

let detector_list = [DETECTORS.Myownplace, DETECTORS.commuting, DETECTORS.workplace, DETECTORS.Personaltime]


let scene_1 = {
  needName: 1,
  scene_topic: "Making breakfast",
  scene_objective: "I want to show the different kinds of food people eat to start their day in the two countries",
  contributor_instructions: "Take a picture of you cooking or eating the type of breakfast that is representative of your country",
  key_descriptors: ["breakfast", "food", "cereal"],
  situation_detector: detector_list[0]
}
let sceen_2 = {
  needName: 2,
  scene_topic: "Traveling to work",
  scene_objective: "I want to show the distinct ways in which people travel to work across the world",
  contributor_instructions: "Capture a scene that makes your journey to work unique about your country",
  key_descriptors: ["Taxis", "cars", "train", "public transport", "road", "crowd"],
  situation_detector: detector_list[1]
}
let scene_3 = {
  needName: 3,
  scene_topic: "Struggles that come up during work",
  scene_objective: "I want to show the problems people face in their daily work lives",
  contributor_instructions: "Click a picture of something that is really challenging for you physically or mentally when you re at work",
  key_descriptors: ["office", "university", "school", "desk", "pressure"],
  situation_detector: detector_list[2]
}

let scene_4 = {
  needName: 4,
  scene_topic: "Personal time",
  scene_objective: "Showing commonalities between different cultures on how they spend their personal time",
  contributor_instructions: "Take a picture of something you enjoy doing alone - it can be anything you are passionate about or which gives you peace",
  key_descriptors: ["reading", "music", "art", "passion", "relaxing"],
  situation_detector: detector_list[3]
}   



let highlevelauthordescription = {

  story_topic:"Debiasing Story between U.S and India",
  scene_array: [scene_1, sceen_2, scene_3, scene_4],
  needNames: ['Context Building1','Character Introduction','Conflict','Conflict resolution'],
  perspectives:["USA", "India"]
}



function cn_compile(debias_object){
  // scene_1 = debias_object.scene_array[0]
  // scene_2 = debias_object.scene_array[1]
  // scene_3 = debias_object.scene_array[2]
  // scene_4 = debias_object.scene_array[3]
  let needs = []
  

  for (let scene of debias_object.scene_array){
    const needname_index = scene.needName -1
    needs.push({
      needName: debias_object.needNames[needname_index],
      notificationSubject: "Hello! :)",
      notificationText: 'Hello :)',
      situation: {
        detector: getDetectorUniqueKey(detector_list[needname_index]), // set to "beginning detector" 
        number: '1'
      },
      toPass: {
        story_topic: debias_object.story_topic,
        instruction: scene.contributor_instructions,
        Right_Image: false,
        Left_Image: true,
        perspectives: debias_object.perspectives,
        dropdownChoices: {
          name: 'dropDown',
          options: debias_object.perspectives,
        },
        scene_description:{
          topic: scene.scene_topic,
          objective:scene.scene_objective,
          instructions: scene.contributor_instructions,
          descriptors: scene.key_descriptors
        },
      },
      //numberNeeded: debias_object.num_contribution,
      numberNeeded: debias_object.perspectives.length,
      notificationDelay: 1, // 1 seconds for debugging
    })
  }
    
    

  let res = {
    sample: {
      _id: Random.id(),
      name: 'Debias',
      prestoryTemplate: 'debias_1',
      participateTemplate: 'debias',
      resultsTemplate: 'cookSlides',
      // expandTemplate: 'seniorFinalsExpand',
      // repeatContributionsToExperienceAfterN: 0,
      contributionTypes: needs
    }
  }

  return res  
  
}

const DEBIAS_2 = cn_compile(highlevelauthordescription)

export default DEBIAS_2