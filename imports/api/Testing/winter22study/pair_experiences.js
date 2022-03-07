import {getDetectorUniqueKey, addStaticAffordanceToNeeds} from "../oce_api_helpers";
import { addContribution, changeExperienceToPass, createExperience } from '../../OCEManager/OCEs/methods';
import { sendSystemMessage, postExpInChat } from '../../Messages/methods';
import {DETECTORS} from "../DETECTORS";
import { Router } from 'meteor/iron:router';



// new experiences ///////////////////////////////////////////////////////

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

    let subject = "Coffee experience completed!";
    let text = "Tap here to view who you bumped into";
    postExpInChat("", participants, sub.eid, sub.iid);
    notify([participants[0]], sub.iid, subject, text, '/chat/' + participants[1]);
    notify([participants[1]], sub.iid, subject, text, '/chat/' + participants[0]);
    if(Meteor.userId() === participants[0]) {
      Router.go(`/chat/${participants[1]}`)
    } else {
      Router.go(`/chat/${participants[0]}`)
    }
  };

  let experience = {
    name: 'Coffee time',
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
          situationDescription : "Take a picture and share what you like about the cafe that makes you revisit!",
          instruction : " "
        },
        numberNeeded : 2,
        notificationDelay : 1,
        numberAllowedToParticipateAtSameTime: 2,
        allowRepeatContributions : false
      }
    ],
    description: 'Revisiting a cafe? What do you like about the place?',
    notificationText: 'Revisiting a cafe? What do you like about the place?',
    callbacks: [{
        trigger: `(cb.numberOfSubmissions() % 2) === 0`,
        function: expCallBack.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}

export const createActivity2 = function (pairNum) {
  const activity2CompleteCallback = function (sub) {
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
          ['profile.staticAffordances.participatedInActivity2']: true
        }
      });
    });

    let route = `/apicustomresults/${sub.iid}/${sub.eid}`;
    let message = 'Woo-hoo! You two have completed Remote Working - 2! Tap here to see your results and share what you think!'; //how do I change this so that it doesn't show up until both people finish?

    sendSystemMessage(message, participants, route); 
    postExpInChat("", participants, sub.eid, sub.iid);
    notify(participants, sub.iid, 'See images from you and your partner\'s Remote Working - 2!', '', route);
  }

  const activity2Callback = function (sub) {
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

    let systemMessage = 'Your partner just completed Remote working - 2! Participate to see their results when you get a chance💬'; 
    let notifMessage = "Hey! Your partner just completed Remote working - 2"
    sendSystemMessage(systemMessage, partner, "/chat"); 
    Meteor.call('sendNotification', partner, notifMessage, '/chat');
  }

  let experience = {
    name: '💻Remote Working - 2🖥',
    participateTemplate: 'groupBumped',
    resultsTemplate: 'groupBumpedResults',
    contributionTypes: [
      {
        needName : `Activity2${pairNum}`,
        situation : {
          detector : getDetectorUniqueKey(DETECTORS[pairNum].activity2),
          number : 1 
        },
        toPass : {
          situationDescription : "Answer from one of the following prompts:",
          instruction : "1) Take a picture of something around that keeps you motivated! Why? \n 2) Take a picture of something around you that makes you happy! Why?"
        },
        numberNeeded : 2,
        notificationDelay : 1,
        numberAllowedToParticipateAtSameTime: 2,
        allowRepeatContributions : false
      }
    ],
    description: 'Share your remote working experience!',
    notificationText: 'Share your remote working experience!',
    callbacks: [{
        trigger: `(cb.needFinished('Activity2${pairNum}'))`,
        function: activity2CompleteCallback.toString(),
      },
      {
        trigger: `!(cb.needFinished('Activity2${pairNum}'))`,
        function: activity2Callback.toString(),
      }
    ],
    allowRepeatContributions: false,
  };

  return experience;
}


// new experiences ///////////////////////////////////////////////////////

const createTestExperience = function() {
  return {
    coffeeExperience: createCoffeeExp(),
  }
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


