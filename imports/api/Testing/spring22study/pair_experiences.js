import {getDetectorUniqueKey, addStaticAffordanceToNeeds} from "../oce_api_helpers";
import { addContribution, changeExperienceToPass, createExperience } from '../../OCEManager/OCEs/methods';
import { sendSystemMessage, postExpInChat, expCompleteCallback, expInProgressCallback } from '../../Messages/methods';
import {DETECTORS} from "../DETECTORS";
import { Router } from 'meteor/iron:router';


const promptDict = {
  selfIntro: {name: "Self-introduction", prompts: ["placeholder prompt"], delay: 1},
  library: {name: "Library working time", prompts: ["placeholder prompt"], delay: 1},
  restaurant: {name: "Food time", prompts: ["placeholder prompt"], delay: 1},
  cafe: {name: "Cafe chill-out time", prompts: ["placeholder prompt"], delay: 1},
  grocery: {name: "Grocery Shopping time", prompts: ["placeholder prompt"], delay: 1},
  outdoor: {name: "Outdoor time", prompts: ["placeholder prompt"], delay: 1},
  exercise: {name: "Exercise time", prompts: ["placeholder prompt"], delay: 1},
  commute: {name: "Commute time", prompts: ["placeholder prompt"], delay: 1},
  snack: {name: "Snack time", prompts: ["placeholder prompt"], delay: 1},
  weekend: {name: "Weekend fun time", prompts: ["placeholder prompt"], delay: 1},
  weekday: {name: "Weekday de-stress time", prompts: ["placeholder prompt"], delay: 1},
  remoteWorking: {name: "Remote working time", prompts: ["placeholder prompt"], delay: 1}
}

const createCallback = (completeCallback, inprogressCallback, name) => {
  completeCallback = completeCallback.replace(/TOSUBWITHNAME/g, name);
  inprogressCallback = inprogressCallback.replace(/TOSUBWITHNAME/g, name);
  return [completeCallback, inprogressCallback];
}

// new experiences ///////////////////////////////////////////////////////

export const createExp = function (pairNum, exp) {
  const completeCallback = function (sub) {
      let userUpdateKey = 'participatedInRestaurant';
      let systemMsg = 'Woo-hoo! You two have completed TOSUBWITHNAME!';
      let notifMsg = 'See images from you and your partner\'s TOSUBWITHNAME';
      Meteor.call('expCompleteCallback', sub, userUpdateKey, systemMsg, notifMsg);
  }
  const inprogressCallback = function (sub) {
      let systemMsg = `Your partner just completed TOSUBWITHNAME! `+ 'Participate to see their results when you get a chance'; 
      let notifMsg = `Hey! Your partner just completed TOSUBWITHNAME! ` + 'Participate to see their results when you get a chance'; 
      let confirmationMsg = "Your submission for TOSUBWITHNAME has been recorded! Your partner hasn't submitted yet, but we'll notify you when they do!"
      Meteor.call('expInProgressCallback', sub, systemMsg, notifMsg, confirmationMsg);
  }

  let callback = createCallback(completeCallback.toString(), inprogressCallback.toString(), promptDict[exp].name);

  let experience = {
    name: promptDict[exp].name, participateTemplate: 'groupBumped', resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : `${exp}${pairNum} 1`,
        situation : {
          detector : getDetectorUniqueKey(DETECTORS[pairNum][exp]),
          number : 1 
        },
        toPass : {
          situationDescription : promptDict[exp].name,
          instruction : promptDict[exp].prompts[0]
        },
        numberNeeded : 2, notificationDelay : promptDict[exp].delay, numberAllowedToParticipateAtSameTime: 2, allowRepeatContributions : false
      }
    ],
    description: promptDict[exp].prompts[0], notificationText: promptDict[exp].prompts[0],
    callbacks: [{trigger: `(cb.needFinished('${exp}${pairNum} 1'))`, function: callback[0]}, //completeCallback.toString().replace(/TOSUBWITHNAME/i, promptDict[exp].name)
                {trigger: `!(cb.needFinished('${exp}${pairNum} 1'))`, function: callback[1]}],
    allowRepeatContributions: false,
  };

  return experience;
}

// new experiences ///////////////////////////////////////////////////////

const creatPairExperience = function(pairNum) {
  let exp = {};
  for (const key in promptDict) {
    exp[key] = createExp(pairNum, key);
  }
  return exp;
}

// function create_pair_experiences(pairCount) {
//   let pair_experience = {}
//   let base = "pair";
//   for(let i = 1; i <= pairCount; i++) {
//     let pairNum = base + String(i)
//     pair_experience[pairNum] = creatPairExperience(pairNum)
//   }
//   return pair_experience
// }

// export default PAIR_EXPERIENCES = create_pair_experiences(11)

export default PAIR_EXPERIENCES = {
  pair1: creatPairExperience("pair1"),
  pair2: creatPairExperience("pair2"),
  pair3: creatPairExperience("pair3")
  // pair4: creatPairExperience("pair4"),
  // pair5: creatPairExperience("pair5"),
  // pair6: creatPairExperience("pair6"),
  // pair7: creatPairExperience("pair7"),
  // pair8: creatPairExperience("pair8"),
  // pair9: creatPairExperience("pair9"),
  // pair10: creatPairExperience("pair10"),
  // pair11: creatPairExperience("pair11")
}


//graveyard

/*
export const createLibraryExp2 = function (pairNum) {
  const libraryExpCompleteCallback2 = function (sub) {
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).fetch();

    let participants = submissions.map((submission) => { return submission.uid; });

    participants.forEach(function(p){
      Meteor.users.update({
        _id: p
      }, {
        $set: {
          ['profile.staticAffordances.participatedInLibraryExp2']: true
        }
      });
    });

    let route = `/apicustomresults/${sub.iid}/${sub.eid}`;
    let message = 'Woo-hoo! You two have completed another Library experience! Tap here to see your results.'; 

    sendSystemMessage(message, participants, route);
    notify(participants, sub.iid, 'See images from your library experience!', '', route);
  }

  let experience = {
    name: 'Group Bumped - Library2',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : `Library2${pairNum}`,
        situation : {
          detector : getDetectorUniqueKey(DETECTORS[pairNum].libraryExp2),
          number : 1
        },
        toPass : {
          situationDescription : "How was your study session today?",
          instruction : "Coming to the library again? Do you prefer to study at the library or somewhere else? Take a picture of your seat and share your favorite study spot with your partner!"
        },
        numberNeeded : 2,
        notificationDelay : 90,
        numberAllowedToParticipateAtSameTime: 3,
        allowRepeatContributions : false
      }
    ],
    description: 'Share your experience with your friend and their friend!',
    notificationText: 'Share your experience with your friend and their friend!',
    callbacks: [{
        trigger: `(cb.needFinished('Library2${pairNum}'))`,
        function: libraryExpCompleteCallback2.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}

*/


