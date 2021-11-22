import {getDetectorUniqueKey, addStaticAffordanceToNeeds} from "../oce_api_helpers";
import { addContribution, changeExperienceToPass } from '../../OCEManager/OCEs/methods';
import { sendSystemMessage } from '../../Messages/methods';
import {DETECTORS} from "../DETECTORS";


// new experiences ///////////////////////////////////////////////////////

export const createSelfIntro = function (pairNum) {
  const selfIntroCompleteCallback = function (sub) {
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
          ['profile.staticAffordances.participatedInSelfIntro']: true
        }
      });
    });

    let route = `/apicustomresults/${sub.iid}/${sub.eid}`;
    let message = 'Woo-hoo! You have completed the self intro! Tap here to see your results.'; //how do I change this so that it doesn't show up until both people finish?

    sendSystemMessage(message, participants, route); 
    notify(participants, sub.iid, 'See images from your self intro!', '', route);
  }

  let experience = {
    name: 'Group Bumped - Self Introduction',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : `SelfIntro${pairNum}`,
        situation : {
          detector : getDetectorUniqueKey(DETECTORS[pairNum].selfIntroExp),
          number : 1 
        },
        toPass : {
          situationDescription : "Welcome to collective experience study!",
          instruction : "Say hello to your partner for the next 4 days! \
          Share a picture of yourself or something that's representative of you, and tell your partner about yourself!"
        },
        numberNeeded : 2,
        notificationDelay : 1,
        numberAllowedToParticipateAtSameTime: 2,
        allowRepeatContributions : false
      }
    ],
    description: 'Share your experience with your new friend!',
    notificationText: 'Share your experience with your new friend!',
    callbacks: [{
        trigger: `(cb.needFinished('SelfIntro${pairNum}'))`,
        function: selfIntroCompleteCallback.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}

export const createWalk = function (pairNum) {
  const walkCompleteCallback = function (sub) {
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
          ['profile.staticAffordances.participatedInWalk']: true
        }
      });
    });

    let route = `/apicustomresults/${sub.iid}/${sub.eid}`;
    let message = 'Woo-hoo! You two have completed the Walk experience! Tap here to see your results.'; //how do I change this so that it doesn't show up until both people finish?

    sendSystemMessage(message, participants, route); 
    notify(participants, sub.iid, 'See images from your walk experience!', '', route);
  }

  let experience = {
    name: 'Group Bumped - Walk',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : `Walk${pairNum}`,
        situation : {
          detector : getDetectorUniqueKey(DETECTORS[pairNum].walkExp),
          number : 1 
        },
        toPass : {
          situationDescription : "Enjoying your walk today?",
          instruction : "Pick out and take a picture of a piece of nature around you that makes you happy! Caption your picture with what about it sparks joy"
        },
        numberNeeded : 2,
        notificationDelay : 60,
        numberAllowedToParticipateAtSameTime: 1,
        allowRepeatContributions : false
      }
    ],
    description: 'Share your experience with your friend and their friend!',
    notificationText: 'Share your experience with your friend and their friend!',
    callbacks: [{
        trigger: `(cb.needFinished('Walk${pairNum}'))`,
        function: walkCompleteCallback.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}


export const createLibraryExp = function (pairNum) {
  const libraryExpCompleteCallback = function (sub) {
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
          ['profile.staticAffordances.participatedInLibraryExp']: true
        }
      });
    });

    let route = `/apicustomresults/${sub.iid}/${sub.eid}`;
    let message = 'Woo-hoo! You two have completed the Library experience! Tap here to see your results.';

    sendSystemMessage(message, participants, route);
    notify(participants, sub.iid, 'See images from your library experience!', '', route);
  }

  let experience = {
    name: 'Group Bumped - Library',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : `Library${pairNum}`,
        situation : {
          detector : getDetectorUniqueKey(DETECTORS[pairNum].libraryExp),
          number : 1
        },
        toPass : {
          situationDescription : "Enjoying your study session today?",
          instruction : "Working on something outside home? Show us something cool (or motivating) around your study space that is keeping you going (or focused)? Caption it with why it motivates you!"
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
        trigger: `(cb.needFinished('Library${pairNum}'))`,
        function: libraryExpCompleteCallback.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}

export const createGroceriesExp = function (pairNum) {
  const groceriesExpCompleteCallback = function (sub) {
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
          ['profile.staticAffordances.participatedInGroceriesExp']: true
        }
      });
    });

    let route = `/apicustomresults/${sub.iid}/${sub.eid}`;
    let message = 'Woo-hoo! You two have completed the Groceries experience! Tap here to see your results.';

    sendSystemMessage(message, participants, route);
    notify(participants, sub.iid, 'See images from your groceries experience!', '', route);
  }

  let experience = {
    name: 'Group Bumped - Groceries',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : `Groceries${pairNum}`,
        situation : {
          detector : getDetectorUniqueKey(DETECTORS[pairNum].groceriesExp),
          number : 1
        },
        toPass : {
          situationDescription : "Enjoying your grocery shopping today?",
          instruction : "What is your game plan for shopping for food? Show us what ingredients you’re using! Caption your picture with your plan!"
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
        trigger: `(cb.needFinished('Groceries${pairNum}'))`,
        function: groceriesExpCompleteCallback.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}

export const createRestaurantExp = function (pairNum) {
  const restaurantExpCompleteCallback = function (sub) {
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
          ['profile.staticAffordances.participatedInRestaurantExp']: true
        }
      });
    });

    let route = `/apicustomresults/${sub.iid}/${sub.eid}`;
    let message = 'Woo-hoo! You two have completed the Restaurant experience! Tap here to see your results.';

    sendSystemMessage(message, participants, route);
    notify(participants, sub.iid, 'See images from your restaurant experience!', '', route);
  }

  let experience = {
    name: 'Group Bumped - Restaurant',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : `Restaurant${pairNum}`,
        situation : {
          detector : getDetectorUniqueKey(DETECTORS[pairNum].restaurantExp),
          number : 1
        },
        toPass : {
          situationDescription : "Enjoying your food and ambience of the restaurant?",
          instruction : "Where are you sitting in the restaurant? Why? Take a picture of your place and tell us your reason!"
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
        trigger: `(cb.needFinished('Restaurant${pairNum}'))`,
        function: restaurantExpCompleteCallback.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}

export const createGymExp = function (pairNum) {
  const gymExpCompleteCallback = function (sub) {
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
          ['profile.staticAffordances.participatedInGymExp']: true
        }
      });
    });

    let route = `/apicustomresults/${sub.iid}/${sub.eid}`;
    let message = 'Woo-hoo! You two have completed the Gym experience! Tap here to see your results.';

    sendSystemMessage(message, participants, route);
    notify(participants, sub.iid, 'See images from your gym experience!', '', route);
  }

  let experience = {
    name: 'Group Bumped - Gym',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : `Gym${pairNum}`,
        situation : {
          detector : getDetectorUniqueKey(DETECTORS[pairNum].gymExp),
          number : 1
        },
        toPass : {
          situationDescription : "Enjoy your workout session at the gym today?",
          instruction : "How was your workout session today? What keeps you motivated to workout and why? Take a picture of the gym or your motivation and share it with your partner!"
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
        trigger: `(cb.needFinished('Gym${pairNum}'))`,
        function: gymExpCompleteCallback.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}

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

export const createPublicTransportExp = function (pairNum) {
  const publicTransportExpCompleteCallback = function (sub) {
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
          ['profile.staticAffordances.participatedInPublicTransportExp']: true
        }
      });
    });

    let route = `/apicustomresults/${sub.iid}/${sub.eid}`;
    let message = 'Woo-hoo! You two have completed the Public Transportation experience! Tap here to see your results.';

    sendSystemMessage(message, participants, route);
    notify(participants, sub.iid, 'See images from your public transportation experience!', '', route);
  }

  let experience = {
    name: 'Group Bumped - Public Transportation',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : `PublicTrans${pairNum}`,
        situation : {
          detector : getDetectorUniqueKey(DETECTORS[pairNum].publicTransportExp),
          number : 1
        },
        toPass : {
          situationDescription : "Where are you going?",
          instruction : "Take a picture of the view outside the window and share where you are heading to today! What do you do to pass time on public transportation and why?"
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
        trigger: `(cb.needFinished('PublicTrans${pairNum}'))`,
        function: publicTransportExpCompleteCallback.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}

// new experiences ///////////////////////////////////////////////////////

const creatPairExperience = function(pairNum) {
  return {
    selfIntroExperience: createSelfIntro(pairNum),
    walkExperience: createWalk(pairNum),
    libraryExperience: createLibraryExp(pairNum),
    groceriesExperience: createGroceriesExp(pairNum),
    restaurantExperience: createRestaurantExp(pairNum),
    publicTransportExperience: createPublicTransportExp(pairNum)
  }
}

export default PAIR_EXPERIENCES = {
  pair1: creatPairExperience("pair1"),
  pair2: creatPairExperience("pair2"),
  pair3: creatPairExperience("pair3"),
  pair4: creatPairExperience("pair4"),
  pair5: creatPairExperience("pair5"),
  pair6: creatPairExperience("pair6")
}


