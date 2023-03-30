import {getDetectorUniqueKey, addStaticAffordanceToNeeds} from "../oce_api_helpers";
import { addContribution, changeExperienceToPass, createExperience } from '../../OCEManager/OCEs/methods';
import { sendSystemMessage, postExpInChat, expCompleteCallback, expInProgressCallback } from '../../Messages/methods';
import {DETECTORS, DETECTORS_EXTRA} from "../DETECTORS";

const PAIR_COUNT = 5;

const promptDict = {
  library: {
    name: "👩‍💻Library working time🧑‍💻", 
    description: "Working at a library? Share your experience with your partner!",
    prompts: [
      "Working on something outside home? Show your partner something cool (or motivating) around your study space that is keeping you going (or focused)? Caption it with why it motivates you!",
      "Found a study spot you like? Is this where you usually sit? Take a picture and share your reason!",
      "How do you stay productive or motivated? Share a study tip with your partner!"
    ], 
    mood_prompts: "How are you feeling? Feeling motivated or stressed working at the library? Share your working moment on and how you feel with your partner!",
    followups: ["Here's some questions you can ask your partner: 1. What's keeping you going/focused? 2. What's your favorite study spot? 3. How do you stay productive? Any tips?"],
    degradedprompt: ["Don't have a current experience for this activity? Share your most recent experience with your partner instead!"],
    isBftP: false,
    delay: 600},
  restaurant: {
    name: "🍝Food time🍜", 
    description: "Enjoying your meal? Share your experience with your partner!",
    prompts: [
      "Are you excited about anything at this restaurant? Food, people, ambiance, or memories?  Take a picture and caption it with your reason!",
      "Revisiting a restaurant? Take a picture of what makes you come back again and share it with your partner! (e.g., something about the food, people, ambiance, or memories?)",
      "First time visiting? What brought you here today? Take a picture and share it with your partner!"
    ],
    mood_prompts: "How are you feeling? Enjoying a nice meal? Share your dining moment and how you feel with your partner!",
    followups: ["Here's some questions you can ask your partner: 1. Is this your first time dining or are you revisiting? 2. What brings you here today? 3. What's your favorite thing about this restaurant?"],
    degradedprompt: ["Don't have a current experience for this activity? Share your most recent experience with your partner instead!"], 
    isBftP: false,
    delay: 360},
  cafe: {
    name: "☕️Cafe chill-out time🍵", 
    description: "Grabbing coffee? Share your experience with your partner!",
    prompts: [
      "Are you stopping by to grab coffee or staying at the cafe? Are you excited about anything at this cafe? Drinks, people, ambiance, or things you are working on? Take a picture and caption it with your reason!",
      "Revisiting a cafe? Take a picture of what makes you come back again and share it with your partner! (e.g., something about the drinks, people, ambiance, or memories?)",
      "First time visiting? What brought you here today? Take a picture and share it with your partner!"
    ], 
    mood_prompts: "How are you feeling? Chilling at the cafe or working on something exciting? Share your moment at the cafe and how you feel with your partner!",
    followups: ["Here's some questions you can ask your partner: 1. Are you stopping by to grab a coffee or staying at the cafe? 2. Are you revisiting? What's your favorite thing about this cafe? 3. Is this your first time visiting? What brought you here today?"],
    degradedprompt: ["Don't have a current experience for this activity? Share your most recent experience with your partner instead!"],
    isBftP: false,
    delay: 360},
  grocery: {
    name: "🍎Grocery Shopping time🍊", 
    description: "Grocery shopping? Share your experience with your partner!",
    prompts: [
      "Enjoying your grocery shopping today? Take a picture of the items you're most excited about in your shopping cart and share your reason!",
      "What's one grocery item you always get? Take a picture and caption it with your reason!",
      "What's one item you highly recommend from the store? Share it with your partner for them to try out next time!"
    ],
    mood_prompts: "How are you feeling? Excited about what you are getting or restocking your groceries like usual? Share your grocery shopping moment and how you feel with your partner!",
    followups: ["Here's some questions you can ask your partner: 1. What items are in your haul today? What are you most excited to use? 2. What's a grocery item you always get? 3. What's an item you'd recommend to me?"], 
    degradedprompt: ["Don't have a current experience for this activity? Share your most recent experience with your partner instead!"],
    isBftP: false,
    delay: 180},
  outdoor: {
    name: "🌳Outdoor time🌳", 
    description: "Enjoying nature? Share your experience with your partner!",
    prompts: [
      "Enjoying your time outdoors? Take a picture of something around you that is interesting or makes you happy and caption it with your reason!",
      "Revisiting somewhere familiar? Take a picture of what makes you come back again and share it with your partner!"
    ],
    mood_prompts: "How are you feeling? Feeling relaxed outdoor? Share your outdoor moment and how you feel with your partner!",
    followups: ["Here's some questions you can ask your partner: 1. Do you prefer the outdoors or the indoors more? 2. What's the most interesting thing in nature that you see around you? 3. Are you revisiting this spot or is it your first time?"], 
    degradedprompt: ["Don't have a current experience for this activity? Share your most recent experience with your partner instead!"],
    isBftP: false,
    delay: 180},
  exercise: {
    name: "🏀Exercise time🏐", 
    description: "Exercising? Share your experience with your partner!",
    prompts: [
      "Enjoying your exercising session today? What did you do and what has been keeping you motivated to exercise? Take a picture and share your reason! ",
      "Share a tip that helps you stay healthy with your partner for them to try out!"
    ],
    mood_prompts: "How are you feeling? Exhausted or energized? Share your exercising moment and how you feel with your partner!",
    followups: ["Here's some questions you can ask your partner: 1. What did your routine today consist of? 2. What's your motivation to work out? 3. Any tips on staying healthy?"], 
    degradedprompt: ["Don't have a current experience for this activity? Share your most recent experience with your partner instead!"],
    isBftP: false,
    delay: 180},
  commute: {
    name: "🚌Commute time🚃", 
    description: "Heading somewhere? Share your experience with your partner!",
    prompts: [
      "Hoping on a familiar bus/train ride again? Notice anything interesting or different today? Take a picture and share it with your partner!",
      "Heading somewhere for school, work, or a fun plan? What do you usually do in your commute time? Take a picture and share your favorite pastime!",
      "Recommend a podcast/video/article/music album to your partner for them to check out!"
    ],
    mood_prompts: "How are you feeling? Heading somewhere different or somewhere usual? Share your commuting moment and how you feel with your partner!",
    followups: ["Here's some questions you can ask your partner: 1. What do you usually do during your commute time? 2. Do you have any podcast/video/article/album recommendations to kill time? 3. Did you see anything interesting on your commute today?"], 
    degradedprompt: ["Don't have a current experience for this activity? Share your most recent experience with your partner instead!"],
    isBftP: false,
    delay: 60},
  weekend: {
    name: "🎬Weekend fun time🎮", 
    description: "Doing something fun on the weekend? Share your experience with your partner!",
    prompts: [
      "It's the weekend! Take a picture of the fun things you are doing and share your experience with your partner!",
      "Revisiting somewhere familiar or coming here for the first time? Take a picture of the fun things you are doing and share your experience with your partner!"
    ],
    mood_prompts: "How are you feeling? Doing something fun on the weekend? Share your moment and how you feel with your partner!",
    followups: ["Here's some questions you can ask your partner: 1. What other plans do you have this weekend or next weekend? 2. Are you revisiting this place? 3. What else would you recommend?"], 
    degradedprompt: ["Don't have a current experience for this activity? Share your most recent experience with your partner instead!"],
    isBftP: false,
    delay: 360},
  weekday: {
    name: "🎨Weekday de-stress time🎧", 
    description: "Doing something fun to de-stress on a weekday? Share your experience with your partner!",
    prompts: [
      "Enjoying small breaks from school work? Take a picture of the fun things you are doing and share your experience with your partner!",
      "Revisiting somewhere familiar or coming here for the first time? Take a picture of the fun things you are doing and share your experience with your partner!"
    ],
    mood_prompts: "How are you feeling? Doing something fun to de-stress on a weekday? Share your moment and how you feel with your partner!",
    followups: ["Here's some questions you can ask your partner: 1. Any other plans for today?"], 
    degradedprompt: ["Don't have a current experience for this activity? Share your most recent experience with your partner instead!"],
    isBftP: false,
    delay: 360},
  bestfriends: {
    name: "Best Friends", 
    description: "When was the last time that you hung out with your best friend(s) that you have a picture of?",
    prompts: [
        "empty",
        "empty"
    ],
    mood_prompts: "When was the last time that you hung out with your best friend(s) that you have a picture of?",
    followups: ["empty"], 
    degradedprompt: ["Don't have a current experience for this activity? Share your most recent experience with your partner instead!"],
    isBftP: true,
    delay: 360},
}

const createCallback = (completeCallback, inprogressCallback, name, key, followups) => {
  completeCallback = completeCallback.replace(/TOSUBWITHNAME/g, name);
  completeCallback = completeCallback.replace(/TOSUBWITHKEY/g, key);
  completeCallback = completeCallback.replace(/TOSUBWITHSUBMISSIONKEY/g, key.toLowerCase());
  completeCallback = completeCallback.replace(/TOSUBWITHFOLLOWUPS/g, followups);
  inprogressCallback = inprogressCallback.replace(/TOSUBWITHNAME/g, name);
  inprogressCallback = inprogressCallback.replace(/TOSUBWITHSUBMISSIONKEY/g, key.toLowerCase());
  return [completeCallback, inprogressCallback];
}



// new experiences ///////////////////////////////////////////////////////

export const createExp = function (pairNum, exp) {
  const completeCallback = function (sub) {
      let userUpdateKey = "participatedInTOSUBWITHKEY";
      let systemMsg = "Woo-hoo! You two have completed TOSUBWITHNAME! TOSUBWITHFOLLOWUPS";
      let notifMsg = "See images from you and your partner\'s TOSUBWITHNAME";
      let waitOnPartnerSubmissionKey = "TOSUBWITHSUBMISSIONKEY";
      let expName = "TOSUBWITHNAME";
      Meteor.call("expCompleteCallback", sub, userUpdateKey, systemMsg, notifMsg, waitOnPartnerSubmissionKey, expName);
  }
  const inprogressCallback = function (sub) {
      let systemMsg = `Your partner just completed TOSUBWITHNAME! `+ 'Participate to see their results when you get a chance'; 
      let notifMsg = `Hey! Your partner just completed TOSUBWITHNAME! ` + 'Share your picture within next 48 hours to complete the experience together!'; 
      let confirmationMsg = "Your submission for TOSUBWITHNAME has been recorded! Your partner hasn't submitted yet, but we'll notify you when they do!";
      let waitOnPartnerSubmissionKey = 'TOSUBWITHSUBMISSIONKEY';
      Meteor.call('expInProgressCallback', sub, systemMsg, notifMsg, confirmationMsg, waitOnPartnerSubmissionKey);
  }

  let callback = createCallback(completeCallback.toString(), inprogressCallback.toString(), promptDict[exp].name, exp, promptDict[exp].followups[0]);
  // let callback = createCallback(completeCallback.toString(), inprogressCallback.toString(), promptDict[exp].name, exp);

  // add that new field inside here so that you can add it inside methods.js in the OCEmanager
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
          instruction : promptDict[exp].mood_prompts,
          degraded : promptDict[exp].degradedprompt
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
          instruction : ["Say hello to your partner! \
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

export const createExpExtra = function (pairNum, exp) {
  const completeCallback = function (sub) {
      let userUpdateKey = "participatedInTOSUBWITHKEY";
      let systemMsg = "Woo-hoo! You two have completed TOSUBWITHNAME! TOSUBWITHFOLLOWUPS";
      let notifMsg = "See images from you and your partner\'s TOSUBWITHNAME";
      let waitOnPartnerSubmissionKey = "TOSUBWITHSUBMISSIONKEY";
      let expName = "TOSUBWITHNAME";
      Meteor.call("expCompleteCallback", sub, userUpdateKey, systemMsg, notifMsg, waitOnPartnerSubmissionKey, expName);
  }
  const inprogressCallback = function (sub) {
      let systemMsg = `Your partner just completed TOSUBWITHNAME! `+ 'Participate to see their results when you get a chance'; 
      let notifMsg = `Hey! Your partner just completed TOSUBWITHNAME! ` + 'Share your picture within next 48 hours to complete the experience together!'; 
      let confirmationMsg = "Your submission for TOSUBWITHNAME has been recorded! Your partner hasn't submitted yet, but we'll notify you when they do!";
      let waitOnPartnerSubmissionKey = 'TOSUBWITHSUBMISSIONKEY';
      Meteor.call('expInProgressCallback', sub, systemMsg, notifMsg, confirmationMsg, waitOnPartnerSubmissionKey);
  }

  let callback = createCallback(completeCallback.toString(), inprogressCallback.toString(), promptDict[exp].name, exp, promptDict[exp].followups[0]);
  // let callback = createCallback(completeCallback.toString(), inprogressCallback.toString(), promptDict[exp].name, exp);

  let experience = {
    name: promptDict[exp].name, participateTemplate: 'groupBumped', resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : `${exp}${pairNum} 1`,
        situation : {
          detector : getDetectorUniqueKey(DETECTORS_EXTRA[pairNum][exp]),
          number : 1 
        },
        toPass : {
          situationDescription : promptDict[exp].name,
          instruction : promptDict[exp].mood_prompts,
          degraded : promptDict[exp].degradedprompt
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

export const createSelfIntroExtra = function (pairNum, exp) {
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
          detector : getDetectorUniqueKey(DETECTORS_EXTRA[pairNum][exp]),
          number : 1 
        },
        toPass : {
          situationDescription : '💬Self Introduction💬',
          promptCount: 1,
          instruction : ["Say hello to your partner! \
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

const createIndividualPairExperience = function(pairNum) {
  let exp = {};
  exp['selfIntro'] = createSelfIntro(pairNum, 'selfIntro');
  for (const key in promptDict) {
    exp[key] = createExp(pairNum, key);
  }
  return exp;
}

const createIndividualPairExperienceExtra = function(pairNum) {
  let exp = {};
  exp['selfIntro'] = createSelfIntroExtra(pairNum, 'selfIntro');
  for (const key in promptDict) {
    exp[key] = createExpExtra(pairNum, key);
  }
  return exp;
}

const createAllPairExperience = function() {
  let pair_exp = {}
  for (let i = 1; i <= PAIR_COUNT; i++) {
    let key = `pair${i}`;
    pair_exp[key] = createIndividualPairExperience(key);
  }
  return pair_exp;
}

const createAllPairExperienceExtra = function() {
  let pair_exp = {}
  for (let i = 6; i <= 10; i++) {
    let key = `pair${i}`;
    pair_exp[key] = createIndividualPairExperienceExtra(key);
  }
  return pair_exp;
}

export const PAIR_EXPERIENCES = createAllPairExperience();
export const PAIR_EXPERIENCES_EXTRA = createAllPairExperienceExtra();


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


