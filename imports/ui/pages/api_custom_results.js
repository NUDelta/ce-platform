import './api_custom_results.html';

import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';

import {FlowRouter} from 'meteor/ostrio:flow-router-extra';
import { Template } from "meteor/templating";
import { Meteor } from 'meteor/meteor'
import '../components/displayImage.html';
import { findPartner, scrollToBottomAbs } from "../pages/chat"
//import {notify} from "../../api/OpportunisticCoordinator/server/noticationMethods";

import { Experiences } from "../../api/OCEManager/OCEs/experiences";
import { Avatars, Images } from '../../api/ImageUpload/images.js';
import { Submissions } from "../../api/OCEManager/currentNeeds";


Template.api_custom_results_page.onCreated(function () {
  const iid = FlowRouter.getParam('iid');
  const eid = FlowRouter.getParam('eid');
  this.autorun(() => {
    this.subscribe('images.activeIncident', iid);
    this.subscribe('experiences.single', eid);
    this.subscribe('incidents.single', iid);
    this.subscribe('locations.activeUser');
    this.subscribe('submissions.activeIncident', iid);
    this.subscribe('users.all');
    this.subscribe('avatars.all');
  });
});

Template.api_custom_results_page.helpers({
  apiCustomResultsArgs() {
    const instance = Template.instance();
    let unsortedBetterSubmissions = Submissions.find({})
    .fetch()
    .filter(submission => {return Object.values(submission.content).length != 0;});
    
    unsortedBetterSubmissions.sort((a, b) => a.content.order - b.content.order);
    

    
    
    return {
      experience: Experiences.findOne(),
      images: Images.find({}).fetch(),
      submissions: Submissions.find({}).fetch(),
      users: Meteor.users.find().fetch(),
      avatars: Avatars.find({}).fetch(),
      betterSubmissions: unsortedBetterSubmissions,
      incident: Incidents.findOne(),

       

    }
  }
});

Template.api_custom_results_admin_page.onCreated(function () {
  const iid = FlowRouter.getParam('iid');
  const eid = FlowRouter.getParam('eid');
  this.autorun(() => {
    this.subscribe('images.activeIncident', iid);
    this.subscribe('experiences.single', eid);
    this.subscribe('submissions.activeIncident', iid);
    this.subscribe('users.all');
    this.subscribe('avatars.all');
  });
});

Template.api_custom_results_admin_page.helpers({
  apiCustomResultsAdminArgs() {
    const instance = Template.instance();
    return {
      experience: Experiences.findOne(),
      images: Images.find({}).fetch(),
      submissions: Submissions.find({}).fetch(),
      users: Meteor.users.find().fetch(),
      avatars: Avatars.find({}).fetch(),
    }
  }
});


Template.api_custom_results.onCreated(() => {
  console.log("loaded");
});

Template.api_custom_results.helpers({
  data() {
    let navbar = document.querySelector(".nav-footer");
    navbar.style.display = "block";
    // console.log(navbar);
    if (this.submissions) {
      this.submissions.sort(function compare(a, b) {
        if (a.timestamp === undefined) {
          return 1;
        } else if (b.timestamp === undefined) {
          return -1;
        }

        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return dateA - dateB;
      });
    }

    // console.log(this);
    // console.log(this.images);
    return this;
  },
});

Template.api_custom_results_admin.onCreated(() => {
  console.log("loaded admin");
});

Template.api_custom_results_admin.helpers({
  data() {
    this.submissions.sort(function compare(a, b) {
      if (a.timestamp === undefined) {
        return 1;
      } else if (b.timestamp === undefined) {
        return -1;
      }

      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return dateA - dateB;
    });

    console.log(this);
    console.log(this.images);
    return this;
  },
  adminTemplate(templateName) {
    return templateName + '_admin';
  }
});


Template.photosByCategories.helpers({
  categories() {
    let needNames = this.experience.contributionTypes.map(function(x){
      return x.needName;
    });

    let categoriesSet = new Set(needNames);
    return [...categoriesSet];
  },
  myCategories() {
    let mySubs = this.submissions.filter(function(x){
      return x.uid === Meteor.userId();
    });

    let myNeedNames = mySubs.map(function(x){
      return x.needName;
    });

    let categoriesSet = new Set(myNeedNames);
    return [...categoriesSet];
  },
  imagesByCategory(category){
    let specific = this.images.filter(function(x){
      return x.needName === category;
    });

    return specific;
  }
});

Template.photosByCategories_admin.helpers({
  categories() {
    let needNames = this.experience.contributionTypes.map(function(x){
      return x.needName;
    });

    let categoriesSet = new Set(needNames);
    return [...categoriesSet];
  },
  imagesByCategory(category){
    let specific = this.images.filter(function(x){
      return x.needName === category;
    });

    return specific;
  }
});

Template.bumpedResults.helpers({
  getName(x ){
    return x.friendName;
  },
  getImage(x){
    return x.image;
  },
  getMyImage(x){
    return x.myImage;
  },
  bumpees() {
    let mySubs = this.submissions.filter(function(x){
      return x.uid === Meteor.userId();
    });

    let myNeedNames = mySubs.map(function(x){
      return x.needName;
    });

    let otherSubs = this.submissions.filter(function(x){
      return (myNeedNames.includes(x.needName)) && (x.uid !== Meteor.userId());
    });

    let contents = otherSubs.map(function(x){
      let myInfoDic = mySubs.find(function(y){
        return y.needName === x.needName;
      });
      return {image: x.content.proof, friendName: myInfoDic.content.nameOfFriend, myImage: myInfoDic.content.proof};
    });

    let images = this.images;
    contents.reverse();

    contents = contents.map(function(x){
      let img = images.find(function(y){
        return y._id === x.image;
      });
      let myImg = images.find(function(y){
        return y._id === x.myImage;
      });

      return {friendName: x.friendName,image: img, myImage: myImg};
    });

    return contents;
  }
});

Template.groupBumpedResults.helpers({
  content() {
    const {submissions, images, users} = this;

    const mySub = submissions.find(s => s.uid === Meteor.userId());
    const myNeedNames = mySub.needName;
    const otherSubs = submissions.filter(s => myNeedNames.includes(s.needName) && s.uid !== Meteor.userId())[0];

    // const myImage = images.find(i => i._id === mySub.content.proof);
    // const otherImages = otherSubs.map(s => images.find(i => i._id === s.content.proof));
    // const friends = otherSubs.map(s => users.find(u => u._id === s.uid));
    const myImage = mySub.content.proof;
    const otherImages = otherSubs.content.proof;
    const friends = users.find(u => u._id === otherSubs.uid);

    results = {};
    Object.assign(results,
      friends && {friendOneName: `${friends.profile.firstName} ${friends.profile.lastName}`},
      {imageOne: otherImages},
      otherSubs && {captionOne: otherSubs.content.sentence},
      {myImage: myImage},
      mySub && {myCaption: mySub.content.sentence},
      {allUsers: users}
    )

    return results;
  }
});


Template.groupBumpedResults.events({
  'submit #replyResult'(event, instance) {
    event.preventDefault();
    const replyText = event.target.getElementsByClassName("replyText")[0].value;

    console.log(replyText);
    console.log(this);


    const uid = Meteor.userId();
    const data = { message: replyText};
    let users = this.allUsers;
    if (data.message === "") return;
    data.sender = uid;
    data.receiver = [uid];

    const otherStranger = findPartner(uid)
    console.log("other stranger" + otherStranger)

    data.receiver = data.receiver.concat(otherStranger)
    // console.log(data.receiver);
    let currentUsername = Meteor.users.findOne(Meteor.userId()).username;

    Meteor.call("sendReplyMessage", data, (error, response) => {
      if (error) {
        console.log(error)
      } else {
        // $input.val("");
        event.target.getElementsByClassName("replyText")[0].value = "";
        //always scroll to bottom after sending a message
        const messageContainer = document.getElementById('messages');
        scrollToBottomAbs(messageContainer);
      }
    });//send notification to the recipient for every message
    Meteor.call('sendNotification', otherStranger, `${currentUsername} replied to your experience: ${replyText}`,
     '/chat');
    Router.go("/chat");


  }
})

Template.groupCheersResults.helpers({
  resultsGroupedByNeedAndTriad() {

    let mySubs = this.submissions.filter(function(x){
      return x.uid === Meteor.userId();
    });

    let users = this.users;
    let subs = this.submissions;
    let images = this.images;

    let myNeedNames = mySubs.map(function(x){
      return x.needName;
    });
    // only show examples where the need names are unique
    myNeedNames = [... new Set(myNeedNames)];

    const needGroups = myNeedNames.map((needName) => {
      // images already filtered by activeIncident. Now get them for each need
      let needImages = images.filter(function(img){
        return img.needName == needName;
      });

      //grab username from img uid
      let names = needImages.map(function(img){
        return getUserById(users, img.uid);
      });

      let needSubs = subs.filter(function(sub){
        return sub.needName == needName;
      });
      let captions = needSubs.map(function(sub){
        return sub.content.sentence;
      });

      return {needName: needName,
        needSubs: needSubs,
        imagesGroupedByTriad: needImages,
        captions: captions,
        names: names};
    });

    return(needGroups);
  },
  elementAtIndex(arr, index){
    return arr[index];
  },
  lengthEqual(arr, number) {
    return arr.length === number;
  },
  createReacts(submissions, users, idx){
    return createReactString(submissions, users, idx);
  }
});

Template.monsterCreateResults.helpers({
  needGroups() {
    let mySubs = this.submissions.filter(function(x){
      return x.uid === Meteor.userId();
    });

    let users = this.users;
    let subs = this.submissions;
    let images = this.images;

    let myNeedNames = mySubs.map(function(x){ return x.needName;});
    // only show examples where the need names are unique
    myNeedNames = [... new Set(myNeedNames)];
    let monsterCreateNeedName = myNeedNames.find(n => n.search('monsterCreate') != -1);
    let monsterStoryNeedName = myNeedNames.find(n => n.search('monsterStory') != -1);

    let needGroups = myNeedNames.map((needName) => {
      if (needName == monsterCreateNeedName) {
        let needImages = images.filter(function(img){return img.needName == needName;});
        let needUsers = needImages.map(function(img){return getUserById(users, img.uid);});

        return {
          needName: needName,
          needImages: needImages,
          needUsers: needUsers
        };
      } else if (needName == monsterStoryNeedName) {
        let needSubs = subs.filter(s => s.needName == needName && s.uid != null);
        needSubs = needSubs.reverse();
        let needImages = needSubs.map(s => images.find(i => i._id == s.content.Preview));
        let needUsers = needSubs.map(s => getUserById(users, s.uid));
        let sentences = needSubs.map(s => s.content.sentence)
        let monsterLocations = needSubs.map(s => s.content.monsterLocation)

        return {
          needName: needName,
          needImages: needImages,
          needUsers: needUsers,
          sentences: sentences,
          monsterLocations: monsterLocations
        }
      }
    });

    return(needGroups);
  },
  elementAtIndex(arr, index){
    return arr[index];
  },
  lengthEqual(arr, len){
    return arr.length == len;
  },
  getDescendingIndex(images, idx){
    return (images.length - idx)
  },
  monsterLocation(monsterLocation){
    let row = parseInt(monsterLocation / 3) + 1
    let col = parseInt(monsterLocation % 3) + 1

    return {
      row: row.toString(),
      col: col.toString(),
    };
  }
});

Template.monsterCreateResults.events({
  'click #seeFullMonster'(event, template){
    event.target.classList.remove('unselected');
    event.target.classList.add('selected');
    let otherButton = document.getElementById("seeMonsterStory");
    otherButton.classList.add('unselected');
    otherButton.classList.remove('selected');
    document.getElementById('fullMonster').style.display = "block";
    document.getElementById('monsterStory').style.display = "none";
  },
  'click #seeMonsterStory'(event, template){
    event.target.classList.remove('unselected');
    event.target.classList.add('selected');
    let otherButton = document.getElementById("seeFullMonster");
    otherButton.classList.add('unselected');
    otherButton.classList.remove('selected');
    document.getElementById('fullMonster').style.display = "none";
    document.getElementById('monsterStory').style.display = "block";
  },
});

export const getPartner = (currentUser, users) => {
  let triad = Object.keys(currentUser.profile.staticAffordances).filter(k => k.search('triad') != -1)[0];
  let tag = 'stranger1' in currentUser.profile.staticAffordances? 'stranger2' : 'stranger1';
  let partner = users.filter(u =>
      u._id != currentUser._id &&
      triad in u.profile.staticAffordances &&
      tag in u.profile.staticAffordances
  )[0];
  return partner;
}

export const getMutualFriend = (currentUser, users) => {
  let triad = Object.keys(currentUser.profile.staticAffordances).filter(k => k.search('triad') != -1)[0];
  let friend = users.filter(u =>
      u._id != currentUser._id &&
      triad in u.profile.staticAffordances &&
      'friend' in u.profile.staticAffordances
  )[0];
  return friend;
}

Template.appreciationStationResults.helpers({
  isMutualFriend(){
    let currentUserID = Meteor.userId();
    let currentUser = this.users.filter(u => u._id == currentUserID)[0]
    if ('friend' in currentUser.profile.staticAffordances){
      return true;
    } else {
      return false;
    }
  },
  getNames(){
    let currentUserID = Meteor.userId();
    let currentUser = this.users.filter(u => u._id == currentUserID)[0]
    //if is mutual friend
    if ('friend' in currentUser.profile.staticAffordances){
      let triad = Object.keys(currentUser.profile.staticAffordances).filter(k => k.search('triad') != -1)[0];

      let others = this.users.filter(u =>
          u._id != currentUser._id &&
          triad in u.profile.staticAffordances
      );

      return {
        mutualFriend: currentUser.username,
        otherStranger: others[0].username,
        otherOtherStranger: others[1].username,
      }
    } else {
      let partner = getPartner(currentUser, this.users);
      let friend = getMutualFriend(currentUser, this.users);

      return  {
        otherStranger: partner.username,
        otherOtherStranger: currentUser.username,
        mutualFriend: friend.username,
      }
    }
  },
  getImagesAndSubs(){
    let needName;
    let currentUserID = Meteor.userId();
    let currentUser = this.users.filter(u => u._id == currentUserID)[0]

    if ('friend' in currentUser.profile.staticAffordances){
      let triad = Object.keys(currentUser.profile.staticAffordances).filter(k => k.search('triad') != -1)[0];
      let others = this.users.filter(u =>
          u._id != currentUser._id &&
          triad in u.profile.staticAffordances
      );
      needName = this.submissions.filter(s => s.uid == others[0]._id)[0].needName;
    } else {
      needName = this.submissions.filter(s => s.uid == currentUser._id)[0].needName;
    }

    let needImages = this.images.filter(i => i.needName == needName);
    let needCaptions = needImages.map(needImage =>
      this.submissions.filter(s => s.content.proof == needImage._id)[0].content.sentence
    )

    let results = [];
    for (let i = 0; i < needImages.length; i++){
      results[i] = {
        user: getUserById(this.users, needImages[i].uid),
        needImage: needImages[i],
        needCaption: needCaptions[i]
      }
    }

    return results;
  }
});

Template.lifeJourneyMapResults.events({
  'click .journeyMapButton'(event, template){
    let username = event.target.dataset.username;
    document.querySelectorAll('.userMap').forEach(userMap => userMap.style.display = "none");
    let userMapDOMel = document.querySelectorAll(`[data-user=${username}]`);
    userMapDOMel.forEach(el => el.style.display = 'block');
  }
});

Template.lifeJourneyMapResults.helpers({
  needUsers(){
    let currUserSub = this.submissions.filter(s => s.uid == Meteor.userId())[0];
    let needName = currUserSub.needName;
    let needSubs = this.submissions.filter(s => s.needName == needName);
    let needUsers = [...new Set(needSubs.map(s => s.uid))];
    return needUsers;
  },
  getUsername(uid){
    let user = this.users.filter(u => uid == u._id)[0];
    return user.username;
  },
  getUid(userMap){
    return userMap[0].uid;
  },
  userMaps(){
    let currUserSub = this.submissions.filter(s => s.uid == Meteor.userId())[0];
    let needName = currUserSub.needName;
    let needSubs = this.submissions.filter(s => s.needName == needName);
    let needUsers = [...new Set(needSubs.map(s => s.uid))];
    let userMaps;
    userMaps = needUsers.map(needUser =>
      this.images.filter(s => s.uid == needUser)
    )
    console.log(userMaps);
    return userMaps;
  }
})

Template.nightTimeSpooksResults.helpers({
  elementAtIndex(array, index){
    return array[index];
  },
  isEqual(x, y){
    return x === y;
  },
  getUsername(users, sub){
    let user = users.filter(u => sub.uid == u._id)[0];
    return user.username;
  },
  filterImages(subs){
    let images = subs.map(s => this.images.filter(i =>
      s.content.proof == i._id ||
      s.content.Preview == i._id)[0])
    return images;
  },
  getPartnerImage(images, index){
    let imageUser = images[index].uid
    let partnerImage = images.filter(i =>
      i.uid != imageUser &&
      i.needName.search('nightTimeSpooks') != -1)[0];
    return partnerImage;
  },
  filterSubs(){
    let currUser = Meteor.userId();
    let currUserSubs = this.submissions.filter(s => s.uid == currUser);
    let uniqueNeedNames = [...new Set(currUserSubs.map(s => s.needName))];
    //only get subs that are already filled
    let subs = this.submissions.filter(
      s => uniqueNeedNames.includes(s.needName)
      && s.uid);
    return subs;
  },
  getFirst(index){
    let result;
    index == 0? result = "block": result = "none";
    return result;
  },
  notFirst(index) {
    return index != 0;
  },
  notLast(subs, index){
    return index < (subs.length-1);
  }
});

Template.nightTimeSpooksResults.events({
  'click .prev'(event, template){
    let currSlideIdx = parseInt(event.target.dataset.currslide);
    let slide = document.getElementById(`img${currSlideIdx}`);
    let prevSlide = document.getElementById(`img${currSlideIdx-1}`);
    slide.style.display = "none";
    prevSlide.style.display = "block";

  },
  'click .next'(event, template){
    let currSlideIdx = parseInt(event.target.dataset.currslide);
    console.log(currSlideIdx);
    let slide = document.getElementById(`img${currSlideIdx}`);
    let nextSlide = document.getElementById(`img${currSlideIdx+1}`);
    slide.style.display = "none";
    nextSlide.style.display = "block";
  }
});

Template.groupCheersResults.events({
     'click .reactWow'(event, template){
      let idx = parseInt(event.target.parentNode.dataset.val);
      let needName = event.target.parentNode.dataset.needname;
      let needSubs = this.submissions.filter(function(sub){
        return sub.needName == needName;
      });
      react = event.target.textContent;
      reactSubmission(react, this.users, needSubs[idx]);
    },
    'click .reactHeart'(event, template){
      let idx = parseInt(event.target.parentNode.dataset.val);
      let needName = event.target.parentNode.dataset.needname;
      let needSubs = this.submissions.filter(function(sub){
        return sub.needName == needName;
      });
      react = event.target.textContent;
      reactSubmission(react, this.users, needSubs[idx]);
    },
    'click .reactLaugh'(event, template){
      let idx = parseInt(event.target.parentNode.dataset.val);
      let needName = event.target.parentNode.dataset.needname;
      let needSubs = this.submissions.filter(function(sub){
        return sub.needName == needName;
      });
      react = event.target.textContent;
      reactSubmission(react, this.users, needSubs[idx]);
    }
});

export const getUserById = (users_arr, uid) => {
  let user = users_arr.find(function(x) {
    return x._id === uid;
  });
  if (uid){
    return user.username;
  } else {
    return null;
  }
};

export const createReactString = (submissions, users, idx) => {
  reactionString = "";

  //grab correct submission

  if (submissions[idx].content["react"]){
    for (i=0; i<submissions[idx].content["react"].length;i++){
      let username = getUserById(users, submissions[idx].content["reactUser"][i]);
      let react = submissions[idx].content["react"][i];
      reactionString = reactionString + username + ": " + react + " ";
    }
  };
  return reactionString;
}

export const reactSubmission = (react, users, submission) => {
  let notification = true;
  const uid = Meteor.userId();
  const name = getUserById(users, uid);
  //use uid
  if (!submission.content["react"]){
    submission.content["react"] = [react];
    submission.content["reactUser"] = [uid];
  } else {
    //if user already reacted, they can change reaction
    if (submission.content["reactUser"].includes(uid)){
      let idx = submission.content["reactUser"].indexOf(uid);
      submission.content["react"][idx] = react;
      notification = false;
    } else {
    //else just push reaction
      submission.content["react"].push(react);
      submission.content["reactUser"].push(uid);
    }
  }

  let submissionObject = {
    uid: uid,
    eid: submission.eid,
    iid: submission.iid,
    _id: submission._id,
    needName: submission.needName,
    content: submission.content,
    timestamp: submission.timestamp,
    lat: submission.lat,
    lng: submission.lng
  };

  Meteor.call('updateSubmission', submissionObject);
  //notify participant of reaction
  if (notification){
    Meteor.call('sendNotification', [submission.uid], submission.needName, name + ' reacted to your cheers!',
     '/apicustomresults/' + submission.iid + '/' + submission.eid);
 }
};

Template.imitationGameResults.helpers({
  content() {
    let currentUser = this.users.find(x => x._id === Meteor.userId());
    let userSub = this.submissions.find(s => s.uid === currentUser._id);
    let needName = userSub.needName;
    let subs = this.submissions.filter(s => s.needName == needName && s.uid != null);

    let results = subs.map((s) => {
      let map = {}
      map.name = getUserById(this.users, s.uid)

      if (s.content.proof){
        map.content = this.images.find(i => i._id == s.content.proof);
      } else {
        map.content = s.content.sentence;
      }
      return map;
    });

    console.log(results);
    return results;
  },
  elementAtIndex(index, array){
    return array[index]
  },
  lengthLessOrEq(upperBound, array){
    return array.length >= upperBound
  }
});

/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} Array to split
 * @param chunkSize {Integer} Size of every group
 * @see https://ourcodeworld.com/articles/read/278/how-to-split-an-array-into-chunks-of-the-same-size-easily-in-javascript
 */
export const chunkArray = (myArray, chunk_size) => {
  let results = [];

  while (myArray.length) {
    results.push(myArray.splice(0, chunk_size));
  }

  return results;
};

Template.halfhalfResults.helpers({
  lengthEqual(arr, number) {
    return arr.length === number;
  },
  getUserById(users_arr, uid) {
    let user = users_arr.find(function(x) {
      return x._id === uid;
    });
    return user;
  },
  elementAtIndex(arr, index){
    return arr[index];
  },
  /** So we can show the contributions of a dyad, for each need
   * @returns {needName: String, imagesGroupedByDyad: [(a,b) (c, d) (e)]}
   */
  resultsGroupedByNeedAndDyad() {

    let mySubs = this.submissions.filter(function(x){
      return x.uid === Meteor.userId();
    });

    let myNeedNames = mySubs.map(function(x){
      return x.needName;
    });

    // only show examples where the need names are unique
    myNeedNames = [... new Set(myNeedNames)];

    return myNeedNames.map((needName) => {
      // images already filtered by activeIncident. Now get them for each need
      let needImages = this.images.filter((img) => {
        return img.needName == needName;
      });

      return {needName: needName, imagesGroupedByDyad: chunkArray(needImages, 2)};
    });
  }
});

Template.halfhalfResults_admin.helpers({
  lengthEqual(arr, number) {
    return arr.length === number;
  },
  getUserById(users_arr, uid) {
    let user = users_arr.find(function(x) {
      return x._id === uid;
    });
    return user;
  },
  elementAtIndex(arr, index){
    return arr[index];
  },
  /** So we can show the contributions of a dyad, for each need
   * @returns {needName: String, imagesGroupedByDyad: [(a,b) (c, d) (e)]}
   */
  resultsGroupedByNeedAndDyad() {

    let mySubs = this.submissions;

    let myNeedNames = mySubs.map(function(x){
      return x.needName;
    });

    // only show examples where the need names are unique
    myNeedNames = [... new Set(myNeedNames)];

    return myNeedNames.map((needName) => {
      // images already filtered by activeIncident. Now get them for each need
      let needImages = this.images.filter((img) => {
        return img.needName == needName;
      });

      return {needName: needName, imagesGroupedByDyad: chunkArray(needImages, 2)};
    });
  }
});

Template.scavengerHunt.helpers({
  categories() {
    let needNames = this.experience.contributionTypes.map(function(x){
      return x.needName;
    });
    let categoriesSet = new Set(needNames);
    return [...categoriesSet];
  },
  imagesByCategory(category){

    let specific = this.images.filter(function(x){
      return x.needName === category;
    });

    return specific;
  },
  getNeed(image){
    return image.needName
  },
  uncompletedNeeds(){
    let needs = this.experience.contributionTypes.map(function(x){
      return x.needName;
    });
    completedNeeds = [];
    for (i=0; i<this.images.length; i++){
      completedNeeds.push(this.images[i].needName);
    }
    let unfinished = needs.filter(x => !completedNeeds.includes(x))
    return unfinished
  },
  numTasksRemaining(){
    return this.images.length + "/" + this.experience.contributionTypes.length + " tasks completed";
  },
  onlySubmission(){
    if (this.images.length<=1){
      return true;
    }
  }
});

// KEVIN AND NINA  + Jenny COLLECTIVE NARRATIVE
Template.survivingThriving.helpers({
  // let timeBlocks = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  categories() {
    let needNames = this.experience.contributionTypes.map(function(x){
      console.log("x ", x);
      return x.needName;
    });
    let categoriesSet = new Set(needNames);
    console.log("Hi ", categoriesSet);
    return [...categoriesSet];
  },
  castCategories(){
    //To-do: access castCategories
    // let castCategories = ['thriving', 'surviving'];

    // let castCategories = ['😃','🙏','😌','😬', '😫', '😢'];
    let castCategories = ['Similar', 'Different']
    // console.log("Time " + Date.now());
    return castCategories;
  },
  timeBlocks(){
    // let timeBlocks = ['12 AM', '2 AM', '4 AM', '6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM', 'End of Day'];
    // let timeBlocks = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    // let timeBlocks = [0, 1, 2, 3, 4, 5, 6];
    let timeBlocks = [0, 1, 2];
    return timeBlocks;
  },
  subByCastCategory(cat, block){
    // let timeBlocks = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    //submissions by category --> all thriving submission
    // console.log("block ", block);

    // find submission in database with user id then find the emotion correlated with the userid to check if the current cat is that
    // find all posts by the current user and find all the emotions but pick the most recent
    let current_situation = "beginning_"
    if (block === 1){
      current_situation = "during_"
    }
    else if (block === 2){
      current_situation = "after_"
    }

    let user_emotions = Submissions.find({
      uid: Meteor.userId(),
      needName: { $in: [ current_situation+"library", current_situation+"cafe" ] }
    }).fetch().map(function (x) {
      return x.castCategory;
    });

    let current_emotion = user_emotions[0]


    // if (cat === "happy") {
    //   cat = "😃";
    // }
    // else if (cat === "relieved"){
    //   cat = "😌"
    // }
    // else if (cat === "hopeful"){
    //   cat = "🙏"
    // }
    // else if (cat === "exhausted") {
    //   cat = "😫";
    // }
    // else if (cat === "anxious"){
    //   cat = "😬"
    // }
    // else if (cat === "sad"){
    //   cat = "😢"
    // }

    // if (cat === 'Similar'){
    //   cat = true
    // }
    // else{
    //   cat = false
    // }

    const completedSubmissions = Submissions.find({"uid": {$ne: null}}).fetch();
    let subsByCat = completedSubmissions.filter(function(sub){
      // console.log("BLOCKKKKK", block);

      // let day = block.substr(0, 3);
      // console.log("cat ", cat);
      // console.log("sub ", sub.castCategory);
      // && (sub.timestamp === day)

      // if sub.castCategory is 'similar' and if cat is the same as the user's emotion
      // elif sub.castCategory is 'different'' and if cat is not the same as the user's emotion

      // before
      // console.log('SUB', sub.castCategory)
      // console.log(sub.castCategory === current_emotion)
      // if (sub){
        // check if it's the first time block and it's a Sunday, Monday, or Tuesday

        let day = sub.timestamp.getDay()
        let subcastcategory = sub.castCategory
        // debugger;

        // first time block and Monday
        if (block === 0 && ((sub.timestamp.getDay() === 0) || ((sub.timestamp.getDay() === 1)))){
          if ((cat === 'Similar') && sub.castCategory === current_emotion){ // if we are in 'Similar' column and same emotion
            // debugger;
            return sub
          }
          else if ((cat === 'Different') && (sub.castCategory !== current_emotion)){ // if 'Different' column and different emotion
            return sub
          }
        }

        // second time block and Tuesday
        else if ((block === 1) && ((sub.timestamp.getDay() === 2) )){
          if ((cat === 'Similar') && sub.castCategory === current_emotion){
            debugger;
            return sub
          }
          else if ((cat === 'Different') && (sub.castCategory !== current_emotion)){
            return sub
          }
        }

        // third time block and Wednesday+
        else if ((block === 2) && ((sub.timestamp.getDay() === 3) ||(sub.timestamp.getDay() === 4) ||(sub.timestamp.getDay() === 5) || (sub.timestamp.getDay() === 6))){
          if ((cat === 'Similar') && sub.castCategory === current_emotion){
            return sub
          }
          else if ((cat === 'Different') && (sub.castCategory !== current_emotion)){
            return sub
          }
        }

      // }



      // if ((sub.castCategory === cat) && (block === 0) && ((sub.timestamp.getDay() === 0) || ((sub.timestamp.getDay() === 1) || (sub.timestamp.getDay() === 2)))) {
      // // console.log("BBBBBLOOOCKKK", getTimeBlock(block))
      // // if ((sub.castCategory === cat) && (block.includes(sub.timestamp.getDay().toString()))) {
      // // if ((sub.castCategory === cat) && (1 === block)) {
      //   return sub;
      // }
      // else if ((sub.castCategory === cat) && (block === 1) && ((sub.timestamp.getDay() === 3) || (sub.timestamp.getDay() === 4))) {
      //   // console.log("BBBBBLOOOCKKK", getTimeBlock(block))
      //   // if ((sub.castCategory === cat) && (block.includes(sub.timestamp.getDay().toString()))) {
      //   // if ((sub.castCategory === cat) && (1 === block)) {
      //   return sub;
      // }
      // else if ((sub.castCategory === cat) && (block === 2) && ((sub.timestamp.getDay() === 5) || (sub.timestamp.getDay() === 6))) {
      //   // console.log("BBBBBLOOOCKKK", getTimeBlock(block))
      //   // if ((sub.castCategory === cat) && (block.includes(sub.timestamp.getDay().toString()))) {
      //   // if ((sub.castCategory === cat) && (1 === block)) {
      //   return sub;
      // }
    });

    // console.log("DOES IT NOT GET HERE HWY")
    // console.log("sub ", subsByCat);
    return subsByCat;
  },
  getTimeBlock(block) {
    // let timeBlocks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // let timeBlocks = ['012', '34', '56'];
    let timeBlocks = ['Before', 'During', 'After']
    return timeBlocks[block];
  },
  getCast(cast) {
    // console.log("CAST ", cast);
    let capitalizedCast = cast[0].toUpperCase()+cast.slice(1);
    return capitalizedCast;
  },
  getImageSub(sub) {
    // console.log("Hi " + sub.content.proof);

    // OLD USE OF METEOR CFS
    // creatorSub = this.images.find(i => i._id === sub.content.proof);
    // return creatorSub;

    // S3 URL
    return sub.content.proof;
  },
  getUsername(sub){
    let fullname = this.users.filter(function(user){
      if (user._id === sub.uid) {
        return user;
      }
    });

    return fullname[0].profile.firstName + " " + fullname[0].profile.lastName;
  },
  getTimeStamp(sub){
    return sub.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  },
  getEmotion(sub){
    if (sub.castCategory !== undefined){
      let fullname = this.users.filter(function(user){
        if (user._id === sub.uid) {
          return user;
        }
      });
      let placeholder = fullname[0].profile.firstName  + ' is feeling ' + sub.castDescription + ' - ' + sub.castCategory;
      return placeholder;
    }
    else{
      console.log(sub.castDescription)
      return "\"" + sub.castDescription + "\"";
    }
  },
  getSentence(sub){
    // console.log('in get sentence')
    if (sub.content.sentence === undefined){
      console.log('in if')
      let fullname = this.users.filter(function(user){
        if (user._id === sub.uid) {
          return user;
        }
      });
      let placeholder = fullname[0].profile.firstName  + ' is feeling ' + sub.castCategory + ' .';
      return placeholder;
    }
    else{
      // console.log('in else')
      return '\"' + sub.content.sentence + '\"';
    }
  }
});

Template.storyBook_noInterdependence.helpers({
  notFirst(index) {
    return index !== 0;
  },
  notLast(index){
    // number of images is the number of pages
    return index < this.images.length - 1;
  },
  completedSubmissions(subs){
    return subs.filter((sub) => {
      return sub.uid !== null;
    })
  }
});

Template.storybook.helpers({
  notFirst(index){
    return index !==0;
  },
  notLast(index){
    return (index) < this.images.length;
  },
  firstSentence(){
    let pageOne = this.experience.contributionTypes.find(function(x) {
      return x.needName === "pageOne";
    });
    return pageOne.toPass.firstSentence;
  },
  previousSentence(index){
    const instance = Template.instance()
    let previousSubmission = instance.data.submissions[index-1];
    return previousSubmission.content.sentence
  },
  previousSentenceAuthorUid(index) {
    const instance = Template.instance()
    let previousSubmission = instance.data.submissions[index-1];
    return previousSubmission.uid;
  }
});

let slideIndex = 1;
function plusSlides(n) {
  console.log("increasing by", n);
  console.log("currently on", slideIndex);
  showSlides(slideIndex += n);
}
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}

  slides[slideIndex-1].style.display = "block";
}

Template.storybook.onRendered(function() {
  this.autorun(() => {
    showSlides(1);
  });
});

Template.storyBook_noInterdependence.onRendered(function() {
  this.autorun(() => {
    showSlides(1);
  });
});

Template.storybook.events({
  'click .prev'(event, instance) {
    event.preventDefault();
    plusSlides(-1)
  },
  'click .next'(event, instance) {
    event.preventDefault();
    plusSlides(1)
  }
});
Template.storyBook_noInterdependence.events({
  'click .prev'(event, instance) {
    event.preventDefault();
    plusSlides(-1)
  },
  'click .next'(event, instance) {
    event.preventDefault();
    plusSlides(1)
  }
});

let timeout = null;

let sunsetSlideIndex = 1;

function showSlidesAuto() {

  // let i
  let slides = document.getElementsByClassName("sunsetSlides");
  console.log("SLIDES", slides.length)
  // for (i = 0; i < slides.length; i++) {
  //   // slides[i].style.display = "none";
  //   // console.log(slides[i])
  // }
  sunsetSlideIndex++;

  if (sunsetSlideIndex > slides.length) {sunsetSlideIndex = 1}
  if (sunsetSlideIndex < 1) {sunsetSlideIndex = slides.length}
  if (slides[sunsetSlideIndex-1]) {
    slides[sunsetSlideIndex-1].style.display = "block";
  } else {
    console.error(`slides[${sunsetSlideIndex-1}] undefined`);
    console.log(slides.item(sunsetSlideIndex-1));
    console.log('------');
  }
  timeout = Meteor.setTimeout(showSlidesAuto, 1500);
};


Template.cookSlides.helpers({
  textValue: function(submission) {
    if (submission.content.sentence != undefined) {
      return submission.content.sentence;
    } else {
      return "...";
    }
  },
  imageValue: function(submission) {
    console.log("Final submission: ", submission);
    if (submission.content.proof != undefined) {
      let element = document.createElement('div');
      element.innerHTML = 'chocolate';
      console.log(element);
      // document.getElementByClassName("sunsetSlides").appendChild(element);
      // return 0;
      return submission.content.proof;
    } else {
      return "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E";
    }
  },
  Example: function(){
    console.log()
  },
  objective:function(){
    return this.incident.contributionTypes[0].toPass.scene_description.objective
    console.log(this.incident.contributionTypes[0].toPass.scene_description.objective)
  },
  topic: function(){
    console.log("bettersubmission: ", this.betterSubmissions)
    return this.incident.contributionTypes[0].toPass.scene_description.topic
  },
  Name: function(){
    // debugger;
    // console.log(this.incident.name)
    // debugger;
    return this.incident.contributionTypes[0].toPass.story_topic

  },
  previousScene: function(){
    console.log("aha")
  },
  Getpic(index){
    // if(this.submissions[index] != undefined){
    //   console.log(this.submissions[index].content.proof)
    //   return this.submissions[index].content.proof
    // }
    console.log(this.submissions[index].content.proof)
    if (this.submissions[index].content.proof != undefined){
      return this.submissions[index].content.proof
    }
    else{
      return "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"
    }
   
  },
  

  Fxxkthat(){
    // console.log("Fxxk", index)
    // console.log("Fxxk", this.betterSubmissions[index])
    console.log(this.betterSubmissions[0].content.proof)
    return this.betterSubmissions[0].content.proof
  },
  

  Fxxkthat2(){
    let a = this.betterSubmissions[1].content.proof
    console.log(a)
    if (a != undefined){
      return this.betterSubmissions[1].content.proof
    }
    else{
      return "/"
    }
  },
  Contextb(){
    for (const i of this.betterSubmissions){
      if(i.needName = "Context Building1"){
        return true
      }
    }
    return false
    
   
    
  },
  Contextb_value(){
    // return this.betterSubmissions.filter(submission => submission.content.Needname == "Context Building1")
    const res = this.betterSubmissions.filter(submission => submission.needName = "Context Building1")
    // console.log("context building shit: ", res)
    return res
  },

  Subjectresolution(){
    for (const i of this.betterSubmissions){
      if(i.needName = "Character Introduction"){
        return true
      }
    }
    return false
  },
  Subjectresolution_value(){
    const res = this.betterSubmissions.filter(submission => submission.needName = "Character Introduction")
    console.log("subject: ", res)
    return res
  },

  GetSubject(index){
    return this.betterSubmissions[index].content.sentence1
  },
     
  GetLocation(index){
    return this.betterSubmissions[index].content.sentence2
  }

  
});


Template.sunset.helpers({
  textValue: function(submission) {
    if (submission.content.sentence != undefined) {
      return submission.content.sentence;
    } else {
      return "...";
    }
  },

  currentPics: function () {
    console.log("THIS SUBMISSIONS: ", this.submissions);
    return this.submissions.filter(submission => submission.content != {});
  },

  imageValue: function(submission) {
    if (submission.content.proof != undefined) {
      let element = document.createElement('div');
      element.innerHTML = 'chocolate';
      console.log(element);
      // document.getElementByClassName("sunsetSlides").appendChild(element);
      // return 0;
      return submission.content.proof;
    } else {
      return "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E";
    }
  }
});



Template.sunset.onRendered(function() {
  this.autorun(() => {
    console.log("I'm going here!")
    // showSlidesAuto();
    // window.onload = function () {
    //   console.log("run slideshow before");
    //   // showSlidesAuto();
    //   console.log("run slideshow after");
    // }
  });
})

Template.sunset.onDestroyed(function() {
  this.autorun(() => {
    console.log("destroyed")
    Meteor.clearTimeout(timeout)
    timeout = null;
  });
});

Template.cookSlides.onRendered(function() {
  this.autorun(() => {
    console.log("I'm going here!")
    // showSlidesAuto();
    // window.onload = function () {
    //   console.log("run slideshow before");
    //   // showSlidesAuto();me
    //   console.log("run slideshow after");
    // }
  });
})

Template.cookSlides.onDestroyed(function() {
  this.autorun(() => {
    console.log("destroyed")
    Meteor.clearTimeout(timeout)
    timeout = null;
  });
});

Template.api_custom_results.events({
  "click .item-contribution"(event, target){
    //getting submission id of this item
    //because in html, item-contribution uses sub id as id
    const sid = event.currentTarget.id;
    const expandUrl = Iron.Location.get().path + '/'+sid;
    Router.go(expandUrl);
  }
});