import {getDetectorUniqueKey} from "../oce_api_helpers";
import {DETECTORS} from "../DETECTORS";



export default Test1 = {
    sample: {
      _id: Random.id(),
      name: 'Cook',
      prestoryTemplate: 'cookNight',
      participateTemplate: 'sceneContribution',
      resultsTemplate: 'cookSlides',
      expandTemplate: 'seniorFinalsExpand',
      repeatContributionsToExperienceAfterN: 0,
      contributionTypes: [{
        needName: 'huh',
        notificationSubject: "Hello! :)",
        notificationText: 'How is your DTR deliverable going?',
        situation: {
          detector: getDetectorUniqueKey(DETECTORS.cookingJourneyDetector), // set to "beginning detector" 
          number: '1'
        },
        toPass: {
          //instruction: 'Can you take a photo of your coffee?',
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
      }]
    }
  }