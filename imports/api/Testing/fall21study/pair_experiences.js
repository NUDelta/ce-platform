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
    let message = 'Woo-hoo! You two have completed the self intro! Tap here to see your results.'; //how do I change this so that it doesn't show up until both people finish?

    sendSystemMessage(message, participants, route); 
    notify(participants, sub.iid, 'See images from you and your partner\'s self intro!', '', route);
  }

  const selfIntroCallback = function (sub) {
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).fetch();

    let participantId = submissions.map((submission) => { return submission.uid; });
    let participant = Meteor.users.findOne(participantId[0])
    let aff = participant.profile.staticAffordances;
    let pair = Object.keys(aff).filter(k => k.search('pair') != -1)[0];
    let partner = Meteor.users.find().fetch().filter(
      u => (u._id != participantId[0])
      && (pair in u.profile.staticAffordances)
    )
    partner = partner.map(u => u._id)

    let message = 'Your partner just participated in the self-intro activity!'; 
    sendSystemMessage(message, partner, "/chat"); 
    Meteor.call('sendNotification', partner, "Hey there! " + message, '');
  }

  let experience = {
    name: 'Self Introduction👋',
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
      },
      {
        trigger: `!(cb.needFinished('SelfIntro${pairNum}'))`,
        function: selfIntroCallback.toString(),
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
    notify(participants, sub.iid, 'See images from you and your partner\'s walk experience!', '', route);
  }

  
  const walkCallback = function (sub) {
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).fetch();

    let participantId = submissions.map((submission) => { return submission.uid; });
    let participant = Meteor.users.findOne(participantId[0])
    let aff = participant.profile.staticAffordances;
    let pair = Object.keys(aff).filter(k => k.search('pair') != -1)[0];
    let partner = Meteor.users.find().fetch().filter(
      u => (u._id != participantId[0])
      && (pair in u.profile.staticAffordances)
    )
    partner = partner.map(u => u._id)

    let message = 'Your partner just participated in the walk experience!'; 
    sendSystemMessage(message, partner, "/chat"); 
    Meteor.call('sendNotification', partner, "Hey there! " + message, '');
  }

  let experience = {
    name: '🚶‍♀️Walk Experience🚶‍♂️',
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
      }, {
        trigger: `!(cb.needFinished('Walk${pairNum}'))`,
        function: walkCallback.toString(),
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
    notify(participants, sub.iid, 'See images from you and your partner\'s library experience!', '', route);
  }

  const libraryExpCallback = function (sub) {
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).fetch();
  
    let participantId = submissions.map((submission) => { return submission.uid; });
    let participant = Meteor.users.findOne(participantId[0])
    let aff = participant.profile.staticAffordances;
    let pair = Object.keys(aff).filter(k => k.search('pair') != -1)[0];
    let partner = Meteor.users.find().fetch().filter(
      u => (u._id != participantId[0])
      && (pair in u.profile.staticAffordances)
    )
    partner = partner.map(u => u._id)
  
    let message = 'Your partner just participated in the library experience!'; 
    sendSystemMessage(message, partner, "/chat"); 
    Meteor.call('sendNotification', partner, "Hey there! " + message, '');
  }

  let experience = {
    name: '📚Library Experience📚',
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
      }, {
        trigger: `!(cb.needFinished('Library${pairNum}'))`,
        function: libraryExpCallback.toString(),
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

  const groceriesExpCallback = function (sub) {
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).fetch();
  
    let participantId = submissions.map((submission) => { return submission.uid; });
    let participant = Meteor.users.findOne(participantId[0])
    let aff = participant.profile.staticAffordances;
    let pair = Object.keys(aff).filter(k => k.search('pair') != -1)[0];
    let partner = Meteor.users.find().fetch().filter(
      u => (u._id != participantId[0])
      && (pair in u.profile.staticAffordances)
    )
    partner = partner.map(u => u._id)
  
    let message = 'Your partner just participated in the groceries experience!'; 
    sendSystemMessage(message, partner, "/chat"); 
    Meteor.call('sendNotification', partner, "Hey there! " + message, '');
  }

  let experience = {
    name: '🛒Groceries Experience🛒',
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
      }, {
        trigger: `!(cb.needFinished('Groceries${pairNum}'))`,
        function: groceriesExpCallback.toString(),
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

  const restaurantExpCallback = function (sub) {
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).fetch();
  
    let participantId = submissions.map((submission) => { return submission.uid; });
    let participant = Meteor.users.findOne(participantId[0])
    let aff = participant.profile.staticAffordances;
    let pair = Object.keys(aff).filter(k => k.search('pair') != -1)[0];
    let partner = Meteor.users.find().fetch().filter(
      u => (u._id != participantId[0])
      && (pair in u.profile.staticAffordances)
    )
    partner = partner.map(u => u._id)
  
    let message = 'Your partner just participated in the restaurant experience!'; 
    sendSystemMessage(message, partner, "/chat"); 
    Meteor.call('sendNotification', partner, "Hey there! " + message, '');
  }
  

  let experience = {
    name: '🍜Restaurant Experience🍝',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : `Restaur${pairNum}`,
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
        trigger: `(cb.needFinished('Restaur${pairNum}'))`,
        function: restaurantExpCompleteCallback.toString(),
      }, {
        trigger: `!(cb.needFinished('Restaur${pairNum}'))`,
        function: restaurantExpCallback.toString(),
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
        needName : `PubTrans${pairNum}`,
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
        trigger: `(cb.needFinished('PubTrans${pairNum}'))`,
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


