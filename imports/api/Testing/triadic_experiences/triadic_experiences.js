import {getDetectorUniqueKey, addStaticAffordanceToNeeds} from "../oce_api_helpers";

import {DETECTORS} from "../DETECTORS";

/**
  To see how to change users' static affordances to create a progression
  see the Callback for DrinksTalk. Additionally, this experience has how to create
  multiple sets of experiences for multiple triads of users: for future studies
**/

export const createDrinksTalk = function() {
  const drinksTalkCompleteCallback = function (sub) {
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).fetch();

    let participants = submissions.map((submission) => { return submission.uid; });

    notify(participants, sub.iid, 'See images from your drinks talk experience!', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
  }

  /*
  const drinksTalkNewSubCallback = function (sub) {
      Meteor.users.update({
        _id: sub.uid
      }, {
        $set: {
          ['profile.staticAffordances.participatedInDrinksTalk']: true
        }
      });
  } */

  let experience = {
    name: 'Group Bumped - Drinks Talk',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : "drinksTalk",
        situation : {
          detector : getDetectorUniqueKey(DETECTORS.beverage),
          //DETECTORS['beverage_triadOne']._id,
          number : 1
        },
        toPass : {
          situationDescription : "Having a good time at a coffee shop or a restaurant?",
          instruction : "Send a picture of your drink and add some caption about it! (Why you ordered it, why you like it, etc.)."
        },
        numberNeeded : 3,
        notificationDelay : 1,
        numberAllowedToParticipateAtSameTime: 3,
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
    callbacks: [/*{
        trigger: `cb.newSubmission()`,
        function: drinksTalkNewSubCallback.toString(),
      },*/ {
        trigger: `(cb.newSubmission('drinksTalk') && cb.needFinished('drinksTalk'))`,
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
    notify(participants, sub.iid, 'See images from your mood meteorology experience!', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
  }

  let experience = {
    name: 'Group Bumped - Mood Meteorology',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : "moodMeteorology",
        situation : {
          detector : getDetectorUniqueKey(DETECTORS.daytime),
          number : 1
        },
        toPass : {
          situationDescription : "Having a good time today?",
          instruction : "Sometimes, the weather affects our mood! Take a picture showing the weather and add a caption about how it makes you feel."
        },
        numberNeeded : 3,
        notificationDelay : 1,
        numberAllowedToParticipateAtSameTime: 3,
        allowRepeatContributions : false
      }
    ],
    description: 'Share your experience with your friend and their friend!',
    notificationText: 'Share your experience with your friend and their friend!',
    callbacks: [{
        trigger: `(cb.newSubmission('moodMeteorology') && cb.needFinished('moodMeteorology')))`,
        function: moodMeteorologyCompleteCallback.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}

//fix this
export const createImitationGame = function () {
  const sendNotification = function (sub) {
    /*
    const triad = sub.needName.split('_')[2];
    let uids;
    if(triad == "triadOne") {
      uids = Meteor.users.find({"profile.staticAffordances.triadOne": true}).fetch().map(x => x._id);
    } else if (triad == "triadTwo") {
      uids = Meteor.users.find({"profile.staticAffordances.triadTwo": true}).fetch().map(x => x._id);
    }*/

    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).fetch();

    let uids = submissions.map((submission) => { return submission.uid; });

    notify(uids, sub.iid, 'The game is finally complete. Click here to check it out!',
    '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
  };

  const imitationGameCallback = function (sub) {
    let newContribution = {
      needName: `ImitationGame`,
      situation: {
        detector: detectorId,
        number: 1
      },
      toPass: {
        role: {
          creator: false,
          descriptor: false,
          recreator: false
        },
        previousSub: sub,
      },
      numberNeeded: 1,
    };

    const previousRole = sub.needName.split('_')[0];
    if (previousRole == 'creator') {
      newContribution.needName = `descriptor_${newContribution.needName}`;
      newContribution.toPass.role.descriptor = true;
      addContribution(sub.iid, newContribution);
    }
    else if (previousRole == 'descriptor') {
      newContribution.needName = `recreator_${newContribution.needName}`;
      newContribution.toPass.role.recreator = true;
      addContribution(sub.iid, newContribution);
    }
  };

  let experience = {
    name: 'The Imitation Game',
    participateTemplate: 'imitationGame',
    resultsTemplate: 'imitationGameResults',
    contributionTypes: [{
      needName: `creator_ImitationGame`,
      situation: {
        detector : getDetectorUniqueKey(DETECTORS.daytime),
        number: 1
      },
      toPass: {
        role: {
          creator: true,
          descriptor: false,
          recreator: false
        },
        example_image: 'https://i.imgur.com/xf20VKa.jpg'
      },
      numberNeeded: 1,
      numberAllowedToParticipateAtSameTime: 1,
    }],
    description: 'Let\'s play an imitation game!',
    notificationText: 'Let\'s play an imitation game!',
    callbacks: [{
        trigger: `(cb.newSubmission('creator_ImitationGame_triadOne') || cb.newSubmission('creator_ImitationGame_triadTwo') || cb.newSubmission('descriptor_ImitationGame_triadOne') || cb.newSubmission('descriptor_ImitationGame_triadTwo'))`,
        function: imitationGameCallback.toString()
          .replace('imitationGame_triadOne', DETECTORS['daytime']._id)
      }, {
        trigger: `(cb.newSubmission('recreator_ImitationGame_triadOne') || cb.newSubmission('recreator_ImitationGame_triadTwo'))`,
        function: sendNotification.toString()
    }],
    allowRepeatContributions: false,
  };

  experience.callbacks.push();

  return experience;
}



export const createGroupCheers = function() {
  const groupCheersCallback = function (sub) {
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).fetch();

    let participants = submissions.map((submission) => { return submission.uid; });
    notify(participants, sub.iid, 'Check out your group\'s cheers!', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
  }

  let experience = {
    name: 'Group Cheers',
    participateTemplate: 'groupCheers',
    resultsTemplate: 'groupCheersResults',
    contributionTypes: [{
      needName: 'groupCheers',
      situation: {
        detector : getDetectorUniqueKey(DETECTORS.beverage),
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

export const createMonster = function(){
  const monsterCallback = function (sub) {
    let submissions = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).fetch();

    let uids = submissions.map((submission) => { return submission.uid; });

    uids.forEach(uid => {
      Meteor.users.update({
        _id: uid
      }, {
        $set: {
          ['profile.staticAffordances.participatedInMonsterCreate']: true
        }
      });
    });

    //and somehow pass in full monster to the monster story experience
    notify(participants, sub.iid, 'Check out your group\'s monster!', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
  }

  let experience = {
    name: 'Frankenstein\'s Monster',
    participateTemplate: 'monsterCreate',
    resultsTemplate: 'monsterCreateResults',
    contributionTypes: [{
      needName: 'monsterCreate',
      situation: {
        detector : getDetectorUniqueKey(DETECTORS.anytime),
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
      trigger: `(cb.newSubmission('monsterCreate') && cb.needFinished('monsterCreate'))`,
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
    notify(uids, sub.iid, 'The story has been updated! See what your monster has been up to.', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
  }

  let experience = {
    name: 'Escape from the Lab!',
    participateTemplate: 'monsterStory',
    resultsTemplate: 'monsterStoryResults',
    contributionTypes: /*addStaticAffordanceToNeeds('participatedInMonsterCreate', [{
      needName: 'monsterStory',
      situation: {
        detector : getDetectorUniqueKey(DETECTORS.anytime),
        number: 1
        },
      toPass: {
        exampleMonster: null,
      },
      numberNeeded: 3,
      notificationDelay: 1,
      numberAllowedToParticipateAtSameTime: 1,
    }])*/
    [{
      needName: 'monsterStory',
      situation: {
        detector : getDetectorUniqueKey(DETECTORS.anytime),
        number: 1
        },
      toPass: {
        exampleMonster: null,
      },
      numberNeeded: 3,
      notificationDelay: 1,
      numberAllowedToParticipateAtSameTime: 1,
    }],
    description: 'Create a monster with your fellow mad scientists!',
    notificationText: 'Your monster has escaped the lab⁠— what is it doing?',
    callbacks: [{
      trigger: `(cb.newSubmission('monsterStory')`,
      function: monsterCallback.toString(),
    }],
    allowRepeatContributions: false,
  };

  return experience;
};

export default TRIADIC_EXPERIENCES = {
  //drinksTalk: createDrinksTalk(),
  moodMeteorology: createMoodMeteorology(),
  //imitationGame: createImitationGame(),
  groupCheers: createGroupCheers(),
  monsterCreate: createMonster(),
  monsterStory: monsterStory()
}
