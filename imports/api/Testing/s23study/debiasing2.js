import {getDetectorUniqueKey} from "../oce_api_helpers";
import {DETECTORS} from "./DETECTORS";

// the scene object
let scene = {
  scene_topic: "",
  scene_objective: "",
  subjects: [],
  location:[]
};

let scene_1 = {
  needName: 1,
  topic: "Debiasing Story between U.S and India",
  objective: "I wanna showcase the difference between city scenes in India and U.S.",
  subjects:["Skycrappers", "midtown", "Empire State Building"],
  location:"Manhattan"
}
let sceen_2 = {
  needName: 2,
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
  scene_array: [scene_1, sceen_2, scene_3, scene_4],
  needNames: ['Context Building1','Character Introduction','Conflict','Conflict resolution'],

  //How many contribution we 
  //num_contribution: 2	
  perspectives:["India", "USA"]
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
        detector: getDetectorUniqueKey(DETECTORS.wedding), // set to "beginning detector" 
        number: '1'
      },
      toPass: {
        story_topic: debias_object.story_topic,
        instruction: "Please take a picture based on previous submissions and author's needs",
        Right_Image: false,
        Left_Image: true,
        perspectives: debias_object.perspectives,
        dropdownChoices: {
          name: 'dropDown',
          options: debias_object.perspectives,
        },
        scene_description:{
          topic: scene.topic,
          objective:scene.objective,
          location:scene.location,
          subjects: scene.subjects
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