import {getDetectorUniqueKey, addStaticAffordanceToNeeds} from "../oce_api_helpers";
import { addContribution, changeExperienceToPass } from '../../OCEManager/OCEs/methods';
import { sendSystemMessage } from '../../Messages/methods';
import {DETECTORS} from "../DETECTORS";

// new experiences ///////////////////////////////////////////////////////
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
    let message = 'Woo-hoo! You two have completed the Walk experience! Tap here to see your results.';

    sendSystemMessage(message, participants, route);
    notify(participants, sub.iid, 'See images from your walk experience!', '', route);
  }

  let experience = {
    name: 'Group Bumped - Walk',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : "Walk",
        situation : {
          detector : getDetectorUniqueKey(DETECTORS[pairNum].walk),
          number : 1 
        },
        toPass : {
          situationDescription : "Enjoying your walk today?",
          instruction : "Pick out and take a picture of a piece of nature around you that makes you happy! Caption your picture with what about it sparks joy"
        },
        numberNeeded : 2,
        notificationDelay : 1,
        numberAllowedToParticipateAtSameTime: 3,
        allowRepeatContributions : false
      }
    ],
    description: 'Share your experience with your friend and their friend!',
    notificationText: 'Share your experience with your friend and their friend!',
    callbacks: [{
        trigger: `(cb.needFinished('walk'))`,
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
        needName : "Library",
        situation : {
          detector : getDetectorUniqueKey(DETECTORS[pairNum].library),
          number : 1
        },
        toPass : {
          situationDescription : "Enjoying your study session today?",
          instruction : "Working on something outside home? Show us something cool (or motivating) around your study space that is keeping you going (or focused)? Caption it with why it motivates you!"
        },
        numberNeeded : 2,
        notificationDelay : 1,
        numberAllowedToParticipateAtSameTime: 3,
        allowRepeatContributions : false
      }
    ],
    description: 'Share your experience with your friend and their friend!',
    notificationText: 'Share your experience with your friend and their friend!',
    callbacks: [{
        trigger: `(cb.needFinished('library'))`,
        function: libraryExpCompleteCallback.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}

const TRIADIC_EXPERIENCES_ONE = {
  walkExperience: createWalk("pair1"),
  libraryExperience: createLibraryExp("pair1"),
  // groceriesExperience: createGroceriesExp(),
  // restaurantExperience: createRestaurantExp()

}
const TRIADIC_EXPERIENCES_TWO = {
  walkExperience: createWalk("pair2"),
  libraryExperience: createLibraryExp("pair2"),
}
const TRIADIC_EXPERIENCES_THREE = {
  walkExperience: createWalk("pair3"),
  libraryExperience: createLibraryExp("pair3"),
}

export const TRIADIC_EXPERIENCES = {
  'pair1': TRIADIC_EXPERIENCES_ONE,
  'pair2': TRIADIC_EXPERIENCES_TWO,
  'pair3': TRIADIC_EXPERIENCES_THREE
}

// export const createGroceriesExp = function () {
//   const groceriesExpCompleteCallback = function (sub) {
//     let submissions = Submissions.find({
//       iid: sub.iid,
//       needName: sub.needName
//     }).fetch();

//     let participants = submissions.map((submission) => { return submission.uid; });

//     participants.forEach(function(p){
//       Meteor.users.update({
//         _id: p
//       }, {
//         $set: {
//           ['profile.staticAffordances.participatedInGroceriesExp']: true
//         }
//       });
//     });

//     let route = `/apicustomresults/${sub.iid}/${sub.eid}`;
//     let message = 'Woo-hoo! You two have completed the Groceries experience! Tap here to see your results.';

//     sendSystemMessage(message, participants, route);
//     notify(participants, sub.iid, 'See images from your groceries experience!', '', route);
//   }

//   let experience = {
//     name: 'Group Bumped - Groceries',
//     participateTemplate: 'groupBumped',
//     resultsTemplate: 'groupBumpedResults',
//     contributionTypes: [
//       {
//         needName : "Groceries",
//         situation : {
//           detector : getDetectorUniqueKey(DETECTORS.groceries_triad1),
//           number : 1
//         },
//         toPass : {
//           situationDescription : "Enjoying your grocery shopping today?",
//           instruction : "What is your game plan for shopping for food? Show us what ingredients you’re using! Caption your picture with your plan!"
//         },
//         numberNeeded : 2,
//         notificationDelay : 1,
//         numberAllowedToParticipateAtSameTime: 3,
//         allowRepeatContributions : false
//       }
//     ],
//     description: 'Share your experience with your friend and their friend!',
//     notificationText: 'Share your experience with your friend and their friend!',
//     callbacks: [{
//         trigger: `(cb.needFinished('groceries'))`,
//         function: groceriesExpCompleteCallback.toString(),
//       }
//     ],
//     allowRepeatContributions: false,
//   };

//   return experience;
// }

// export const createRestaurantExp = function () {
//   const restaurantExpCompleteCallback = function (sub) {
//     let submissions = Submissions.find({
//       iid: sub.iid,
//       needName: sub.needName
//     }).fetch();

//     let participants = submissions.map((submission) => { return submission.uid; });

//     participants.forEach(function(p){
//       Meteor.users.update({
//         _id: p
//       }, {
//         $set: {
//           ['profile.staticAffordances.participatedInRestaurantExp']: true
//         }
//       });
//     });

//     let route = `/apicustomresults/${sub.iid}/${sub.eid}`;
//     let message = 'Woo-hoo! You two have completed the Restaurant experience! Tap here to see your results.';

//     sendSystemMessage(message, participants, route);
//     notify(participants, sub.iid, 'See images from your restaurant experience!', '', route);
//   }

//   let experience = {
//     name: 'Group Bumped - Restaurant',
//     participateTemplate: 'groupBumped',
//     resultsTemplate: 'groupBumpedResults',
//     contributionTypes: [
//       {
//         needName : "Restaurant",
//         situation : {
//           detector : getDetectorUniqueKey(DETECTORS.restaurant_triad1),
//           number : 1
//         },
//         toPass : {
//           situationDescription : "Enjoying your food and ambience of the restaurant?",
//           instruction : "Where are you sitting in the restaurant? Why? Take a picture of your place and tell us your reason!"
//         },
//         numberNeeded : 2,
//         notificationDelay : 1,
//         numberAllowedToParticipateAtSameTime: 3,
//         allowRepeatContributions : false
//       }
//     ],
//     description: 'Share your experience with your friend and their friend!',
//     notificationText: 'Share your experience with your friend and their friend!',
//     callbacks: [{
//         trigger: `(cb.needFinished('restaurant'))`,
//         function: restaurantExpCompleteCallback.toString(),
//       }
//     ],
//     allowRepeatContributions: false,
//   };

//   return experience;
// }

// export const createGymExp = function () {
//   const gymExpCompleteCallback = function (sub) {
//     let submissions = Submissions.find({
//       iid: sub.iid,
//       needName: sub.needName
//     }).fetch();

//     let participants = submissions.map((submission) => { return submission.uid; });

//     participants.forEach(function(p){
//       Meteor.users.update({
//         _id: p
//       }, {
//         $set: {
//           ['profile.staticAffordances.participatedInGymExp']: true
//         }
//       });
//     });

//     let route = `/apicustomresults/${sub.iid}/${sub.eid}`;
//     let message = 'Woo-hoo! You two have completed the Gym experience! Tap here to see your results.';

//     sendSystemMessage(message, participants, route);
//     notify(participants, sub.iid, 'See images from your gym experience!', '', route);
//   }

//   let experience = {
//     name: 'Group Bumped - gym',
//     participateTemplate: 'groupBumped',
//     resultsTemplate: 'groupBumpedResults',
//     contributionTypes: [
//       {
//         needName : "gym",
//         situation : {
//           detector : getDetectorUniqueKey(DETECTORS.gym_triad1),
//           number : 1
//         },
//         toPass : {
//           situationDescription : "Enjoy your workout session at the gym today?",
//           instruction : "Where did you do today? Why? Take a picture of your place and tell us your reason!"
//         },
//         numberNeeded : 2,
//         notificationDelay : 1,
//         numberAllowedToParticipateAtSameTime: 3,
//         allowRepeatContributions : false
//       }
//     ],
//     description: 'Share your experience with your friend and their friend!',
//     notificationText: 'Share your experience with your friend and their friend!',
//     callbacks: [{
//         trigger: `(cb.needFinished('gym'))`,
//         function: gymExpCompleteCallback.toString(),
//       }
//     ],
//     allowRepeatContributions: false,
//   };

//   return experience;
// }

// new experiences ///////////////////////////////////////////////////////



