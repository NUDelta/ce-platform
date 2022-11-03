import './api_custom.html';
import '../components/contributions.html';
import '../components/loading_overlay.html';
import '../components/loading_overlay.js';
import '../components/loading_overlay.scss';

import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';

import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { Experiences, Incidents } from "../../api/OCEManager/OCEs/experiences";
import { Locations } from '../../api/UserMonitor/locations/locations';
import { Avatars, Images } from '../../api/ImageUpload/images.js';
import { Submissions } from "../../api/OCEManager/currentNeeds";
import {Notification_log} from "../../api/Logging/notification_log";

import { photoInput } from './photoUploadHelpers.js'
import { photoUpload } from './photoUploadHelpers.js'
import {Meteor} from "meteor/meteor";
import {needIsAvailableToParticipateNow} from "../../api/OpportunisticCoordinator/strategizer";


// HELPER FUNCTIONS FOR LOADING CUSTOM EXPERIENCES
Template.api_custom.helpers({

  data() {
    let navbar = document.querySelector(".nav-footer");
    navbar.style.display = "none";
    let currentNeed = this.incident.contributionTypes.find(function (x) {
      return x.needName == FlowRouter.getParam('needName');
    });

    this.iid = FlowRouter.getParam('iid');
    this.needName = FlowRouter.getParam('needName');
    this.toPass = currentNeed.toPass;

    return this;
  },

});
Template.storyPage.helpers({
  pageOne() {
    return this.needName === 'pageOne'
  },
  notLast(){
    return this.needName !== 'pageFinal';
  }
});

Template.bumped.helpers({
  nameOfFriend() {
    let needName = this.needName;

    let notification =  this.notification_log.find(function (x) {
      return (x.needName === needName) && (x.uid !== Meteor.userId()) ;
    });

    let user = this.users.find(function(x){
      return x._id === notification.uid;
    });
    return user.username;
  },
  friendInfo(){
    let needName = this.needName;

    let notification =  this.notification_log.find(function (x) {
      return (x.needName === needName) && (x.uid !== Meteor.userId()) ;
    });

    let user = this.users.find(function(x){
      return x._id === notification.uid;
    });
    let friendName =  user.username;

    return {key: 'nameOfFriend', value: friendName};
  }
});


Template.nightTimeSpooks.onCreated(() => {
  Template.instance().imageSubmitReady = new ReactiveVar(false);
  Template.instance().cameraStarted = new ReactiveVar(false);
});

Template.nightTimeSpooks.onDestroyed(() => {
  CameraPreview.stopCamera();
});

Template.nightTimeSpooks.helpers({
  getInstruction1(){
    //get current user & then find static affordances
    let currentUserID = Meteor.userId();
    let currentUser = this.users.filter(u => u._id == currentUserID)[0];
    //show instruction1 if user hasn't done the first part yet
    if (currentUser.profile.staticAffordances.participatedInNightTimeSpooks){
      return "none";
    } else {
      return "block";
    }
  },
  getInstruction2(){
    let currentUserID = Meteor.userId();
    let currentUser = this.users.filter(u => u._id == currentUserID)[0];
    //show instruction2 if user has done the first part
    if (currentUser.profile.staticAffordances.participatedInNightTimeSpooks){
      return "block";
    } else {
      return "none";
    }
  },
  getPartnerUsername(){
    let currentUserID = Meteor.userId();
    let currentUser = this.users.filter(u => u._id == currentUserID)[0]
    let partner = getPartner(currentUser, this.users);
    return partner.username;
  },
  getPartnerImage(){
    let currentUserID = Meteor.userId();
    let currentUser = this.users.filter(u => u._id == currentUserID)[0]
    let partner = getPartner(currentUser, this.users);
    let partnerImage = this.images.filter(
      s => s.uid == partner._id
      && s.needName=="nightTimeSpooks")[0]
    return partnerImage;
  },
  getPartnerCaption(){
    let currentUserID = Meteor.userId();
    let currentUser = this.users.filter(u => u._id == currentUserID)[0]
    let partner = getPartner(currentUser, this.users);
    let partnerSub = this.submissions.filter(
      s => s.uid == partner._id
      && s.needName=="nightTimeSpooks")[0];
    return partnerSub.content.sentence;
  }
});

Template.nightTimeSpooks.events({
'click #takePhoto'(event, template){
  if (typeof CameraPreview !== 'undefined') {
    toggleCameraControls('takePhotoInProgress');
    CameraPreview.takePicture({
      width: 480, height: 640, quality: 85
    },function(imgData){
        let rect = getPreviewRect();
        b64CropLikeCordova(imgData, rect.width, rect.height, function(croppedImgUrl) {
          // using an instance of jquery tied to current template scope
          let imagePreview = template.$(".fileinput-preview");
          imagePreview.attr('src', croppedImgUrl);
          imagePreview.show();
          template.imageSubmitReady.set(true);
          CameraPreview.hide();
          toggleCameraControls('takePhotoDone');
          document.getElementById('textbox').style.display = "block";
          document.getElementById('submit').style.visibility = "visible";
        });
    });
  } else {
    console.error("Could not access the CameraPreview");
  }
},
'click #retakePhoto'(event, template){
  if (typeof CameraPreview !== 'undefined') {
    CameraPreview.show()
  } else {
    console.error("Could not access the CameraPreview")
  }
  $(".fileinput-preview").hide();
  template.imageSubmitReady.set(false);
  toggleCameraControls('startCamera');
  document.getElementById('textbox').style.display = "none";
  document.getElementById('submit').style.visibility = "hidden";
},
'click #switchCamera'(){
  if (typeof CameraPreview !== 'undefined') {
    CameraPreview.switchCamera();
  } else {
    console.error("Could not access the CameraPreview")
  }
},

'click #goToParticipate2'(event, template) {
  document.getElementById('instruction2').style.display = "none";
  document.getElementById('triparticipate').style.display = "block";

  if (template.cameraStarted.get()) {
    if (!template.imageSubmitReady.get()) {
      CameraPreview.show();
    }
  } else {
    Meteor.setTimeout(() => {
      if (typeof CameraPreview !== 'undefined') {
        startCameraAtPreviewRect();
        template.cameraStarted.set(true);
      } else {
        console.error("Could not access the CameraPreview")
      }
      template.$(".fileinput-preview").hide();
      template.imageSubmitReady.set(false);
      toggleCameraControls('startCamera');
    }, 300);
  }
},
'click #goToParticipate1'() {
  document.getElementById('instruction1').style.display = "none";
  document.getElementById('participate').style.display = "block";
},
'click #goToInstruction1'() {
  document.getElementById('instruction1').style.display = "block";
  document.getElementById('participate').style.display = "none";
},
'click #goToInstruction2'() {
  document.getElementById('instruction2').style.display = "block";
  document.getElementById('triparticipate').style.display = "none";
  CameraPreview.hide();
}
});

//helper functions for finding the other users
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

export const getUsernameFromUid = (uid, users) => {
  let user = users.filter(u => uid == u._id)[0];
  return user.username;
}

Template.appreciationStation.helpers({
  getNames(){
    let currentUserID = Meteor.userId();
    let currentUser = this.users.filter(u => u._id == currentUserID)[0]
    let partner = getPartner(currentUser, this.users);
    let friend = getMutualFriend(currentUser, this.users);

    return  {
      otherStranger: partner.username,
      mutualFriend: friend.username
    }
  }
})


Template.appreciationStation.events({
'click #goToParticipate'(event, template){
  document.getElementById('instruction').style.display = "none";
  document.getElementById('participate').style.display = "block";
  },
  'click #goToInstruction'(event, template){
    document.getElementById('instruction').style.display = "block";
    document.getElementById('participate').style.display = "none";
  }
})

Template.lifeJourneyMap.helpers({
  isFirstStyle(){
    let currUserId = Meteor.userId();
    let currUserImagesLen = this.images.filter(i => i.uid == currUserId).length;
    return currUserImagesLen == 0? 'block' : 'none';
  },
  notIsFirstStyle(){
    let currUserId = Meteor.userId();
    let currUserImagesLen = this.images.filter(i => i.uid == currUserId).length;
    return currUserImagesLen == 0? 'none' : 'block';
  },
  maps(){
    let currUserId = Meteor.userId();
    let currUserImages = this.images.filter(i => i.uid == currUserId);
    return currUserImages;
  }
})

Template.lifeJourneyMap.events({
'click #goToParticipate'(event, template){
  document.getElementById('instruction').style.display = "none";
  document.getElementById('participate').style.display = "block";
  },
  'click #goToInstruction'(event, template){
    document.getElementById('instruction').style.display = "block";
    document.getElementById('participate').style.display = "none";
  }
})


Template.monsterCreate.onCreated(() => {
  Template.instance().imageSubmitReady = new ReactiveVar(false);
  Template.instance().cameraStarted = new ReactiveVar(false);
});

Template.monsterCreate.onDestroyed(() => {
  CameraPreview.stopCamera();
});

Template.monsterCreate.events({
'click #takePhoto'(event, template){
  if (typeof CameraPreview !== 'undefined') {
    toggleCameraControls('takePhotoInProgress');
    CameraPreview.takePicture({
      width: 480, height: 640, quality: 85
    },function(imgData){
        let rect = getPreviewRect();
        b64CropLikeCordova(imgData, rect.width, rect.height, function(croppedImgUrl) {
          // using an instance of jquery tied to current template scope
          let imagePreview = template.$(".fileinput-preview");
          imagePreview.attr('src', croppedImgUrl);
          imagePreview.show();
          template.imageSubmitReady.set(true);
          CameraPreview.hide();
          toggleCameraControls('takePhotoDone');
        });
    });
  } else {
    console.error("Could not access the CameraPreview");
  }
},
'click #retakePhoto'(event, template){
  if (typeof CameraPreview !== 'undefined') {
    CameraPreview.show()
  } else {
    console.error("Could not access the CameraPreview")
  }
  $(".fileinput-preview").hide();
  template.imageSubmitReady.set(false);
  toggleCameraControls('startCamera');
},
'click #switchCamera'(){
  if (typeof CameraPreview !== 'undefined') {
    CameraPreview.switchCamera();
  } else {
    console.error("Could not access the CameraPreview")
  }
},
'click #goToParticipate1'(event, template) {
  document.getElementById('instruction1').style.display = "none";
  document.getElementById('triparticipate').style.display = "block";

  if (template.cameraStarted.get()) {
    if (!template.imageSubmitReady.get()) {
      CameraPreview.show();
    }
  } else {
    Meteor.setTimeout(() => {
      if (typeof CameraPreview !== 'undefined') {
        startCameraAtPreviewRect();
        template.cameraStarted.set(true);
      } else {
        console.error("Could not access the CameraPreview")
      }
      template.$(".fileinput-preview").hide();
      template.imageSubmitReady.set(false);
      toggleCameraControls('startCamera');
    }, 300);
  }
},
'click #goToParticipate2'(event, template) {
  document.getElementById('instruction2').style.display = "none";
  document.getElementById('participate').style.display = "block";

  if (template.cameraStarted.get()) {
    if (!template.imageSubmitReady.get()) {
      CameraPreview.show();
    }
  } else {
    Meteor.setTimeout(() => {
      if (typeof CameraPreview !== 'undefined') {
        startCameraAtPreviewRect();
        template.cameraStarted.set(true);
      } else {
        console.error("Could not access the CameraPreview")
      }
      template.$(".fileinput-preview").hide();
      template.imageSubmitReady.set(false);
      toggleCameraControls('startCamera');
      }, 300);
    }
  },
  'click #goToInstruction1'() {
    document.getElementById('instruction1').style.display = "block";
    document.getElementById('triparticipate').style.display = "none";
    CameraPreview.hide();
  },
  'click #goToInstruction2'() {
    document.getElementById('instruction2').style.display = "block";
    document.getElementById('participate').style.display = "none";
    CameraPreview.hide();
  },
  'click .grid-square'(event){
    event.stopPropagation();
    let monster = document.getElementById("monster");
    event.target.append(monster);
  }
});

Template.monsterCreate.helpers({
  isMonsterCreate(needName){
    return needName.search('monsterCreate') != -1;
  },
  stitchedMonster(needName){
    let triad = needName.split("monsterStory");
    let oldNeedName = `monsterCreate${triad[1]}`;
    images = this.images.filter(i => i.needName == oldNeedName);
    return images;
  },
  otherName(){
    let currParticipantId = Meteor.userId();
    let aff = this.users.filter(u => u._id == currParticipantId)[0].profile.staticAffordances;
    let triad = Object.keys(aff).filter(k => k.search('triad') != -1)[0];
    let otherUser = this.users.find(u => (u._id != currParticipantId)
      && (triad in u.profile.staticAffordances) && !('friend' in u.profile.staticAffordances));
    return otherUser.username;
  },
  elementIndex(array, index){
    return array[index];
  },
  mostRecentImageTriadForNeed(images, needName) {
    // assure they are sorted in ascending (first uploadedAt first)
    images = images.sort(function(x, y) {
      return x.uploadedAt - y.uploadedAt;
    });
    let needImages = images.filter(function(x) {
      return x.needName === needName;
    });
    let imagesGroupedByTriad = chunkArray(needImages, 3);
    if(imagesGroupedByTriad.length == 0){
      return [];
    }
    else {
      return imagesGroupedByTriad[imagesGroupedByTriad.length - 1];
    }
  },
  arrayLenEqual(array, len){
    return array.length === len;
  },
  elementIndex(array, index){
    return array[index];
  },
  submitDisplayValue() {
    // when image submit is ready, submit button should be shown
    if (Template.instance().imageSubmitReady.get()) {
      return "block";
    } else {
      return "none";
    }
  }
});

Template.groupBumped.helpers({
  // @TODO - determine if we won't need this then delete
  friendNames() {
    const friends = this.users.filter(friend => {
      return this.notification_log.filter(notif => friend._id == notif.uid && friend._id !== Meteor.userId()).length > 0;
    });

    return {
      friendOne: friends[0].username,
      friendTwo: friends[1].username
    }
  },
  getNeedImages(images, needName){
    images = images.sort(function(x, y) {
      return x.uploadedAt - y.uploadedAt;
    });
    let needImages = images.filter(function(x) {
      return x.needName === needName;
    });
    let imagesGroupedByTriad = chunkArray(needImages, 3);
    if(imagesGroupedByTriad.length == 0){
      return [];
    }
    else {
      return imagesGroupedByTriad[imagesGroupedByTriad.length - 1];
    }
  },
  arrayIndex(array, index){
    return array[index];
  }
});

Template.imitationGame.events({
  'click #goToParticipate'(event, template){
    document.getElementById('instruction').style.display = "none";
    document.getElementById('participate').style.display = "block";
  },
  'click #goToInstruction'(event, template){
    document.getElementById('instruction').style.display = "block";
    document.getElementById('participate').style.display = "none";
  }
});


Template.imitationGame.helpers({
  getPreviousImageSub() {
    let imageSub = this.submissions.find(s => s.needName == this.needName && s.content.proof)
    return this.images.find(i => i._id === imageSub.content.proof);
  },
  getPreviousTextSub(){
    console.log(this)
    let textSub = this.submissions.find(i => i.needName == this.needName && i.content.sentence)
    return textSub.content.sentence;
  }
});

Template.cookParticipate.helpers({
  textValue: function(submission) {
    if (submission.content.sentence != undefined) {
      return submission.content.sentence;
    } else {
      return "...";
    }
  },

  hello: function() {
    return this.submissions[0];
  },

  lastImage: function() {
    return this.submisions[this.submissions.length - 1];
  },

  // returnHi: function () {
  //   return "HELLOOOOO"
  // }, 

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
})


// KEVIN AND NINA COLLECTIVE NARRATIVE
Template.survivingThrivingParticipate.helpers({
  isHappy(){
    let userSubs = this.submissions.filter(sub => sub.uid === Meteor.userId());
    let mostRecentSub = userSubs.reduce((a, b) => (a.timestamp > b.timestamp ? a : b));
    return mostRecentSub.castCategory == "😃";
  },
  isHopeful(){
    let userSubs = this.submissions.filter(sub => sub.uid === Meteor.userId());
    let mostRecentSub = userSubs.reduce((a, b) => (a.timestamp > b.timestamp ? a : b));
    return mostRecentSub.castCategory == "🙏";
  },
  isRelieved(){
    let userSubs = this.submissions.filter(sub => sub.uid === Meteor.userId());
    let mostRecentSub = userSubs.reduce((a, b) => (a.timestamp > b.timestamp ? a : b));
    return mostRecentSub.castCategory == "😌";
  },
  isAnxious(){
    let userSubs = this.submissions.filter(sub => sub.uid === Meteor.userId());
    let mostRecentSub = userSubs.reduce((a, b) => (a.timestamp > b.timestamp ? a : b));
    return mostRecentSub.castCategory == "😬";
  },
  isExhausted(){
    let userSubs = this.submissions.filter(sub => sub.uid === Meteor.userId());
    let mostRecentSub = userSubs.reduce((a, b) => (a.timestamp > b.timestamp ? a : b));
    return mostRecentSub.castCategory == "😫";
  },
  isSad(){
    let userSubs = this.submissions.filter(sub => sub.uid === Meteor.userId());
    let mostRecentSub = userSubs.reduce((a, b) => (a.timestamp > b.timestamp ? a : b));
    return mostRecentSub.castCategory == "😢";
  },
  getContextQuestions() {
    // console.log('questions ', this.toPass.contextDepQuestion);
    return this.toPass.contextDepQuestion;
  },
  getQuestion(cont) {
    return cont;
    // console.log('questions ', this.toPass.contextDepQuestion);
  }
});

Template.groupCheers.helpers({
  getUserById(users, uid) {
    let user = users.find(function(x) {
      return x._id === uid;
    });
    return user;
  },

  mostRecentImageTriadForNeed(images, needName) {
    // assure they are sorted in ascending (first uploadedAt first)
    images = images.sort(function(x, y) {
      return x.uploadedAt - y.uploadedAt;
    });
    let needImages = images.filter(function(x) {
      return x.needName === needName;
    });
    let imagesGroupedByTriad = chunkArray(needImages, 3);
    if(imagesGroupedByTriad.length == 0){
      return [];
    }
    else {
      return imagesGroupedByTriad[imagesGroupedByTriad.length - 1];
    }
  },

  lengthEqual(array, number) {
    return array.length === number;
  },
  firstElement(array) {
    return array[0];
  },
  secondElement(array){
    return array[1];
  },
  submitDisplayValue() {
    // when image submit is ready, submit button should be shown
    if (Template.instance().imageSubmitReady.get()) {
      return "block";
    } else {
      return "none";
    }
  }
});

Template.groupCheers.onCreated(() => {
  Template.instance().imageSubmitReady = new ReactiveVar(false);
  Template.instance().cameraStarted = new ReactiveVar(false);
});

Template.groupCheers.onDestroyed(() => {
  CameraPreview.stopCamera();
});

Template.groupCheers.events({
  'click #takePhoto'(event, template){
    if (typeof CameraPreview !== 'undefined') {
      toggleCameraControls('takePhotoInProgress');
      CameraPreview.takePicture({
        width: 480, height: 640, quality: 85
      },function(imgData){
          let rect = getPreviewRect();
          b64CropLikeCordova(imgData, rect.width, rect.height, function(croppedImgUrl) {
            // using an instance of jquery tied to current template scope
            let imagePreview = template.$(".fileinput-preview");
            imagePreview.attr('src', croppedImgUrl);
            imagePreview.show();
            template.imageSubmitReady.set(true);
            CameraPreview.hide();
            toggleCameraControls('takePhotoDone');
          });
      });
    } else {
      console.error("Could not access the CameraPreview");
    }
  },
  'click #retakePhoto'(event, template){
    if (typeof CameraPreview !== 'undefined') {
      CameraPreview.show()
    } else {
      console.error("Could not access the CameraPreview")
    }
    $(".fileinput-preview").hide();
    template.imageSubmitReady.set(false);
    toggleCameraControls('startCamera');
  },
  'click #switchCamera'(){
    if (typeof CameraPreview !== 'undefined') {
      CameraPreview.switchCamera();
    } else {
      console.error("Could not access the CameraPreview")
    }
  },
  'click #goToParticipate'(event, template) {
    document.getElementById('instruction').style.display = "none";
    document.getElementById('triparticipate').style.display = "block";

    if (template.cameraStarted.get()) {
      if (!template.imageSubmitReady.get()) {
        CameraPreview.show();
      }
    } else {
      Meteor.setTimeout(() => {
        if (typeof CameraPreview !== 'undefined') {
          startCameraAtPreviewRect();
          template.cameraStarted.set(true);
        } else {
          console.error("Could not access the CameraPreview")
        }
        template.$(".fileinput-preview").hide();
        template.imageSubmitReady.set(false);
        toggleCameraControls('startCamera');
      }, 300);
    }
  },
  'click #goToInstruction'() {
    document.getElementById('instruction').style.display = "block";
    document.getElementById('triparticipate').style.display = "none";
    CameraPreview.hide();
  },
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

Template.halfhalfParticipate.helpers({
  getUserById(users, uid) {
    let user = users.find(function(x) {
      return x._id === uid;
    });
    return user;
  },
  /** mostRecentImageDyadForNeed
   *
   * @param images [Image document object] assumes documents already filtered by activeIncident
   * @param needName [String] need name
   * @return [ImageDocument, ImageDocument] or [ImageDocument]
   */
  mostRecentImageDyadForNeed(images, needName) {
    // assure they are sorted in ascending (first uploadedAt first)
    images = images.sort(function(x, y) {
      return x.uploadedAt - y.uploadedAt;
    });
    let needImages = images.filter(function(x) {
      return x.needName === needName;
    });
    let imagesGroupedByDyad = chunkArray(needImages, 2);
    return imagesGroupedByDyad[imagesGroupedByDyad.length - 1];
  },
  lengthEqual(array, number) {
    return array.length === number;
  },
  firstElement(array) {
    return array[0];
  },
  submitDisplayValue() {
    // when image submit is ready, submit button should be shown
    if (Template.instance().imageSubmitReady.get()) {
      return "block";
    } else {
      return "none";
    }
  }
});

Template.halfhalfParticipate.onCreated(() => {
  Template.instance().imageSubmitReady = new ReactiveVar(false);
  Template.instance().cameraStarted = new ReactiveVar(false);
});

Template.halfhalfParticipate.onDestroyed(() => {
  CameraPreview.stopCamera();
});

Template.halfhalfParticipate.events({
  'click #takeHalfHalfPhoto'(event, template){
    if (typeof CameraPreview !== 'undefined') {
      toggleCameraControls('takePhotoInProgress');

      CameraPreview.takePicture({
        // dimensions of an iPhone 6s front-facing camera are 960 1280
        // any larger dimensions displays the captured picture with significant lag
        // reducing to 480 x 640 in an attempt to speed up webclient image processing
        // TODO(rlouie): test these parameters with many devices, whose supported photo sizes might make this not work
        width: 480, height: 640, quality: 85
      },function(imgData){
          let rect = getPreviewRect();
          b64CropLikeCordova(imgData, rect.width, rect.height, function(croppedImgUrl) {
            // using an instance of jquery tied to current template scope
            let imagePreview = template.$(".fileinput-preview");
            imagePreview.attr('src', croppedImgUrl);
            imagePreview.show();
            template.imageSubmitReady.set(true);
            CameraPreview.hide();
            toggleCameraControls('takePhotoDone');
          });
      });
    } else {
      console.error("Could not access the CameraPreview")
    }
  },
  'click #retakePhoto'(event, template){
    if (typeof CameraPreview !== 'undefined') {
      CameraPreview.show()
    } else {
      console.error("Could not access the CameraPreview")
    }
    $(".fileinput-preview").hide();
    template.imageSubmitReady.set(false);
    toggleCameraControls('startCamera');
  },
  'click #switchCamera'(){
    if (typeof CameraPreview !== 'undefined') {
      CameraPreview.switchCamera();
    } else {
      console.error("Could not access the CameraPreview")
    }
  },
  'click #goToParticipate'(event, template) {
    document.getElementById('instruction').style.display = "none";
    document.getElementById('participate').style.display = "block";

    // For speed of loading CameraPreview, we will only start the instance once, and use shows/hides to toggle
    if (template.cameraStarted.get()) {
      // an image was NOT taken previously and ready to submit, so...
      if (!template.imageSubmitReady.get()) {
        // we can show the camera preview
        CameraPreview.show();
      }
    } else {
      // Wait for the participate div to load before setting the location of the preview
      Meteor.setTimeout(() => {
        // start CameraPreview instance running
        if (typeof CameraPreview !== 'undefined') {
          startCameraAtPreviewRect();
          template.cameraStarted.set(true);
        } else {
          console.error("Could not access the CameraPreview")
        }
        // using an instance of jquery tied to current template scope
        template.$(".fileinput-preview").hide();
        template.imageSubmitReady.set(false);
        toggleCameraControls('startCamera');
      }, 300);
    }
  },
  'click #goToInstruction'() {
    document.getElementById('instruction').style.display = "block";
    document.getElementById('participate').style.display = "none";

    // For speed of loading CameraPreview, we will only start the instance once, and use shows/hides to toggle
    CameraPreview.hide();
  },
  // LEAVE click #testImage event commented out! For non-mobile testing only
  // 'click #testImage'(event, template) {
  //   // let sampleImgSrc = "data:image/png:base64..."
  //   let imagePreview = template.$(".fileinput-preview");
  //   imagePreview.attr('src', sampleImgSrc);
  //   imagePreview.show();
  //   template.imageSubmitReady.set(true);
  // }
});

/** Based on whether the preview window is on the left or right for half_half
 * or top left, top right, bottom for triad image
 * this function returns the rectangle that
 * contains information about the coordinates of the preview.
 *
 * @returns rect {DOMRect}
 */

//CLEAN THIS UP
const getPreviewRect = function() {
  let rect;
  // first one to take picture, so the left half of image will be cropped and used
  if (document.getElementById('leftHalfPreview') !== null) {
    let halfOverlay = document.getElementById('leftHalfPreview');
    rect = halfOverlay.getBoundingClientRect();
  }
  else if (document.getElementById('rightHalfPreview') !== null) {
    let halfOverlay = document.getElementById('rightHalfPreview');
    rect = halfOverlay.getBoundingClientRect();
  }
  else if (document.getElementById('topThirdPreview') !== null) {
    let triOverlay = document.getElementById('topThirdPreview');
    rect = triOverlay.getBoundingClientRect();
  }
  else if (document.getElementById('middleThirdPreview') !== null) {
    let triOverlay = document.getElementById('middleThirdPreview');
    rect = triOverlay.getBoundingClientRect();
  }
  else if (document.getElementById('bottomThirdPreview') !== null) {
    let triOverlay = document.getElementById('bottomThirdPreview');
    rect = triOverlay.getBoundingClientRect();
  }
  else if (document.getElementById('topLTriPreview') !== null) {
    let triOverlay = document.getElementById('topLTriPreview');
    rect = triOverlay.getBoundingClientRect();
  }
  else if (document.getElementById('topRTriPreview') !== null) {
    let triOverlay = document.getElementById('topRTriPreview');
    rect = triOverlay.getBoundingClientRect();
  }
  else if (document.getElementById('bottomTriPreview') !== null){
    let triOverlay = document.getElementById('bottomTriPreview');
    rect = triOverlay.getBoundingClientRect();
  } else {
    let overlay = document.getElementById('Preview');
    rect = overlay.getBoundingClientRect();
  }
  return rect;
};


const startCameraAtPreviewRect = function(
  {
    camera = "back",
    tapPhoto = true,
    previewDrag = false,
    toBack = true
  } = {}
) {
  let rect = getPreviewRect();
  CameraPreview.startCamera({
    x: rect.left, y: rect.top, width: rect.width, height: rect.height,
    camera: camera, tapPhoto: tapPhoto, previewDrag: previewDrag, toBack: toBack});
};

//changeHalfHalfPhoto to just Photo to stop break
const toggleCameraControls = function(mode) {
  if (mode === "startCamera") {
    $(".fileinput-preview").hide();
    document.getElementById('retakePhoto').style.display = "none";
    document.getElementById('takePhoto').style.display = "inline";
    document.getElementById('switchCamera').style.display = "inline";
  }
  else if (mode === "takePhotoInProgress") {
    document.getElementById('takePhotoInProgress').style.display = "inline";
    document.getElementById('takePhoto').style.display = "inline";
    document.getElementById('switchCamera').style.display = "none";
  }
  else if (mode === "takePhotoDone") {
    document.getElementById('takePhoto').style.display = "none";
    document.getElementById('takePhotoInProgress').style.display = "none";
    document.getElementById('retakePhoto').style.display = "inline";
  }
  else {
    console.log("toggleCameraControls requires passing either 'startCamera' or 'takePhotoInProgress' or \
                'takePhotoDone' as first parameter");
  }
};

/**
 * Convert a base64 string in a Blob according to the data and contentType.
 *
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
 * @param sliceSize {Number} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
const b64toBlob = function(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  let byteCharacters = atob(b64Data);
  let byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    let slice = byteCharacters.slice(offset, offset + sliceSize);

    let byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    let byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, {type: contentType});
};

/**
 * Crop a base64 string image given a cropping rectangle, in the same way that
 * the iOS cordova-plugin-camera-preview creates its preview image.
 * See captureOutput function src/ios/CameraRendererController.m of
 * https://github.com/cordova-plugin-camera-preview/cordova-plugin-camera-preview
 * for details on how the image preview is created
 *
 * @param base64PictureData {String} Pure base64 string without contentType
 * @param rect_width {Number}
 * @param rect_height {Number}
 * @param callback {Function}
 * @see http://blog.mathocr.com/2017/06/09/camera-preview-with-cordova.html
 * @return base64imageURL
 */
const b64CropLikeCordova = function(base64PictureData, rect_width, rect_height, callback) {

  // image will contain ORIGINAL image
  let image = new Image();

  // image will contain CROPPED image
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');

  // Load original image into image element
  image.src = 'data:image/jpeg;base64,' + base64PictureData;
  image.onload = function(){

    let scaleHeight = rect_height/image.height;
    let scaleWidth = rect_width/image.width;

    let scale;
    let x_img_units;
    let y_img_units;
    if (scaleHeight < scaleWidth) {
      scale = scaleWidth;
      x_img_units = 0;
      y_img_units = (image.height - (rect_height / scale)) / 2;
    } else {
      scale = scaleHeight;
      x_img_units = (image.width - (rect_width / scale)) / 2;
      y_img_units = 0;
    }

    let rect_width_img_units = rect_width / scale;
    let rect_height_img_units = rect_height / scale;

    // Set canvas size equivalent to interpolated rectangle size
    canvas.width = rect_width_img_units;
    canvas.height = rect_height_img_units;

    ctx.drawImage(image,
      x_img_units, y_img_units,                       // Start CROPPING from (x_img_units, y_img_units).
      rect_width_img_units, rect_height_img_units,    // Crop interpolated rectangle
      0, 0,                                           // Place the result at 0, 0 in the canvas,
      rect_width_img_units, rect_height_img_units);   // Crop interpolated rectangle

    // Get base64 representation of cropped image
    let cropped_img_base64 = canvas.toDataURL();

    // Now we are ready to send cropped image TO SERVER
    callback(cropped_img_base64);

    return cropped_img_base64;
  };
};

/**
 *
 * @param sources {Array} Array of image source strings
 * @param verticalStitch {Boolean} default true, it will stitch verti
 * @param callback {Function} some function(stitchedImage) with first argument as stitched image
 * @see http://blog.mathocr.com/2017/06/09/camera-preview-with-cordova.html
 * @return base64imageURL
 */
const stitchImageSources = function(sources, verticalStitch = true, callback) {
  // Recommended to load all images before drawing to canvas
  // https://www.html5canvastutorials.com/tutorials/html5-canvas-image-loader/

  // final image will contain stitchED images
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  const loadImages = (sources, loadImagesCallback) => {
    let images = {}
    let loadedImages = 0;
    let numImages = 0;
    let stitchOffsetsX = {};
    let stitchOffsetsY = {};
    // get num of sources
    for(let src in sources) {
      numImages++;
    }

    for(let i in sources) {
      images[i] = new Image();
      // Must ensure canvas is not tainted, and "allow cross-origin use of images and canvas"
      // https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
      images[i].crossOrigin = "Anonymous";

      images[i].onload = function() {
        stitchOffsetsX[i] = images[i].width;
        stitchOffsetsY[i] = images[i].height;
        if(++loadedImages >= numImages) {
          loadImagesCallback(images, stitchOffsetsX, stitchOffsetsY);
        }
      };
      images[i].src = sources[i];
    }
  }

  loadImages(sources, function(images, stitchOffsetsX, stitchOffsetsY) {
    canvas.height = (verticalStitch) ?
      Object.values(stitchOffsetsY).reduce((a,b) => a + b):
      Object.values(stitchOffsetsY).reduce((a,b) => Math.max(a,b));
    canvas.width = (verticalStitch) ?
      Object.values(stitchOffsetsX).reduce((a,b) => Math.max(a,b)) :
      Object.values(stitchOffsetsX).reduce((a,b) => a + b);
    let offset = 0;
    for(let i in images) {
      if (verticalStitch) {
        i == 0? offset = 0: offset += stitchOffsetsY[i-1];
        ctx.drawImage(images[i], 0, offset);
      }
      else { // horizontalStitch
        offset += stitchOffsetsX[i];
        ctx.drawImage(images[i], offset, 0);
      }
    }

    let stitchedImage = canvas.toDataURL();
    callback(stitchedImage);
  });
};

Template.api_custom_page.onCreated(function() {
  const eid = FlowRouter.getParam('eid');
  const iid = FlowRouter.getParam('iid');
  this.autorun(() => {
    this.subscribe('experiences.single', eid);
    this.subscribe('incidents.single', iid);
    this.subscribe('locations.activeUser');
    this.subscribe('participating.now.activeIncident', iid);
    // TODO(rlouie): create subscribers which only get certain fields like, username which would be useful for templates
    this.subscribe('users.all');
    this.subscribe('avatars.all');
    this.subscribe('submissions.activeIncident', iid);
    this.subscribe('avatars.all');
  });
});

Template.api_custom_page.helpers({
  apiCustomArgs() {
    const instance = Template.instance();
    return {
      experience: Experiences.findOne(),
      incident: Incidents.findOne(),
      location: Locations.findOne(),
      notification_log: Notification_log.find().fetch(),
      images: Images.find({}).fetch(),
      avatars: Avatars.find({}).fetch(),
      users: Meteor.users.find().fetch(),
      submissions: Submissions.find().fetch(),
    }
  }
});

Template.api_custom.onCreated(() => {
  this.state = new ReactiveDict();

  if (!Meteor.userId()) {
    FlowRouter.go('home');
    return;
  }

  const params = {
    iid: FlowRouter.getParam('iid'),
    needName: FlowRouter.getParam('needName')
  }
  this.state.set('iid', params.iid);
  this.state.set('needName', params.needName);

  const incident = Incidents.findOne({_id: params.iid});
  if (!needIsAvailableToParticipateNow(this.incident, params.needName)) {
    // TODO: redirect to an apology page
    return;
  }

  Meteor.call('pushUserIntoParticipatingNow', {
    iid: params.iid, needName: params.needName, uid: Meteor.userId()
  });
});

Template.api_custom.onDestroyed(() => {
  // Called when loading another route, and the template is gracefully destroyed
  if (Meteor.userId() && this.state) {
    Meteor.call('pullUserFromParticipatingNow', {
      iid: this.state.get('iid'),
      needName: this.state.get('needName'),
      uid: Meteor.userId()
    });
    this.state.destroy();
  }
});

window.onbeforeunload = function() {
  // Called when user closes the browser window; onDestroyed is not called in this instance
  if (Meteor.userId() && this.state) {
    Meteor.call('pullUserFromParticipatingNow', {
      iid: this.state.get('iid'),
      needName: this.state.get('needName'),
      uid: Meteor.userId()
    });
    this.state.destroy();
  }
};


//note: needName for triparticipate often split into needName_triad#
Template.api_custom.events({
  'submit #participate'(event, instance) {
    event.preventDefault();

    //this makes the loading circle show up
    console.log(event.target.getElementsByClassName('overlay'));

    event.target.getElementsByClassName('overlay')[0].style.display = 'initial';


    const experience = this.experience;
    // give null values for use when testing submitted photos on the web, without location data
    const location = this.location ? this.location : {lat: null, lng: null};
    const iid = FlowRouter.getParam('iid');
    const needName = FlowRouter.getParam('needName');
    const uid = Meteor.userId();
    const timestamp = Date.now()
    const submissions = {};
    const resultsUrl = '/apicustomresults/' + iid + '/' + experience._id;

    //submission id
    const userSubs = this.submissions.filter(sub => sub.uid === Meteor.userId());
    const mostRecentSub = userSubs.reduce((a, b) => (a.timestamp > b.timestamp ? a : b));
    const subId = userSubs.length === 0 ? null : mostRecentSub._id;


    const dropDowns = event.target.getElementsByClassName('dropdown');
    _.forEach(dropDowns, (dropDown) => {
      const index = dropDown.selectedIndex;
      submissions[dropDown.id] = dropDown[index].value
    });

    const textBoxes = event.target.getElementsByClassName('textinput');
    _.forEach(textBoxes, (textBox) => {
      submissions[textBox.id] = textBox.value;
      if (needName.split("_")[0] == "monsterStory"){
        submissions['monsterLocation'] = document.getElementById('monster').parentNode.dataset.location;
      }
    });

    const images = event.target.getElementsByClassName('fileinput');
    //no ImageUpload being uploaded so we can just go right to the results page
    if (images.length === 0) {
      FlowRouter.go(resultsUrl);
    }

    // CINDY: why would there be more than one image upload?
    //otherwise, we do have ImageUpload to upload so need to hang around for that
    _.forEach(images, (image, index) => {
      let picture;
      if (event.target.photo) { // form has input[name=photo]
        // imageFile
        picture = event.target.photo.files[index]
        let reader = new FileReader();
        reader.readAsDataURL(picture);
        reader.onload = () => {
          // console.log("sending file: ", selectedImage)
          // fetch('/uploadImage', {
          //   method: 'POST',
          //   headers: { "Content-type" : "application/json"},
          //   body: JSON.stringify({
          //       image: reader.result
          //   })
          const submissionObject = {
            uid: uid,
            eid: experience._id,
            iid: iid,
            needName: needName,
            content: submissions,
            timestamp: timestamp,
            lat: location.lat,
            lng: location.lng
          };

          Meteor.call("uploadImage", reader.result, submissionObject, (err) => {
            if (err) {
              console.log("error in uploadImage: ", err)
            } else {
              console.log("image has been uploaded");
              FlowRouter.go(resultsUrl);
              // FlowRouter.go("/chat");
            }
          })}
      } else {
        let ImageURL = $('.fileinput-preview').attr('src');
        // console.log("type of ImageURL: ", typeof ImageURL)
        // console.log(ImageURL)
        // Split the base64 string in data and contentType
        let block = ImageURL.split(";");
        // console.log("========BLOCK========")
        // console.log(block)
        // console.log("===============")
        // Get the content type
        let contentType = block[0].split(":")[1];
        // get the real base64 content of the file
        let realData = block[1].split(",")[1];
        picture = realData;
        // console.log("type of picture: ", typeof picture)

        const submissionObject = {
          uid: uid,
          eid: experience._id,
          iid: iid,
          needName: needName,
          content: submissions,
          timestamp: timestamp,
          lat: location.lat,
          lng: location.lng
        };
        Meteor.call("uploadImage", picture, submissionObject, (err) => {
          if (err) {
            console.log("error in uploadImage: ", err)
          } else {
            console.log("image has been uploaded");
            FlowRouter.go(resultsUrl);
          }
        });
      }
    });

  },

  'submit #triparticipate'(event, instance) {
    event.preventDefault();

    //this makes the loading circle show up
    console.log(event.target.getElementsByClassName('overlay'));

    event.target.getElementsByClassName('overlay')[0].style.display = 'initial';


    const experience = this.experience;
    // give null values for use when testing submitted photos on the web, without location data
    const location = this.location ? this.location : {lat: null, lng: null};
    const iid = FlowRouter.getParam('iid');
    const needName = FlowRouter.getParam('needName');
    const uid = Meteor.userId();
    const timestamp = Date.now()
    const submissions = {};
    const resultsUrl = '/apicustomresults/' + iid + '/' + experience._id;


    const dropDowns = event.target.getElementsByClassName('dropdown');
    _.forEach(dropDowns, (dropDown) => {
      const index = dropDown.selectedIndex;
      submissions[dropDown.id] = dropDown[index].value
    });

    const textBoxes = event.target.getElementsByClassName('textinput');
    _.forEach(textBoxes, (textBox) => {
      submissions[textBox.id] = textBox.value;
    });

    const images = event.target.getElementsByClassName('fileinput');
    //no ImageUpload being uploaded so we can just go right to the results page
    if (images.length === 0) {
      FlowRouter.go(resultsUrl);
    }

    /*
    if (needName.split("_")[0] == "monsterCreate"){
      //if it is the final submission... curr number of submitted images is 2
      if (this.images.filter(image => image.needName == needName).length === 1){
        let monster0 = document.getElementsByClassName('content')[0].children[1];
        let monster1 = document.getElementsByClassName('content')[1].children[1];
        stitchImageSources([monster0.src, monster1.src], true, function(ImageURL){
          let block = ImageURL.split(";");
          let contentType = block[0].split(":")[1];
          let realData = block[1].split(",")[1];
          let picture = b64toBlob(realData, contentType);

          let imageFile = Images.insert(picture, (err, imageFile) => {
            if (err) {
              alert(err);
            } else {
              Images.update({ _id: imageFile._id }, {
                $set: {
                  iid: iid,
                  uid: uid,
                  lat: location.lat,
                  lng: location.lng,
                  needName: needName,
                  stitched:'true'
                }
              }, (err) => {
                if (err) {
                  console.log('upload error,', err);
                }
              });
            }
          });

          submissions['fullMonster'] = imageFile._id
        });
      }
    }
    */

    //otherwise, we do have ImageUpload to upload so need to hang around for that
    _.forEach(images, (image, index) => {
      let picture;
      if (event.target.photo) { // form has input[name=photo]
        // imageFile
        picture = event.target.photo.files[index]
      } else {
        let ImageURL = $('.fileinput-preview').attr('src');
        // Split the base64 string in data and contentType
        let block = ImageURL.split(";");
        // Get the content type
        let contentType = block[0].split(":")[1];
        // get the real base64 content of the file
        let realData = block[1].split(",")[1];

        picture = b64toBlob(realData, contentType);
      }


      // save image and get id of new document
      const imageFile = Images.insert(picture, (err, imageFile) => {
        //this is a callback for after the image is inserted
        if (err) {
          alert(err);
        } else {
          //success branch of callback
          //add more info about the photo
          Images.update({ _id: imageFile._id }, {
            $set: {
              iid: iid,
              uid: uid,
              lat: location.lat,
              lng: location.lng,
              needName: needName,
            }
          }, (err, docs) => {
            if (err) {
              console.log('upload error,', err);
            } else {
            }
          });
          // TODO: setTimeout for automatically moving on if upload takes too long


          //watch to see when the image db has been updated, then go to results
          const cursor = Images.find(imageFile._id).observe({
            changed(newImage) {
              if (newImage.isUploaded()) {
                cursor.stop();
                FlowRouter.go(resultsUrl);
              }
            }
          });
        }
      });

      // add the submitted image to the submissions content dictionary
      submissions[image.id] = imageFile._id;

    });

    const submissionObject = {
      uid: uid,
      eid: experience._id,
      iid: iid,
      needName: needName,
      content: submissions,
      timestamp: timestamp,
      lat: location.lat,
      lng: location.lng
    };

    Meteor.call('createInitialSubmission', submissionObject);

  },
  'click #participate-btn'(event, instance) {
    event.preventDefault();
    //makes it disappear so you don't see it while image is submitting
    document.getElementById('participate-btn').style.display = 'none';
  },
  'click .fileinput, touchstart .fileinput-new'(event, target) {
    photoInput(event);
  },
  'click .glyphicon-remove'(event, target) {
    // NOTE: 5/22/16: simpler methods don't seem to work here
    // e.g. $fileInput.val('');
    event.stopImmediatePropagation();
    event.stopPropagation();
    const $fileInput = $('input[name=photo]');
    $fileInput.replaceWith($fileInput.val('').clone(true));

    $('.fileinput-preview').attr('src', '#');
    $('.fileinput-exists').hide();
    $('.fileinput-new').show();
  },
  'change input[name=photo]'(event, target) {
    photoUpload(event);
  },
});
