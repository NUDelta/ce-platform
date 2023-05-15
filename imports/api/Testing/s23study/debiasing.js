import {getDetectorUniqueKey} from "../oce_api_helpers";
import {DETECTORS} from "../DETECTORS";


highlevelauthordescription = {
  // narrative objects
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
          pastpic:{
            subjects:["Skycrappers", "midtown", "Empire State Building"],
            location:"Manhattan"
            
          },
          scene_description:{
            topic: "City center that represent your city",
            objective:" I want to showcase the differences in city culture between India and USA",
            location:["city"],
            subjects: ["street", "people", "building"]
          },
          ExampleImageURL: "https://res.cloudinary.com/dwruudqoc/image/upload/v1683437513/nyc_pxzdmu.jpg",
          prestoryQuestion: "Are you studying at the library?",
          dropdownChoices: {
            name: 'casting question',
            options: ['😃','🙏','😌','😬', '😫', '😢']
          },
          contextDepQuestion: ['What are you doing at the library?', 
                          'Are you already finished with your deliverable and chilling at the library or are you currently working on it?',
                        'Are you working with your whole SIG? With others from your DTR? Just with the people within your project?'],
          castingDepQuestion: {
            happy: 'What makes you feel this way?', 
            hopeful: 'Why do you feel this way?',
            relieved: 'What makes you feel this way?',
            anxious: 'What makes you feel this way? What do you do to help with your anxiety?',
            exhausted: 'What makes you feel this way? What helps you feel better?',
            sad: 'What makes you feel this way? What helps you feel better?'
          },
        },
        numberNeeded: 10,
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
            topic: "City center that represent your city",
            objective:" I want to showcase the differences in city culture between India and USA",
            location:["city"],
            subjects: ["street", "people", "building"]
          },
          ExampleImageURL: "https://res.cloudinary.com/dwruudqoc/image/upload/v1683437513/nyc_pxzdmu.jpg",
          prestoryQuestion: "Are you studying at the library?",
          dropdownChoices: {
            name: 'casting question',
            options: ['😃','🙏','😌','😬', '😫', '😢']
          },
          contextDepQuestion: ['What are you doing at the library?', 
                          'Are you already finished with your deliverable and chilling at the library or are you currently working on it?',
                        'Are you working with your whole SIG? With others from your DTR? Just with the people within your project?'],
          castingDepQuestion: {
            happy: 'What makes you feel this way?', 
            hopeful: 'Why do you feel this way?',
            relieved: 'What makes you feel this way?',
            anxious: 'What makes you feel this way? What do you do to help with your anxiety?',
            exhausted: 'What makes you feel this way? What helps you feel better?',
            sad: 'What makes you feel this way? What helps you feel better?'
          },
        },
        numberNeeded: 10,
        notificationDelay: 1, // 1 seconds for debugging
        allowRepeatContributions : true
      }
    ]
    }
  }
