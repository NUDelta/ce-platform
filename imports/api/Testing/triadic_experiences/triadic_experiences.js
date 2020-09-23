import {getDetectorUniqueKey, addStaticAffordanceToNeeds} from "../oce_api_helpers";
import { addContribution, changeExperienceToPass } from '../../OCEManager/OCEs/methods';
import { sendSystemMessage } from '../../Messages/methods';
import {DETECTORS} from "../DETECTORS";

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

    let message = 'Hooray! You two have completed the Drinks Talk experience! Tap here to see your results.';
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
          ['profile.staticAffordances.completedMoodMeteorology']: true
        }
      });
    });

    let route = `/apicustomresults/${sub.iid}/${sub.eid}`;
    let message = 'Hooray! You two have completed the Drinks Talk experience! Tap here to see your results.';

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
          ['profile.staticAffordances.chat']: true
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
      trigger: `(cb.newSubmission('groupCheers_triadOne') && cb.needFinished('groupCheers_triadOne')) || (cb.newSubmission('groupCheers_triadTwo') && cb.needFinished('groupCheers_triadTwo'))`,
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
    let message = 'Hooray! You two have completed the Night Time Spooks experience! Tap here to see your results.';
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
        exampleImage: 'https://vignette.wikia.nocookie.net/clifford/images/6/6e/Art_clifford_standing.png/revision/latest?cb=20150221004122',
        exampleCaption: 'I\'m scared of big dogs so Clifford is my biggest fear'
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
    let message = 'Hooray! You two have completed the Life Journey Map experience! Tap here to see your results.';
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
        exampleImage: "http://45.76.227.174/assets/img/cta-map.jpg"
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
    notify(mutualFriend, sub.iid, messageMutual, '', route);

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
      allowRepeatContributions: true
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

    //allow participation in MonsterCreate
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

    const stitchedImageCursor = Images.find({needName:sub.needName, stitched:"true"});
    stitchedImageCursor.observe({
      added(stitched){
        let monsterEx = Experiences.findOne({participateTemplate: "monsterStory"});
        let monsterIncident = Incidents.findOne({eid:monsterEx._id});
        let triadNum = sub.needName.split('_')[1];
        Images.update({_id: stitched._id}, {
          $set: {
            iid: monsterIncident._id,
            needName: `monsterStory_${triadNum}`
          }
        });
        }
      });

      notify(participants, sub.iid, 'See the complete monster here!', 'The monster is now complete! See the complete monster here.', '/apicustomresults/' + sub.iid + '/' + sub.eid);
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
        instruction: 'You are a <span style="color: #0351ff"> mad scientist</span> who is working with your partners to create a monster! You and your partners will each draw a third of the monster and take a photo of your respective parts.',
        //change example images
        exampleImage: 'http://res.cloudinary.com/dftvewldz/image/upload/a_180/v1557216496/dtr/cheers.png',
        exampleImage2: 'http://res.cloudinary.com/dftvewldz/image/upload/a_180/v1557216496/dtr/cheers.png',
        exampleImage3: 'http://res.cloudinary.com/dftvewldz/image/upload/a_180/v1557216496/dtr/cheers.png',
        exampleFullMonster: 'http://res.cloudinary.com/dftvewldz/image/upload/a_180/v1557216496/dtr/cheers.png'
      },
      numberNeeded: 3,
      notificationDelay: 1,
      numberAllowedToParticipateAtSameTime: 1,
      },{
      needName: 'monsterCreate_triad2',
      situation: {
        detector : getDetectorUniqueKey(DETECTORS.anytime_triad2),
        number: 1
        },
      toPass: {
        instruction: 'You are a <span style="color: #0351ff"> mad scientist</span> who is working with your partners to create a monster! You and your partners will each draw a third of the monster and take a photo of your respective parts.',
        //change example images
        exampleImage: 'http://res.cloudinary.com/dftvewldz/image/upload/a_180/v1557216496/dtr/cheers.png',
        exampleImage2: 'http://res.cloudinary.com/dftvewldz/image/upload/a_180/v1557216496/dtr/cheers.png',
        exampleImage3: 'http://res.cloudinary.com/dftvewldz/image/upload/a_180/v1557216496/dtr/cheers.png',
        exampleFullMonster: 'http://res.cloudinary.com/dftvewldz/image/upload/a_180/v1557216496/dtr/cheers.png'
      },
      numberNeeded: 3,
      notificationDelay: 1,
      numberAllowedToParticipateAtSameTime: 1,
    }],
    description: 'Create a monster with your fellow mad scientists!',
    notificationText: 'Create a monster with your fellow mad scientists!',
    callbacks: [{
      trigger: `(cb.newSubmission('monsterCreate_triad2') && cb.needFinished('monsterCreate_triad2')) ||
      (cb.newSubmission('monsterCreate_triad1') && cb.needFinished('monsterCreate_triad1'))`,
      function: monsterCallback.toString(),
    }],
    allowRepeatContributions: false,
  };

  return experience;
};


export const monsterStory = function(){
  const monsterCallback = function (sub) {
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).fetch();

    let uids = submissions.map((submission) => { return submission.uid; });
    uids = [... new Set(uids)];
    notify(uids, sub.iid, 'See what your monster has been up to!', 'The lab report has been updated. See the complete report here!', '/apicustomresults/' + sub.iid + '/' + sub.eid);
  }

  let experience = {
    name: 'Escape from the Lab!',
    participateTemplate: 'monsterStory',
    resultsTemplate: 'monsterStoryResults',
    contributionTypes: addStaticAffordanceToNeeds('participatedInMonsterCreate', [
      {needName: 'monsterStory_triad1',
        situation: {
          detector : getDetectorUniqueKey(DETECTORS.monsterCreate_triad1),
          number: 1
        },
        toPass: {},
        numberNeeded: 5,
        notificationDelay: 1,
        numberAllowedToParticipateAtSameTime: 1,
      }]),
    description: 'Your monster has escaped the lab⁠— what is it doing?',
    notificationText: 'Your monster has escaped the lab⁠— what is it doing?',
    callbacks: [{
      trigger: `(cb.newSubmission('monsterStory_triad1'))`,
      function: monsterCallback.toString(),
    }],
    allowRepeatContributions: true,
  };

  return experience;
};

export default TRIADIC_EXPERIENCES = {
  appreciationStation: createAppreciationStation(),
  imitationGame: createImitationGame(),
  groupCheers: createGroupCheers(),
  drinksTalk: createDrinksTalk(),
  moodMeteorology: createMoodMeteorology(),
  monsterCreate: createMonster(),
  monsterStory: monsterStory(),
  nightTimeSpooks: createNightTimeSpooks(),
  lifeJourneyMap: createLifeJourneyMap()
}
