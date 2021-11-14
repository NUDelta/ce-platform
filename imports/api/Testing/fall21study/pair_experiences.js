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
          detector : getDetectorUniqueKey(DETECTORS[pairNum].walkExp),
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
          detector : getDetectorUniqueKey(DETECTORS[pairNum].libraryExp),
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
        needName : "Groceries",
        situation : {
          detector : getDetectorUniqueKey(DETECTORS[pairNum].groceriesExp),
          number : 1
        },
        toPass : {
          situationDescription : "Enjoying your grocery shopping today?",
          instruction : "What is your game plan for shopping for food? Show us what ingredients you’re using! Caption your picture with your plan!"
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
        trigger: `(cb.needFinished('groceries'))`,
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
        needName : "Restaurant",
        situation : {
          detector : getDetectorUniqueKey(DETECTORS[pairNum].restaurantExp),
          number : 1
        },
        toPass : {
          situationDescription : "Enjoying your food and ambience of the restaurant?",
          instruction : "Where are you sitting in the restaurant? Why? Take a picture of your place and tell us your reason!"
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
        trigger: `(cb.needFinished('restaurant'))`,
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
    name: 'Group Bumped - gym',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : "gym",
        situation : {
          detector : getDetectorUniqueKey(DETECTORS[pairNum].gymExp),
          number : 1
        },
        toPass : {
          situationDescription : "Enjoy your workout session at the gym today?",
          instruction : "Where did you do today? Why? Take a picture of your place and tell us your reason!"
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
        trigger: `(cb.needFinished('gym'))`,
        function: gymExpCompleteCallback.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}

// new experiences ///////////////////////////////////////////////////////

export const createDrinksTalk = function() {
  const drinksTalkCompleteCallback = function (sub) {
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).fetch();

    let participants = submissions.map((submission) => { return submission.uid; });

    participants.forEach(p => {
      Meteor.users.update({
        _id: p
      }, {
        $set: {
          ['profile.staticAffordances.participatedInDrinksTalk']: true
        }
      });
    })


    let message = 'Yippee! You two have completed the Drinks Talk experience! Tap here to see your results.';
    let route = `/apicustomresults/${sub.iid}/${sub.eid}`;

    sendSystemMessage(message, participants, route);
    notify(participants, sub.iid, 'See images from your drinks talk experience!', '', route);
  }

  let experience = {
    name: 'Group Bumped - Drinks Talk',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : "drinksTalk",
        situation : {
          detector : getDetectorUniqueKey(DETECTORS.drinksTalk_triad1),
          //DETECTORS['beverage_triadOne']._id,
          number : 1
        },
        toPass : {
          situationDescription : "Having a good time at a coffee shop or a restaurant?",
          instruction : "Send a picture of your drink and add some caption about it! (Why you ordered it, why you like it, etc.)."
        },
        numberNeeded : 2,
        notificationDelay : 1,
        numberAllowedToParticipateAtSameTime: 2,
        allowRepeatContributions : false
      },
      /*{
        needName : "beverage_triadTwo",
        situation : {
          detector : getDetectorUniqueKey(DETECTORS['beverage_triadTwo']),
          number : 1
        },
        toPass : {
          situationDescription : "Having a good time at a coffee shop or a restaurant?",
          instruction : "Send a picture of your drink and add some caption about it! (Why you ordered it, why you like it, etc.)."
        },
        numberNeeded : 3,
        notificationDelay : 90,
        numberAllowedToParticipateAtSameTime: 3,
        allowRepeatContributions : false
      },*/
    ],
    description: 'Share your experience with your friend and their friend!',
    notificationText: 'Share your experience with your friend and their friend!',
    callbacks: [{
        trigger: `(cb.needFinished('drinksTalk'))`,
        function: drinksTalkCompleteCallback.toString(),
      }
    ],
    allowRepeatContributions: false,
  };
  return experience;
}

export const createMoodMeteorology = function () {
  const moodMeteorologyCompleteCallback = function (sub) {
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
          ['profile.staticAffordances.participatedInMoodMeteorology']: true
        }
      });
    });

    let route = `/apicustomresults/${sub.iid}/${sub.eid}`;
    let message = 'Woo-hoo! You two have completed the Mood Meteorology experience! Tap here to see your results.';

    sendSystemMessage(message, participants, route);
    notify(participants, sub.iid, 'See images from your mood meteorology experience!', '', route);
  }

  let experience = {
    name: 'Group Bumped - Mood Meteorology',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : "moodMeteorology",
        situation : {
          detector : getDetectorUniqueKey(DETECTORS.moodMeteorology_triad1),
          number : 1
        },
        toPass : {
          situationDescription : "Having a good time today?",
          instruction : "Sometimes, the weather affects our mood! Take a picture showing the weather and add a caption about how it makes you feel."
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
        trigger: `(cb.needFinished('moodMeteorology'))`,
        function: moodMeteorologyCompleteCallback.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}

export const createImitationGame = function () {
  const imitationGameCallback = function (sub) {
    //remove flag from current user
    Meteor.users.update({
      _id: sub.uid
    }, {
      $unset: {
        'profile.staticAffordances.imitationGameFlag': ""
      }
    });

    let incident = Incidents.findOne(sub.iid);
    let role = incident.contributionTypes.find(c => c.needName == sub.needName).toPass.role;
    if (role.creator){
      //change To Pass for the descriptor
      changeIncidentToPass(sub.iid, sub.needName, 'role.creator', 'role.descriptor')
      //next participant is mutual friend
      let aff = Meteor.users.findOne(sub.uid).profile.staticAffordances;
      let triad = Object.keys(aff).filter(k => k.search('triad') != -1)[0];
      let mutualFriend = Meteor.users.find({
        [`profile.staticAffordances.${triad}`] : true,
        [`profile.staticAffordances.friend`] : true,
      }).fetch()[0];
      //give mutual friend the imitation game flag to participate
      Meteor.users.update({
        _id: mutualFriend._id
      }, {
        $set: {
          'profile.staticAffordances.imitationGameFlag': true
        }
      });
    } else if (role.descriptor) {
      changeIncidentToPass(sub.iid, sub.needName, 'role.descriptor', 'role.recreator')
      //next participant other stranger
      let aff = Meteor.users.findOne(sub.uid).profile.staticAffordances;
      let triad = Object.keys(aff).filter(k => k.search('triad') != -1)[0];
      let otherStranger = Meteor.users.find({
        [`profile.staticAffordances.${triad}`] : true,
        [`profile.staticAffordances.stranger2`] : true,
      }).fetch()[0];
      //give other stranger the imitation game flag to participate
      Meteor.users.update({
        _id: otherStranger._id
      }, {
        $set: {
          'profile.staticAffordances.imitationGameFlag': true
        }
      });
    } else if (role.recreator) {
      //send notification
      let message = 'Hooray! The Imitation Game is finished! Tap here to see the results.';
      let route = `/apicustomresults/${sub.iid}/${sub.eid}`
      let submissions = Submissions.find({
        iid: sub.iid,
        needName: sub.needName
      }).fetch();
      let participants = submissions.map(s => s.uid );

      participants.forEach(function(p){
        Meteor.users.update({
          _id: p
        }, {
          $set: {
            ['profile.staticAffordances.participatedInImitationGame']: true
          }
        });
      });


      notify(participants, sub.iid, message, '', route);
    }
  };

  let experience = {
    name: 'The Imitation Game',
    participateTemplate: 'imitationGame',
    resultsTemplate: 'imitationGameResults',
    contributionTypes: [{
      needName: `imitation_game`,
      situation: {
        detector : getDetectorUniqueKey(DETECTORS.imitation_game_triad1),
        number: 1,
      },
      toPass: {
        role: {
          creator: true,
          descriptor: false,
          recreator: false
        },
        example_image: 'https://i.imgur.com/xf20VKa.jpg'
      },
      numberNeeded: 3,
      numberAllowedToParticipateAtSameTime: 1,
    }],
    description: 'Let\'s play an imitation game!',
    notificationText: 'Let\'s play an imitation game!',
    callbacks: [{
        trigger: `(cb.newSubmission('imitation_game'))`,
        function: imitationGameCallback.toString()
    }],
    allowRepeatContributions: false,
  };

  return experience;
}



export const createGroupCheers = function() {
  const groupCheersCallback = function (sub) {
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).fetch();

    let participants = submissions.map((submission) => { return submission.uid; });

    //get only strangers in the triad
    let aff = Meteor.users.findOne(sub.uid).profile.staticAffordances;
    let triad = Object.keys(aff).filter(k => k.search('triad') != -1)[0];
    let strangers = Meteor.users.find({
      [`profile.staticAffordances.${triad}`] : true,
      [`profile.staticAffordances.friend`]: { $exists: false }
    }).fetch();

    strangers.forEach(s => {
      Meteor.users.update({
        _id: s._id
      }, {
        $set: {
          ['profile.staticAffordances.chat']: true,
          ['profile.staticAffordances.participatedInGroupCheers']: true
        }
      });
    })
    let strangersId = strangers.map(s => s._id);

    notify(strangersId, '', 'You have now finished enough experiences to open the chat!', '','/chat/');
    notify(participants, sub.iid, 'Check out your group\'s cheers!', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
  }

  let experience = {
    name: 'Group Cheers',
    participateTemplate: 'groupCheers',
    resultsTemplate: 'groupCheersResults',
    contributionTypes: [{
      needName: 'groupCheers',
      situation: {
        detector : getDetectorUniqueKey(DETECTORS.group_cheers_triad1),
        number: 1
        },
      toPass: {
        instruction: 'What are you <span style="color: #0351ff">cheersing</span> to? Take a photo of your drink based on the portion of the image you’re assigned to. Enter a caption describing what you’re <span style="color: #0351ff">cheersing</span> to! (This can be something you’re proud of, something you’re happy about, etc.)',
        //change example image to be on s3 server
        exampleImage: 'http://res.cloudinary.com/dftvewldz/image/upload/a_180/v1557216496/dtr/cheers.png'
      },
      numberNeeded: 3,
      notificationDelay: 1,
      numberAllowedToParticipateAtSameTime: 3,
    }],
    description: 'Share your accomplishments with your friend and their friend!',
    notificationText: 'Share your accomplishments with your friend and their friend!',
    callbacks: [{
      trigger: `(cb.needFinished('groupCheers'))`,
      function: groupCheersCallback.toString(),
    }],
    allowRepeatContributions: false,
  };

  return experience;
};

export const createNightTimeSpooks = function(){
  //add static affordance to user so that they can now do the riddikulus part of this experience
  const nightTimeSpooksCallback = function (sub) {
    Meteor.users.update({
      _id: sub.uid
    }, {
      $set: {
        ['profile.staticAffordances.participatedInNightTimeSpooks']: true
      }
    });
  }

  const completeNightTimeSpooksCallback = function (sub) {
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).fetch();

    let participants = submissions.map((submission) => { return submission.uid; });
    participants = [... new Set(participants)]

    participants.forEach(function(p){
      Meteor.users.update({
        _id: p
      }, {
        $set: {
          ['profile.staticAffordances.completedNightTimeSpooks']: true
        }
      });
    });
  }

  riddikulusCallback = function(sub) {
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).fetch();

    let participants = submissions.map((submission) => { return submission.uid; });
    participants = [... new Set(participants)]
    let message = 'Hip hip hoo-ray! You two have completed the Night Time Spooks experience! Tap here to see your results.';
    let route = `/apicustomresults/${sub.iid}/${sub.eid}`;

    sendSystemMessage(message, participants, route);
    notify(participants, sub.iid, 'Check out the results of your Night Time Spooks!', '', route);
  }

  let experience = {
    name: 'Night Time Spooks',
    participateTemplate: 'nightTimeSpooks',
    resultsTemplate: 'nightTimeSpooksResults',
    contributionTypes: [{
      needName: 'nightTimeSpooks',
      situation: {
        //replace with night time detector
        detector : getDetectorUniqueKey(DETECTORS.nightTimeSpooks_triad1),
        number: 1
        },
      toPass: {
        exampleImage: 'https://res.cloudinary.com/dftvewldz/image/upload/v1600977519/dtr/IMG_4036.jpg',
        exampleCaption: 'I\'m scared of seeing something other than myself in the mirror at night!! I wonder how much my name influenced this fear...'
      },
      numberNeeded: 2,
      notificationDelay: 1,
      numberAllowedToParticipateAtSameTime: 1,
    },{
      needName: 'riddikulus',
      situation: {
        detector : getDetectorUniqueKey(DETECTORS.riddikulus_triad1),
        number: 1
        },
      toPass: {
      },
      numberNeeded: 2,
      notificationDelay: 1,
      numberAllowedToParticipateAtSameTime: 1,
    }],
    description: 'Share a spooky nighttime secret with your friend!',
    notificationText: 'Share a spooky nighttime secret with your friend!',
    callbacks: [{
      trigger: `cb.newSubmission('nightTimeSpooks')`,
      function: nightTimeSpooksCallback.toString(),
    },{
      trigger: `cb.needFinished('nightTimeSpooks')`,
      function: completeNightTimeSpooksCallback.toString(),
    },{
      trigger: `(cb.needFinished('riddikulus'))`,
      function: riddikulusCallback.toString()
    }],
    allowRepeatContributions: true,
    repeatContributionsToExperienceAfterN: 0,
  };
  return experience;
}

export const createLifeJourneyMap = function(){
  const lifeJourneyMapCallback = function (sub) {
    //only get other participant
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName,
      uid: {$ne: sub.uid}
    }).fetch();

    let otherParticipants = submissions.map((submission) => { return submission.uid; });
    let message = 'Someone just added to their life journey map! Tap here to see their updates.';
    let route = `/apicustomresults/${sub.iid}/${sub.eid}`;

    notify(otherParticipants, sub.iid, message, '', route);
  }

  const lifeJourneyMapCompleteCallback = function (sub) {
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).fetch();

    let participants = submissions.map((submission) => { return submission.uid; });
    participants = [... new Set(participants)]
    let message = 'Wowee! You two have completed the Life Journey Map experience! Tap here to see your results.';
    let route = `/apicustomresults/${sub.iid}/${sub.eid}`;

    sendSystemMessage(message, participants, route);
    notify(participants, sub.iid, 'Check out the results of the Life Journey Maps!', '', route);
  }

  let experience = {
    name: 'Life Journey Map',
    participateTemplate: 'lifeJourneyMap',
    resultsTemplate: 'lifeJourneyMapResults',
    contributionTypes: [{
      needName: 'lifeJourneyMap',
      situation: {
        detector : getDetectorUniqueKey(DETECTORS.lifeJourneyMap_triad1),
        number: 1
      },
      toPass: {
        exampleImage: "https://res.cloudinary.com/dftvewldz/image/upload/v1600977161/dtr/lifejourneymap.png"
      },
      numberNeeded: 6,
      notificationDelay: 1,
      numberAllowedToParticipateAtSameTime: 1,
      allowRepeatContributions: true
    }],
    description: 'Chart a map of your life\'s journey with a friend!',
    notificationText: 'Map out your life\'s journey with a friend!',
    callbacks: [{
      trigger: `cb.newSubmission('lifeJourneyMap')`,
      function: lifeJourneyMapCallback.toString(),
    },{
      trigger: `cb.needFinished('lifeJourneyMap')`,
      function: lifeJourneyMapCompleteCallback.toString(),
    }],
  };
  return experience;
}

export const createAppreciationStation = function(){
  const appreciationStationCompleteCallback = function (sub) {
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).fetch();

    //get strangers
    let participants = submissions.map((submission) => { return submission.uid; });
    participants = [... new Set(participants)]
    //get mutual friend
    let aff = Meteor.users.findOne(sub.uid).profile.staticAffordances;
    let triad = Object.keys(aff).filter(k => k.search('triad') != -1)[0];
    let mutualFriend = Meteor.users.find({
      [`profile.staticAffordances.${triad}`] : true,
      [`profile.staticAffordances.friend`] : true,
    }).fetch();

    let messageStrangers = 'Hooray! You helped to complete the Appreciation Station for your friend! Tap here to see your results.';
    let messageMutual = 'Your friends made an Appreciation Station for you! Tap here to see what they said!'
    let route = `/apicustomresults/${sub.iid}/${sub.eid}`;

    //notify both strangers and mutual friends + no system message bc chat is not open yet
    notify(participants, sub.iid, messageStrangers, '', route);
    notify([mutualFriend[0]._id], sub.iid, messageMutual, '', route);

    participants.forEach(p => {
      Meteor.users.update({
        _id: p
      }, {
        $set: {
          ['profile.staticAffordances.participatedInAppreciationStation']: true
        }
      });
    })

    //add incident to mutual friends pastincidents so they can access the experience
    Meteor.users.update({
      _id: mutualFriend[0]._id
    }, {
      $addToSet: {
        'profile.pastIncidents': sub.iid
      },
      $set: {
        ['profile.staticAffordances.participatedInAppreciationStation']: true
      }
    });
  }

  let experience = {
    name: 'Appreciation Station',
    participateTemplate: 'appreciationStation',
    resultsTemplate: 'appreciationStationResults',
    contributionTypes: [{
      needName: 'appreciationStation',
      situation: {
        detector : getDetectorUniqueKey(DETECTORS.strangers_triad1),
        number: 1
        },
      toPass: {
      },
      numberNeeded: 4,
      notificationDelay: 1,
      numberAllowedToParticipateAtSameTime: 1,
      allowRepeatContributions: false
    }],
    allowRepeatContributions: true,
    description: 'Show some appreciation for your friend!',
    notificationText: 'Show some appreciation for your friend!',
    callbacks: [{
      trigger: `cb.needFinished('appreciationStation')`,
      function: appreciationStationCompleteCallback.toString(),
    }],
  };
  return experience;
}

export const createMonster = function(){
  const monsterCallback = function (sub) {
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
          ['profile.staticAffordances.participatedInMonsterCreate']: true
        }
      });
    });

    let systemMessage = 'Woot! You two have made a monstrous creation! Tap here to see your results.';
    let notificationMessage = 'The monster is complete! Tap here to see the result.'
    let route = `/apicustomresults/${sub.iid}/${sub.eid}`;

    sendSystemMessage(systemMessage, participants, route);
    notify(participants, sub.iid, notificationMessage, '', route);
  }

  const monsterStoryCallback = function (sub) {

    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).fetch();
    let participants = submissions.map(s => s.uid);
    participants = [... new Set(participants)];

    let otherSubmissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName,
      uid: {$ne: sub.uid}
    }).fetch();
    let otherParticipants = otherSubmissions.map((s) => { return s.uid; });

    let message = 'The report on the monster has been updated! Tap here to see its latest adventures.';
    let route = `/apicustomresults/${sub.iid}/${sub.eid}`;

    sendSystemMessage(message, participants, route);
    notify(otherParticipants, sub.iid, message, '', route);
  }

  const monsterCompleteStoryCallback = function (sub) {
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).fetch();

    let participants = submissions.map((submission) => { return submission.uid; });
    participants = [... new Set(participants)];

    let route = '/apicustomresults/' + sub.iid + '/' + sub.eid;
    let notificationMessage = "The monster\'s adventures are complete! Tap here to see the result.";
    let systemMessage = "The monster has finally been captured! Tap here to see the final report of its hectic adventures!";

    sendSystemMessage(participants, systemMessage, route);
    notify(participants, sub.iid, notificationMessage, '', route);
  }

  let experience = {
    name: 'Frankenstein\'s Monster',
    participateTemplate: 'monsterCreate',
    resultsTemplate: 'monsterCreateResults',
    contributionTypes: [{
      needName: 'monsterCreate_triad1',
      situation: {
        detector : getDetectorUniqueKey(DETECTORS.monsterCreate_triad1),
        number: 1
        },
      toPass: {
        title: "Frankenstein\'s Monster",
        exampleFullMonster: 'https://res.cloudinary.com/dftvewldz/image/upload/v1600977155/dtr/monsterex.jpg'
      },
      numberNeeded: 2,
      notificationDelay: 1,
      numberAllowedToParticipateAtSameTime: 1,
    },{
      needName: 'monsterStory_triad1',
      situation: {
        detector : getDetectorUniqueKey(DETECTORS.monsterStory_triad1),
        number: 1
      },
      toPass: {
        title: "Escape from the Lab!"
      },
      numberNeeded: 5,
      notificationDelay: 1,
      numberAllowedToParticipateAtSameTime: 3,
      allowRepeatContributions: true
    }],
    description: 'Create a monster with your fellow mad scientist & see what it does!',
    notificationText: 'Create a monster with your fellow mad scientist & see what it does!',
    callbacks: [{
      trigger: `cb.needFinished('monsterCreate_triad1')`,
      function: monsterCallback.toString(),
    },{
      trigger: `cb.newSubmission('monsterStory_triad1') && !cb.needFinished('monsterStory_triad1')`,
      function: monsterStoryCallback.toString(),
    },{
      trigger: `cb.needFinished('monsterStory_triad1')`,
      function: monsterCompleteStoryCallback.toString(),
    }],
    allowRepeatContributions: true
  };

  return experience;
};

const creatPairExperience = function(pairNum) {
  return {
    walkExperience: createWalk(pairNum),
    libraryExperience: createLibraryExp(pairNum),
    groceriesExperience: createGroceriesExp(pairNum),
    restaurantExperience: createRestaurantExp(pairNum)
  }
}

export default PAIR_EXPERIENCES = {
  pair1: creatPairExperience("pair1"),
  pair2: creatPairExperience("pair2"),
  pair3: creatPairExperience("pair3")
}


