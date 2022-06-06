import {getDetectorUniqueKey, addStaticAffordanceToNeeds} from "../oce_api_helpers";
import { addContribution, changeExperienceToPass, createExperience } from '../../OCEManager/OCEs/methods';
import { sendSystemMessage, postExpInChat, expCompleteCallback, expInProgressCallback } from '../../Messages/methods';
import {DETECTORS} from "../DETECTORS";


const promptDict = {
  library: {
    name: "👩‍💻Library working time🧑‍💻", 
    description: "Working at a library? Share your experience with your partner!",
    prompts: [
      "Working on something outside home? Show your partner something cool (or motivating) around your study space that is keeping you going (or focused)? Caption it with why it motivates you!",
      "Found a study spot you like? Is this where you usually sit? Take a picture and share your reason!",
      "How do you stay productive or motivated? Share a study tip with your partner!"
    ], 
    delay: 600},
  restaurant: {
    name: "🍝Food time🍜", 
    description: "Eating at a restaurant? Share your experience with your partner!",
    prompts: [
      "Are you excited about anything at this restaurant? Food, people, ambiance, or memories?  Take a picture and caption it with your reason!",
      "Revisiting a restaurant? Take a picture of what makes you come back again and share it with your partner! (e.g., something about the food, people, ambiance, or memories?)",
      "First time visiting? What brought you here today? Take a picture and share it with your partner!"
    ], 
    delay: 360},
  cafe: {
    name: "☕️Cafe chill-out time🍵", 
    description: "Grabbing coffee? Share your experience with your partner!",
    prompts: [
      "Are you stopping by to grab coffee or staying at the cafe? Are you excited about anything at this cafe? Drinks, people, ambiance, or things you are working on? Take a picture and caption it with your reason!",
      "Revisiting a cafe? Take a picture of what makes you come back again and share it with your partner! (e.g., something about the drinks, people, ambiance, or memories?)",
      "First time visiting? What brought you here today? Take a picture and share it with your partner!"
    ], 
    delay: 360},
  grocery: {
    name: "🍎Grocery Shopping time🍊", 
    description: "Grocery shopping? Share your experience with your partner!",
    prompts: [
      "Enjoying your grocery shopping today? Take a picture of the items you're most excited about in your shopping cart and share your reason!",
      "What's one grocery item you always get? Take a picture and caption it with your reason!",
      "What's one item you highly recommend from the store? Share it with your partner for them to try out next time!"
    ], 
    delay: 180},
  outdoor: {
    name: "🌳Outdoor time🌳", 
    description: "Enjoying nature? Share your experience with your partner!",
    prompts: [
      "Enjoying your time outdoors? Take a picture of something around you that is interesting or makes you happy and caption it with your reason!",
      "Revisiting somewhere familiar? Take a picture of what makes you come back again and share it with your partner!"
    ], 
    delay: 180},
  exercise: {
    name: "🏀Exercise time🏐", 
    description: "Exercising? Share your experience with your partner!",
    prompts: [
      "Enjoying your exercising session today? What did you do and what has been keeping you motivated to exercise? Take a picture and share your reason! ",
      "Share a tip that helps you stay healthy with your partner for them to try out!"
    ], 
    delay: 180},
  commute: {
    name: "🚌Commute time🚃", 
    description: "Heading somewhere? Share your experience with your partner!",
    prompts: [
      "Hoping on a familiar bus/train ride again? Notice anything interesting or different today? Take a picture and share it with your partner!",
      "Heading somewhere for school, work, or a fun plan? What do you usually do in your commute time? Take a picture and share your favorite pastime!",
      "Recommend a podcast/video/article/music album to your partner for them to check out!"
    ], 
    delay: 60},
  snack: {
    name: "🍩Snack time🍪", 
    description: "Grabbing snacks? Share your experience with your partner!",
    prompts: [
      "Grabbing snacks? Do you have a go-to order or are you trying out something different today? Take a picture and share it with your partner!",
      "Revisiting somewhere familiar? Take a picture of what makes you come back again and share it with your partner!"
    ], 
    delay: 120},
  weekend: {
    name: "🎬Weekend fun time🎮", 
    description: "Doing something fun on the weekend? Share your experience with your partner!",
    prompts: [
      "It's the weekend! Take a picture of the fun things you are doing and share your experience with your partner!",
      "Revisiting somewhere familiar or coming here for the first time? Take a picture of the fun things you are doing and share your experience with your partner!"
    ], 
    delay: 360},
  weekday: {
    name: "🎨Weekday de-stress time🎧", 
    description: "Doing something fun to de-stress on a weekday? Share your experience with your partner!",
    prompts: [
      "Enjoying small breaks from school work? Take a picture of the fun things you are doing and share your experience with your partner!",
      "Revisiting somewhere familiar or coming here for the first time? Take a picture of the fun things you are doing and share your experience with your partner!"
    ], 
    delay: 360},
}

const createCallback = (completeCallback, inprogressCallback, name, key) => {
  completeCallback = completeCallback.replace(/TOSUBWITHNAME/g, name);
  completeCallback = completeCallback.replace(/TOSUBWITHKEY/g, key);
  completeCallback = completeCallback.replace(/TOSUBWITHSUBMISSIONKEY/g, key.toLowerCase());
  inprogressCallback = inprogressCallback.replace(/TOSUBWITHNAME/g, name);
  inprogressCallback = inprogressCallback.replace(/TOSUBWITHSUBMISSIONKEY/g, key.toLowerCase());
  return [completeCallback, inprogressCallback];
}



// new experiences ///////////////////////////////////////////////////////

export const createExp = function (pairNum, exp) {
  const completeCallback = function (sub) {
      let userUpdateKey = 'participatedInTOSUBWITHKEY';
      let systemMsg = 'Woo-hoo! You two have completed TOSUBWITHNAME!';
      let notifMsg = 'See images from you and your partner\'s TOSUBWITHNAME';
      let waitOnPartnerSubmissionKey = 'TOSUBWITHSUBMISSIONKEY';
      Meteor.call('expCompleteCallback', sub, userUpdateKey, systemMsg, notifMsg, waitOnPartnerSubmissionKey);
  }
  const inprogressCallback = function (sub) {
      let systemMsg = `Your partner just completed TOSUBWITHNAME! `+ 'Participate to see their results when you get a chance'; 
      let notifMsg = `Hey! Your partner just completed TOSUBWITHNAME! ` + 'Participate to see their results when you get a chance'; 
      let confirmationMsg = "Your submission for TOSUBWITHNAME has been recorded! Your partner hasn't submitted yet, but we'll notify you when they do!";
      let waitOnPartnerSubmissionKey = 'TOSUBWITHSUBMISSIONKEY';
      Meteor.call('expInProgressCallback', sub, systemMsg, notifMsg, confirmationMsg, waitOnPartnerSubmissionKey);
  }

  let callback = createCallback(completeCallback.toString(), inprogressCallback.toString(), promptDict[exp].name, exp);

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
          promptCount: promptDict[exp].prompts.length,
          instruction : promptDict[exp].prompts
        },
        numberNeeded : 2, notificationDelay : promptDict[exp].delay, numberAllowedToParticipateAtSameTime: 2, allowRepeatContributions : false
      }
    ],
    description: promptDict[exp].description, notificationText: promptDict[exp].description,
    callbacks: [{trigger: `(cb.specificNeedFinish('${exp}${pairNum}'))`, function: callback[0]}, //completeCallback.toString().replace(/TOSUBWITHNAME/i, promptDict[exp].name)
                {trigger: `!(cb.specificNeedFinish('${exp}${pairNum}'))`, function: callback[1]}],
    allowRepeatContributions: true, //try set this to true
  };

  return experience;
}

export const createSelfIntro = function (pairNum, exp) {
  const completeCallback = function (sub) {
      let userUpdateKey = 'participatedInSelfIntro';
      let systemMsg = 'Woo-hoo! You two have completed Self Introduction!';
      let notifMsg = 'See images from you and your partner\'s Self Introduction';
      Meteor.call('selfIntroCompleteCallback', sub, userUpdateKey, systemMsg, notifMsg);
  }
  const inprogressCallback = function (sub) {
      let systemMsg = `Your partner just completed Self Introduction! `+ 'Participate to see their results when you get a chance'; 
      let notifMsg = `Hey! Your partner just completed Self Introduction! ` + 'Participate to see their results when you get a chance'; 
      let confirmationMsg = "Your submission for Self Introduction has been recorded! Your partner hasn't submitted yet, but we'll notify you when they do!";
      let waitOnPartnerSubmissionKey = 'selfintro';
      Meteor.call('expInProgressCallback', sub, systemMsg, notifMsg, confirmationMsg, waitOnPartnerSubmissionKey);
  }

  let experience = {
    name: '💬Self Introduction💬', participateTemplate: 'groupBumped', resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : `${exp}${pairNum} 1`,
        situation : {
          detector : getDetectorUniqueKey(DETECTORS[pairNum][exp]),
          number : 1 
        },
        toPass : {
          situationDescription : '💬Self Introduction💬',
          promptCount: 1,
          instruction : ["Say hello to your partner for the next 2 weeks! \
          Share a picture of yourself or something that's representative of you, and tell your partner about yourself!"]
        },
        numberNeeded : 2, notificationDelay : 1, numberAllowedToParticipateAtSameTime: 2, allowRepeatContributions : false
      }
    ],
    description: "Say hello to your new friend!", notificationText: "Say hello to your new friend!",
    callbacks: [{trigger: `(cb.specificNeedFinish('${exp}${pairNum}'))`, function: completeCallback.toString()}, //completeCallback.toString().replace(/TOSUBWITHNAME/i, promptDict[exp].name)
                {trigger: `!(cb.specificNeedFinish('${exp}${pairNum}'))`, function: inprogressCallback.toString()}],
    allowRepeatContributions: false, //try set this to true
  };

  return experience;
}



// new experiences ///////////////////////////////////////////////////////

const creatPairExperience = function(pairNum) {
  let exp = {};
  exp['selfIntro'] = createSelfIntro(pairNum, 'selfIntro');
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


