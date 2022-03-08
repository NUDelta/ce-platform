import {getDetectorUniqueKey, addStaticAffordanceToNeeds} from "../oce_api_helpers";
import { addContribution, changeExperienceToPass, createExperience } from '../../OCEManager/OCEs/methods';
import { sendSystemMessage, postExpInChat } from '../../Messages/methods';
import {DETECTORS} from "../DETECTORS";

// new experiences ///////////////////////////////////////////////////////

export const createLibraryExp = function () {

  const expCallBack = function (sub) {
    let contributionTypes = Incidents.findOne(sub.iid).contributionTypes;
    let need = contributionTypes.find((x) => {
      return x.needName === sub.needName;
    });

    // Convert Need Name i to Need Name i+1
    let splitName = sub.needName.split(' ');
    let iPlus1 = Number(splitName.pop()) + 1;
    splitName.push(iPlus1);
    let newNeedName = splitName.join(' ');

    need.needName = newNeedName;
    addContribution(sub.iid, need);

    let participants = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).map((submission) => {
      return submission.uid;
    });

    participants.forEach(function(p){
      Meteor.users.update({
        _id: p
      }, {
        $set: {
          ['profile.staticAffordances.participatedInLibraryExp']: true
        }
      });
    });

    let subject = "Library experience completed!";
    let text = "Tap here to view who you bumped into";
    postExpInChat("", participants, sub.eid, sub.iid);
    notify([participants[0]], sub.iid, subject, text, '/chat/' + participants[1]);
    notify([participants[1]], sub.iid, subject, text, '/chat/' + participants[0]);
  };

  let experience = {
    name: '👩‍💻Library Experience🧑‍',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : 'LibraryExp 1',
        situation : {
          detector : getDetectorUniqueKey(DETECTORS.libraryExp),
          number : 1 
        },
        toPass : {
          situationDescription : "Found a study spot you like? Is this where you usually study? Take a picture and share your reason!",
          instruction : " "
        },
        numberNeeded : 2,
        notificationDelay : 1,
        numberAllowedToParticipateAtSameTime: 2,
        allowRepeatContributions : false
      }
    ],
    description: 'Found a study spot you like in the library?',
    notificationText: 'Found a study spot you like in the library?',
    callbacks: [{
        trigger: `(cb.numberOfSubmissions() % 2) === 0`,
        function: expCallBack.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}

export const createRestaurantExp = function () {

  const expCallBack = function (sub) {
    let contributionTypes = Incidents.findOne(sub.iid).contributionTypes;
    let need = contributionTypes.find((x) => {
      return x.needName === sub.needName;
    });

    // Convert Need Name i to Need Name i+1
    let splitName = sub.needName.split(' ');
    let iPlus1 = Number(splitName.pop()) + 1;
    splitName.push(iPlus1);
    let newNeedName = splitName.join(' ');

    need.needName = newNeedName;
    addContribution(sub.iid, need);

    let participants = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).map((submission) => {
      return submission.uid;
    });

    participants.forEach(function(p){
      Meteor.users.update({
        _id: p
      }, {
        $set: {
          ['profile.staticAffordances.participatedInRestaurantExp']: true
        }
      });
    });

    let subject = "Restaurant experience completed!";
    let text = "Tap here to view who you bumped into";
    postExpInChat("", participants, sub.eid, sub.iid);
    notify([participants[0]], sub.iid, subject, text, '/chat/' + participants[1]);
    notify([participants[1]], sub.iid, subject, text, '/chat/' + participants[0]);
  };

  let experience = {
    name: '🍜Restaurant Experience🍝',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : 'RestaurantExp 1',
        situation : {
          detector : getDetectorUniqueKey(DETECTORS.restaurantExp),
          number : 1 
        },
        toPass : {
          situationDescription : "Revisiting a restaurant? Take a picture of what makes you come back again and share your reason!",
          instruction : " "
        },
        numberNeeded : 2,
        notificationDelay : 1,
        numberAllowedToParticipateAtSameTime: 2,
        allowRepeatContributions : false
      }
    ],
    description: 'Revisiting a restaurant? What do you like about the restaurant?',
    notificationText: 'Revisiting a restaurant? What do you like about the restaurant?',
    callbacks: [{
        trigger: `(cb.numberOfSubmissions() % 2) === 0`,
        function: expCallBack.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}

export const createCoffeeExp = function () {

  const expCallBack = function (sub) {
    let contributionTypes = Incidents.findOne(sub.iid).contributionTypes;
    let need = contributionTypes.find((x) => {
      return x.needName === sub.needName;
    });

    // Convert Need Name i to Need Name i+1
    let splitName = sub.needName.split(' ');
    let iPlus1 = Number(splitName.pop()) + 1;
    splitName.push(iPlus1);
    let newNeedName = splitName.join(' ');

    need.needName = newNeedName;
    addContribution(sub.iid, need);

    let participants = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).map((submission) => {
      return submission.uid;
    });

    participants.forEach(function(p){
      Meteor.users.update({
        _id: p
      }, {
        $set: {
          ['profile.staticAffordances.participatedInCoffeeExp']: true
        }
      });
    });

    let subject = "Coffee experience completed!";
    let text = "Tap here to view who you bumped into";
    postExpInChat("", participants, sub.eid, sub.iid);
    notify([participants[0]], sub.iid, subject, text, '/chat/' + participants[1]);
    notify([participants[1]], sub.iid, subject, text, '/chat/' + participants[0]);
  };

  let experience = {
    name: '☕️Coffee Shop Experience🥐',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : 'CoffeeExp 1',
        situation : {
          detector : getDetectorUniqueKey(DETECTORS.coffeeExp),
          number : 1 
        },
        toPass : {
          situationDescription : "Revisiting a cafe? Take a picture of what makes you come back again and share your reason!",
          instruction : " "
        },
        numberNeeded : 2,
        notificationDelay : 1,
        numberAllowedToParticipateAtSameTime: 2,
        allowRepeatContributions : false
      }
    ],
    description: 'Revisiting a cafe? What do you like about the cafe?',
    notificationText: 'Revisiting a cafe? What do you like about the cafe?',
    callbacks: [{
        trigger: `(cb.numberOfSubmissions() % 2) === 0`,
        function: expCallBack.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}

export const createSnackExp = function () {

  const expCallBack = function (sub) {
    let contributionTypes = Incidents.findOne(sub.iid).contributionTypes;
    let need = contributionTypes.find((x) => {
      return x.needName === sub.needName;
    });

    // Convert Need Name i to Need Name i+1
    let splitName = sub.needName.split(' ');
    let iPlus1 = Number(splitName.pop()) + 1;
    splitName.push(iPlus1);
    let newNeedName = splitName.join(' ');

    need.needName = newNeedName;
    addContribution(sub.iid, need);

    let participants = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).map((submission) => {
      return submission.uid;
    });

    participants.forEach(function(p){
      Meteor.users.update({
        _id: p
      }, {
        $set: {
          ['profile.staticAffordances.participatedInSnackExp']: true
        }
      });
    });

    let subject = "Snack experience completed!";
    let text = "Tap here to view who you bumped into";
    postExpInChat("", participants, sub.eid, sub.iid);
    notify([participants[0]], sub.iid, subject, text, '/chat/' + participants[1]);
    notify([participants[1]], sub.iid, subject, text, '/chat/' + participants[0]);
  };

  let experience = {
    name: '🍪Snack Experience🧋',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : 'SnackExp 1',
        situation : {
          detector : getDetectorUniqueKey(DETECTORS.snackExp),
          number : 1 
        },
        toPass : {
          situationDescription : "Grabbing snacks? Have you been here before? Take a picture of what makes you come back again and share your reason!",
          instruction : " "
        },
        numberNeeded : 2,
        notificationDelay : 1,
        numberAllowedToParticipateAtSameTime: 2,
        allowRepeatContributions : false
      }
    ],
    description: 'Grabbing snacks? What do you like about the place?',
    notificationText: 'Grabbing snacks? What do you like about the place?',
    callbacks: [{
        trigger: `(cb.numberOfSubmissions() % 2) === 0`,
        function: expCallBack.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}

export const createGroceryExp = function () {

  const expCallBack = function (sub) {
    let contributionTypes = Incidents.findOne(sub.iid).contributionTypes;
    let need = contributionTypes.find((x) => {
      return x.needName === sub.needName;
    });

    // Convert Need Name i to Need Name i+1
    let splitName = sub.needName.split(' ');
    let iPlus1 = Number(splitName.pop()) + 1;
    splitName.push(iPlus1);
    let newNeedName = splitName.join(' ');

    need.needName = newNeedName;
    addContribution(sub.iid, need);

    let participants = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).map((submission) => {
      return submission.uid;
    });

    participants.forEach(function(p){
      Meteor.users.update({
        _id: p
      }, {
        $set: {
          ['profile.staticAffordances.participatedInGroceryExp']: true
        }
      });
    });

    let subject = "Grocery experience completed!";
    let text = "Tap here to view who you bumped into";
    postExpInChat("", participants, sub.eid, sub.iid);
    notify([participants[0]], sub.iid, subject, text, '/chat/' + participants[1]);
    notify([participants[1]], sub.iid, subject, text, '/chat/' + participants[0]);
  };

  let experience = {
    name: '🍎Groceries Experience🍞',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : 'GroceryExp 1',
        situation : {
          detector : getDetectorUniqueKey(DETECTORS.groceriesExp),
          number : 1 
        },
        toPass : {
          situationDescription : "How was your grocery shopping today? Take a picture of the items you're most excited about in your shopping cart and share your reason!",
          instruction : " "
        },
        numberNeeded : 2,
        notificationDelay : 1,
        numberAllowedToParticipateAtSameTime: 2,
        allowRepeatContributions : false
      }
    ],
    description: 'How was your grocery shopping today?',
    notificationText: 'How was your grocery shopping today?',
    callbacks: [{
        trigger: `(cb.numberOfSubmissions() % 2) === 0`,
        function: expCallBack.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}

export const createWalkExp = function () {

  const expCallBack = function (sub) {
    let contributionTypes = Incidents.findOne(sub.iid).contributionTypes;
    let need = contributionTypes.find((x) => {
      return x.needName === sub.needName;
    });

    // Convert Need Name i to Need Name i+1
    let splitName = sub.needName.split(' ');
    let iPlus1 = Number(splitName.pop()) + 1;
    splitName.push(iPlus1);
    let newNeedName = splitName.join(' ');

    need.needName = newNeedName;
    addContribution(sub.iid, need);

    let participants = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).map((submission) => {
      return submission.uid;
    });

    participants.forEach(function(p){
      Meteor.users.update({
        _id: p
      }, {
        $set: {
          ['profile.staticAffordances.participatedInWalkExp']: true
        }
      });
    });

    let subject = "Walk experience completed!";
    let text = "Tap here to view who you bumped into";
    postExpInChat("", participants, sub.eid, sub.iid);
    notify([participants[0]], sub.iid, subject, text, '/chat/' + participants[1]);
    notify([participants[1]], sub.iid, subject, text, '/chat/' + participants[0]);
  };

  let experience = {
    name: '🚶‍♀️Walk Experience🚶‍',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : 'WalkExp 1',
        situation : {
          detector : getDetectorUniqueKey(DETECTORS.walkExp),
          number : 1 
        },
        toPass : {
          situationDescription : "Notice something interesting or something that makes you happy on your walk today? Take a picture and share it!",
          instruction : " "
        },
        numberNeeded : 2,
        notificationDelay : 1,
        numberAllowedToParticipateAtSameTime: 2,
        allowRepeatContributions : false
      }
    ],
    description: 'How was your walk today?',
    notificationText: 'How was your walk today?',
    callbacks: [{
        trigger: `(cb.numberOfSubmissions() % 2) === 0`,
        function: expCallBack.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}

export const createPublicTransitExp = function () {

  const expCallBack = function (sub) {
    let contributionTypes = Incidents.findOne(sub.iid).contributionTypes;
    let need = contributionTypes.find((x) => {
      return x.needName === sub.needName;
    });

    // Convert Need Name i to Need Name i+1
    let splitName = sub.needName.split(' ');
    let iPlus1 = Number(splitName.pop()) + 1;
    splitName.push(iPlus1);
    let newNeedName = splitName.join(' ');

    need.needName = newNeedName;
    addContribution(sub.iid, need);

    let participants = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).map((submission) => {
      return submission.uid;
    });

    participants.forEach(function(p){
      Meteor.users.update({
        _id: p
      }, {
        $set: {
          ['profile.staticAffordances.participatedInPublicTransportExp']: true
        }
      });
    });

    let subject = "Public transport experience completed!";
    let text = "Tap here to view who you bumped into";
    postExpInChat("", participants, sub.eid, sub.iid);
    notify([participants[0]], sub.iid, subject, text, '/chat/' + participants[1]);
    notify([participants[1]], sub.iid, subject, text, '/chat/' + participants[0]);
  };

  let experience = {
    name: '🚈Public Transportation Experience🚂',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : 'PublicTransportExp 1',
        situation : {
          detector : getDetectorUniqueKey(DETECTORS.publicTransportExp),
          number : 1 
        },
        toPass : {
          situationDescription : "Heading somewhere? What do you do to pass time on public transit and why?",
          instruction : " "
        },
        numberNeeded : 2,
        notificationDelay : 1,
        numberAllowedToParticipateAtSameTime: 2,
        allowRepeatContributions : false
      }
    ],
    description: 'Heading somewhere?',
    notificationText: 'Heading somewhere?',
    callbacks: [{
        trigger: `(cb.numberOfSubmissions() % 2) === 0`,
        function: expCallBack.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}

export const createParkExp = function () {

  const expCallBack = function (sub) {
    let contributionTypes = Incidents.findOne(sub.iid).contributionTypes;
    let need = contributionTypes.find((x) => {
      return x.needName === sub.needName;
    });

    // Convert Need Name i to Need Name i+1
    let splitName = sub.needName.split(' ');
    let iPlus1 = Number(splitName.pop()) + 1;
    splitName.push(iPlus1);
    let newNeedName = splitName.join(' ');

    need.needName = newNeedName;
    addContribution(sub.iid, need);

    let participants = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).map((submission) => {
      return submission.uid;
    });

    participants.forEach(function(p){
      Meteor.users.update({
        _id: p
      }, {
        $set: {
          ['profile.staticAffordances.participatedInParkExp']: true
        }
      });
    });

    let subject = "Park experience completed!";
    let text = "Tap here to view who you bumped into";
    postExpInChat("", participants, sub.eid, sub.iid);
    notify([participants[0]], sub.iid, subject, text, '/chat/' + participants[1]);
    notify([participants[1]], sub.iid, subject, text, '/chat/' + participants[0]);
  };

  let experience = {
    name: '🌳Park Experience🌳',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : 'PublicTransportExp 1',
        situation : {
          detector : getDetectorUniqueKey(DETECTORS.parkExp),
          number : 1 
        },
        toPass : {
          situationDescription : "Enjoying your time at the park? Have you been here before? Take a picture of what makes you come back again and share your reason!",
          instruction : " "
        },
        numberNeeded : 2,
        notificationDelay : 1,
        numberAllowedToParticipateAtSameTime: 2,
        allowRepeatContributions : false
      }
    ],
    description: 'How was your time at the park?',
    notificationText: 'How was your time at the park?',
    callbacks: [{
        trigger: `(cb.numberOfSubmissions() % 2) === 0`,
        function: expCallBack.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}


// new experiences ///////////////////////////////////////////////////////

const createTestExperience = function() {
  return {
    libraryExp: createLibraryExp(),
    restaurantExp: createRestaurantExp(),
    coffeeExp: createCoffeeExp(),
    snackExp: createSnackExp(),
    groceryExp: createGroceryExp(),
    walkExp: createWalkExp(),
    publicTransportExp: createPublicTransitExp(),
    parkExp: createParkExp()
  }
}
export default PAIR_EXPERIENCES = createTestExperience()



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


