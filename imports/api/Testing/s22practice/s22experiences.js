import {getDetectorUniqueKey, addStaticAffordanceToNeeds} from "../oce_api_helpers";
import { addContribution, changeExperienceToPass } from '../../OCEManager/OCEs/methods';
import {DETECTORS} from "../DETECTORS";

export const createPracticeTalk = function () {
    const testCallback = function (sub) {
        console.log("HERE ", sub);
    }

    let experience = {
        name: "S22 Test Run",
        participateTemplate: 'testtest',
        resultsTemplate: 'groupBumpedResults',
        contributionTypes: [
            {
                needName: "OnlyNeed",
                situation: {
                    detector: getDetectorUniqueKey(DETECTORS.coffee),
                    number: 1
                },
                toPass : {
                    situationDescription : "This worked?",
                    instruction : "Send a picture of anything! (is this going into the database?)."
                  },
                numberNeeded : 1,
                notificationDelay : 1,
                numberAllowedToParticipateAtSameTime: 3,
                allowRepeatContributions : true
            }
        ],
        callbacks: [
            {
                trigger: `cb.newSubmission('OnlyNeed')`,
                function: testCallback.toString()
            }
        ],
        description: 'Share your testing with your friend and their friend!',
        notificationText: 'Share your testing with your friend and their friend!',
        allowRepeatContributions: true
    };
    console.log(experience);
    return experience;
}



export const studyAtLibrary = function () {
    let experience = {
        name: "Studying at the Library!",
        participateTemplate: 'testtest',
        resultsTemplate: 'groupBumpedResults',
        contributionTypes: [
            {
                needName: "OnlyNeed",
                situation: {
                    detector: getDetectorUniqueKey(DETECTORS.library),
                    number: 1
                },
                toPass : {
                    situationDescription : "It seems as though you are studying at the library.",
                    instruction : "Whenever I study at the library, I need __."
                  },
                numberNeeded : 1,
                notificationDelay : 1,
                numberAllowedToParticipateAtSameTime: 3,
                allowRepeatContributions : true
            }
        ],
        description: 'It seems as though you are studying at the library.',
        notificationText: 'It seems as though you are studying at the library.',
        allowRepeatContributions: true
    };
    console.log(experience);
    return experience;
}

export default S22 = {
    testTalk: createPracticeTalk(),
    studyLibrary: studyAtLibrary()
}