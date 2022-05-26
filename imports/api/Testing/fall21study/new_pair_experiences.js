import {getDetectorUniqueKey, addStaticAffordanceToNeeds} from "../oce_api_helpers";
import { addContribution, changeExperienceToPass } from '../../OCEManager/OCEs/methods';
import { sendSystemMessage } from '../../Messages/methods';
import {DETECTORS} from "../DETECTORS";


// new experiences ///////////////////////////////////////////////////////


export const createWalk2 = function (pairNum) {
  const walkCompleteCallback2 = function (sub) {
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
          ['profile.staticAffordances.participatedInWalk2']: true
        }
      });
    });

    let route = `/apicustomresults/${sub.iid}/${sub.eid}`;
    let message = 'Woo-hoo! You two have completed another Walk experience! Tap here to see your results and share what you think!'; //how do I change this so that it doesn't show up until both people finish?

    sendSystemMessage(message, participants, route); 
    notify(participants, sub.iid, 'See images from you and your partner\'s walk experience!', '', route);
  }

  
  const walkCallback2 = function (sub) {
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

    let systemMessage = 'Your partner just completed another Walk Experience! Participate to see their results when you get a chance🚶‍♂️'; 
    let notifMessage = "Hey! Your partner just completed another Walk Experience🚶‍♂️"

    sendSystemMessage(systemMessage, partner, "/chat"); 
    Meteor.call('sendNotification', partner, notifMessage, '/chat');
  }

  let experience = {
    name: '🚶‍♀️Walk Experience - 2🚶‍♂️',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : `Walk${pairNum}2`,
        situation : {
          detector : getDetectorUniqueKey(DETECTORS[pairNum].walkExp2),
          number : 1 
        },
        toPass : {
          situationDescription : "Enjoying your walk today?",
          instruction : "Notice something interesting or different during your walk? Or something that makes you happy? Caption your picture and share it with your partner!"
        },
        numberNeeded : 2,
        notificationDelay : 60,
        numberAllowedToParticipateAtSameTime: 1,
        allowRepeatContributions : false
      }
    ],
    description: 'Share your walk experience with your new friend!',
    notificationText: 'Share your walk experience with your new friend!',
    callbacks: [{
        trigger: `(cb.needFinished('Walk${pairNum}2'))`,
        function: walkCompleteCallback2.toString(),
      }, {
        trigger: `!(cb.needFinished('Walk${pairNum}2'))`,
        function: walkCallback2.toString(),
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
    let message = 'Woo-hoo! You two have completed another Library experience! Tap here to see your results and share what you think!';

    sendSystemMessage(message, participants, route);
    notify(participants, sub.iid, 'See images from you and your partner\'s library experience!', '', route);
  }

  const libraryExpCallback2 = function (sub) {
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

    let systemMessage = 'Your partner just completed another Library Experience! Participate to see their results when you get a chance🧑‍💻'; 
    let notifMessage = "Hey! Your partner just completed another Library Experience🧑‍💻"
  
    sendSystemMessage(systemMessage, partner, "/chat"); 
    Meteor.call('sendNotification', partner, notifMessage, '/chat');
  }

  let experience = {
    name: '👩‍💻Library Experience - 2🧑‍💻',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : `Library${pairNum}2`,
        situation : {
          detector : getDetectorUniqueKey(DETECTORS[pairNum].libraryExp2),
          number : 1
        },
        toPass : {
          situationDescription : "Trying to get through the last week of the quarter?",
          instruction : "How have the last few weeks of Fall quarter been for you? How do you keep yourself motivated till the end? Take a picture and share it with your partner!"
        },
        numberNeeded : 2,
        notificationDelay : 600,
        numberAllowedToParticipateAtSameTime: 3,
        allowRepeatContributions : false
      }
    ],
    description: 'Share your library experience with your new friend!',
    notificationText: 'Share your library experience with your new friend!',
    callbacks: [{
        trigger: `(cb.needFinished('Library${pairNum}2'))`,
        function: libraryExpCompleteCallback2.toString(),
      }, {
        trigger: `!(cb.needFinished('Library${pairNum}2'))`,
        function: libraryExpCallback2.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}

export const createGroceriesExp2 = function (pairNum) {
  const groceriesExpCompleteCallback2 = function (sub) {
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
          ['profile.staticAffordances.participatedInGroceriesExp2']: true
        }
      });
    });

    let route = `/apicustomresults/${sub.iid}/${sub.eid}`;
    let message = 'Woo-hoo! You two have completed another Groceries experience! Tap here to see your results and share what you think!';

    sendSystemMessage(message, participants, route);
    notify(participants, sub.iid, 'See images from you and your partner\'s groceries experience!', '', route);
  }

  const groceriesExpCallback2 = function (sub) {
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

    let systemMessage = 'Your partner just completed another Groceries Experience! Participate to see their results when you get a chance🛒'; 
    let notifMessage = "Hey! Your partner just completed another Groceries Experience🛒"
  
    sendSystemMessage(systemMessage, partner, "/chat"); 
    Meteor.call('sendNotification', partner, notifMessage, '/chat');
  }

  let experience = {
    name: '🍎Groceries Experience - 2🍞',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : `Groceries${pairNum}2`,
        situation : {
          detector : getDetectorUniqueKey(DETECTORS[pairNum].groceriesExp2),
          number : 1
        },
        toPass : {
          situationDescription : "Enjoying your grocery shopping today?",
          instruction : "How has your shopping plan changed this time? Show us what ingredients you’re using or interesting things you've noticed during your grocery shopping today! Caption your picture with your plan!"
        },
        numberNeeded : 2,
        notificationDelay : 180,
        numberAllowedToParticipateAtSameTime: 3,
        allowRepeatContributions : false
      }
    ],
    description: 'Share your groceries experience with your new friend!',
    notificationText: 'Share your groceries experience with your new friend!',
    callbacks: [{
        trigger: `(cb.needFinished('Groceries${pairNum}2'))`,
        function: groceriesExpCompleteCallback2.toString(),
      }, {
        trigger: `!(cb.needFinished('Groceries${pairNum}2'))`,
        function: groceriesExpCallback2.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}

export const createRestaurantExp2 = function (pairNum) {
  const restaurantExpCompleteCallback2 = function (sub) {
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
          ['profile.staticAffordances.participatedInRestaurantExp2']: true
        }
      });
    });

    let route = `/apicustomresults/${sub.iid}/${sub.eid}`;
    let message = 'Woo-hoo! You two have completed another Restaurant experience! Tap here to see your results and share what you think!';

    sendSystemMessage(message, participants, route);
    notify(participants, sub.iid, 'See images from you and your partner\'s restaurant experience!', '', route);
  }

  const restaurantExpCallback2 = function (sub) {
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
    let systemMessage = 'Your partner just completed another Restaurant Experience! Participate to see their results when you get a chance🍝'; 
    let notifMessage = "Hey! Your partner just completed another Restaurant Experience🍝 "
  
    sendSystemMessage(systemMessage, partner, "/chat"); 
    Meteor.call('sendNotification', partner, notifMessage, '/chat');
  }
  

  let experience = {
    name: '🍜Restaurant Experience - 2🍝',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : `Restaur${pairNum}2`,
        situation : {
          detector : getDetectorUniqueKey(DETECTORS[pairNum].restaurantExp2),
          number : 1
        },
        toPass : {
          situationDescription : "Enjoying your food and ambience of the restaurant?",
          instruction : "How was your restaurant experience different from the previous one? What did you order this time and why? Take a picture of your place and share with your partner!"
        },
        numberNeeded : 2,
        notificationDelay : 300,
        numberAllowedToParticipateAtSameTime: 3,
        allowRepeatContributions : false
      }
    ],
    description: 'Share your restaurant experience with your new friend!',
    notificationText: 'Share your restaurant experience with your new friend!',
    callbacks: [{
        trigger: `(cb.needFinished('Restaur${pairNum}2'))`,
        function: restaurantExpCompleteCallback2.toString(),
      }, {
        trigger: `!(cb.needFinished('Restaur${pairNum}2'))`,
        function: restaurantExpCallback2.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}


export const createPublicTransportExp2 = function (pairNum) {
  const publicTransportExpCompleteCallback2 = function (sub) {
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
          ['profile.staticAffordances.participatedInPublicTransportExp2']: true
        }
      });
    });

    let route = `/apicustomresults/${sub.iid}/${sub.eid}`;
    let message = 'Woo-hoo! You two have completed another Public Transportation experience! Tap here to see your results and share what you think!';

    sendSystemMessage(message, participants, route);
    notify(participants, sub.iid, 'See images from you and your partner\'s public transportation experience!', '', route);
  }

  const publicTransportExpCallback2 = function (sub) {
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
    let systemMessage = 'Your partner just completed another Public Transportation Experience! Participate to see their results when you get a chance🚂'; 
    let notifMessage = "Hey! Your partner just completed another Public Transportation Experience🚂 "
  
    sendSystemMessage(systemMessage, partner, "/chat"); 
    Meteor.call('sendNotification', partner, notifMessage, '');
  }

  let experience = {
    name: '🚈Public Transportation Experience - 2🚂',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : `PubTrans${pairNum}`,
        situation : {
          detector : getDetectorUniqueKey(DETECTORS[pairNum].publicTransportExp2),
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
    description: 'Share your public transportation experience with your new friend!',
    notificationText: 'Share your public transportation experience with your new friend!',
    callbacks: [{
        trigger: `(cb.needFinished('PubTrans${pairNum}2'))`,
        function: publicTransportExpCompleteCallback2.toString(),
      },
      {
        trigger: `!(cb.needFinished('PubTrans${pairNum}2'))`,
        function: publicTransportExpCallback2.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}

export const createCoffeeExp2 = function (pairNum) {
  const coffeeExpCompleteCallback2 = function (sub) {
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
          ['profile.staticAffordances.participatedInCoffeeExp2']: true
        }
      });
    });

    let route = `/apicustomresults/${sub.iid}/${sub.eid}`;
    let message = 'Woo-hoo! You two have completed another Coffee Shop experience! Tap here to see your results and share what you think!';

    sendSystemMessage(message, participants, route);
    notify(participants, sub.iid, 'See images from you and your partner\'s coffee shop experience!', '', route);
  }

  const coffeeExpCallback2 = function (sub) {
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
    let systemMessage = 'Your partner just completed another Coffee Shop Experience! Participate to see their results when you get a chance☕️'; 
    let notifMessage = "Hey! Your partner just completed another Coffee Shop Experience☕️"
  
    sendSystemMessage(systemMessage, partner, "/chat"); 
    Meteor.call('sendNotification', partner, notifMessage, '/chat');
  }

  let experience = {
    name: '☕️Coffee Shop Experience - 2🥐',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : `coffee${pairNum}2`,
        situation : {
          detector : getDetectorUniqueKey(DETECTORS[pairNum].coffeeExp2),
          number : 1
        },
        toPass : {
          situationDescription : "Are you grabbing a coffee to go or are you staying at the coffee shop?",
          instruction : "Where do you usually sit and why? Take a picture of your drink or where you are sitting and share it with your partner!"
        },
        numberNeeded : 2,
        notificationDelay : 180,
        numberAllowedToParticipateAtSameTime: 3,
        allowRepeatContributions : false
      }
    ],
    description: 'Share your coffee shop experience with your new friend!',
    notificationText: 'Share your coffee shop experience with your new friend!',
    callbacks: [{
        trigger: `(cb.needFinished('coffee${pairNum}2'))`,
        function: coffeeExpCompleteCallback2.toString(),
      },
      {
        trigger: `!(cb.needFinished('coffee${pairNum}2'))`,
        function: coffeeExpCallback2.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}

export const createBubbleTeaExp = function (pairNum) {
  const bubbleExpCompleteCallback = function (sub) {
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
          ['profile.staticAffordances.participatedInBubbleTeaExp']: true
        }
      });
    });

    let route = `/apicustomresults/${sub.iid}/${sub.eid}`;
    let message = 'Woo-hoo! You two have completed the Bubble Tea experience! Tap here to see your results and share what you think!';

    sendSystemMessage(message, participants, route);
    notify(participants, sub.iid, 'See images from you and your partner\'s Bubble Tea experience!', '', route);
  }

  const bubbleExpCallback = function (sub) {
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
    let systemMessage = 'Your partner just completed the Bubble Tea Experience! Participate to see their results when you get a chance🧋'; 
    let notifMessage = "Hey! Your partner just completed the Bubble Tea Experience🧋"
  
    sendSystemMessage(systemMessage, partner, "/chat"); 
    Meteor.call('sendNotification', partner, notifMessage, '/chat');
  }

  let experience = {
    name: '🧋Bubble Tea Experience🧋',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : `bubble${pairNum}`,
        situation : {
          detector : getDetectorUniqueKey(DETECTORS[pairNum].bubbleTeaExp),
          number : 1
        },
        toPass : {
          situationDescription : "What brought you to the bubble tea shop today?",
          instruction : "What drink did you get and why? Take a picture of your drink and share it with your partner!"
        },
        numberNeeded : 2,
        notificationDelay : 150,
        numberAllowedToParticipateAtSameTime: 3,
        allowRepeatContributions : false
      }
    ],
    description: 'Share your bubble tea experience with your new friend!',
    notificationText: 'Share your bubble tea experience with your new friend!',
    callbacks: [{
        trigger: `(cb.needFinished('bubble${pairNum}'))`,
        function: bubbleExpCompleteCallback.toString(),
      },
      {
        trigger: `!(cb.needFinished('bubble${pairNum}'))`,
        function: bubbleExpCallback.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}

// new experiences ///////////////////////////////////////////////////////

const creatNewPairExperience = function(pairNum) {
  return {
    // selfIntroExperience: createSelfIntro(pairNum),
    walkExperience: createWalk2(pairNum),
    libraryExperience: createLibraryExp2(pairNum),
    groceriesExperience: createGroceriesExp2(pairNum),
    restaurantExperience: createRestaurantExp2(pairNum),
    // gymExperience: createGymExp(pairNum),
    publicTransportExperience: createPublicTransportExp2(pairNum),
    coffeeShopExperience: createCoffeeExp2(pairNum),
    // bubbleTeaExperience: createBubbleTeaExp(pairNum)
  }
}

export default NEW_PAIR_EXPERIENCES = {
  pair1: creatNewPairExperience("pair1"),
  pair2: creatNewPairExperience("pair2"),
  pair3: creatNewPairExperience("pair3"),
  pair4: creatNewPairExperience("pair4"),
  pair5: creatNewPairExperience("pair5"),
  pair6: creatNewPairExperience("pair6")
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


