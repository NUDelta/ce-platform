import './api_custom.html';
import '../components/contributions.html';
import '../components/loading_overlay.html';
import '../components/loading_overlay.js';
import '../components/loading_overlay.scss';

import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';

import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import { Users } from '../../api/UserMonitor/users/users.js';
import { Images } from '../../api/ImageUpload/images.js';
import { Incidents } from "../../api/OCEManager/OCEs/experiences";

import { photoInput } from './photoUploadHelpers.js'
import { photoUpload } from './photoUploadHelpers.js'
import {Meteor} from "meteor/meteor";
import {needIsAvailableToParticipateNow} from "../../api/OpportunisticCoordinator/strategizer";


// HELPER FUNCTIONS FOR LOADING CUSTOM EXPERIENCES
Template.api_custom.helpers({

  data() {

    let currentNeed = this.incident.contributionTypes.find(function (x) {
      return x.needName === Router.current().params.needName;
    });

    this.iid = Router.current().params.iid;
    this.needName = Router.current().params.needName;
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

Template.monsterCreate.helpers({
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
'click #monsterCreateSubmit'(event, instance){
    event.preventDefault();

    event.target.getElementsByClassName('overlay')[0].style.display = 'initial';

    const experience = this.experience;
    const location = this.location ? this.location : {lat: null, lng: null};
    const iid = Router.current().params.iid;
    const needName = Router.current().params.needName;
    const uid = Meteor.userId();
    const timestamp = Date.now()
    const submissions = {};
    const resultsUrl = '/apicustomresults/' + iid + '/' + experience._id;

    const images = event.target.getElementsByClassName('fileinput');

    _.forEach(images, (image, index) => {
      let picture;
      if (event.target.photo) {
        picture = event.target.photo.files[index]
      } else {
        let ImageURL = $('.fileinput-preview').attr('src');
        let block = ImageURL.split(";");
        let contentType = block[0].split(":")[1];
        let realData = block[1].split(",")[1];
        picture = b64toBlob(realData, contentType);
      }

      const imageFile = Images.insert(picture, (err, imageFile) => {
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
            }
          }, (err, docs) => {
            if (err) {
              console.log('upload error,', err);
            } else {
            }
          });

          const cursor = Images.find(imageFile._id).observe({
            changed(newImage) {
              if (newImage.isUploaded()) {
                cursor.stop();
                Router.go(resultsUrl);
              }
            }
          });
        }
      });

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
    /*
    let imgs = this.images.sort(function(x, y) {
      return x.uploadedAt - y.uploadedAt;
    });
    let needImages = imgs.filter(function(x) {
      return x.needName === needName;
    });
    let imagesGroupedByTriad = chunkArray(needImages, 3)
    needImages = imagesGroupedByTriad[imagesGroupedByTriad.length - 1];

    if (needImages.length === 3){
      let fullMonster = document.createElement('canvas');
      let overlay = document.getElementById('camera-overlay');
      fullMonster.width = overlay.scrollWidth;
      fullMonster.height = overlay.scrollHeight;
      let ctx = fullMonster.getContext('2d');
      ctx.drawImage(needImages[0], 0, 0);
      ctx.drawImage(needImages[1], 0, needImages[0].height);
      ctx.drawImage(needImages[2], 0, needImages[0].height + needImages[1].height);
      submissionObject.content["fullMonster"] = fullMonster;
      Meteor.call('updateSubmission', submissionObject);
    }
  */
  }
});

Template.monsterStory.onCreated(() => {
  Template.instance().monsterMoving = new ReactiveVar(false);
});

Template.monsterStory.helpers({
  monsterImageURLs(urls){
    console.log(urls);

    const res = [];
    /*
    urls.forEach(function(id) {
      let img = Images.findOne({_id: id});
      res.push(img.url('images'));
    })
    */
    console.log(res);

    return res;
  },
  latestNeedImage(images, needName){
    images = images.sort(function(x, y) {
      return x.uploadedAt - y.uploadedAt;
    });
    let needImages = images.filter(function(x) {
      return x.needName == needName;
    });

    return needImages[needImages.length - 1];
  },
  latestMonsterImage(images, needName){
    console.log(images);
    images = images.sort(function(x, y) {
      return x.uploadedAt - y.uploadedAt;
    });
    let needImages = images.filter(function(x) {
      return x.needName == needName;
    });

    return needImages[needImages.length - 1];
  },
  latestBGImage(images, needName){
    images = images.sort(function(x, y) {
      return x.uploadedAt - y.uploadedAt;
    });
    let needImages = images.filter(function(x) {
      return x.needName == needName;
    });

    return needImages[needImages.length - 1];
  },
  elementIndex(array, index){
    return array[index];
  }
});

Template.monsterStory.events({
  'mousedown/touchstart img'(event, template){
    event.preventDefault();

    if (event.target.parentElement.id == "monster") {
      if (!template.monsterMoving.get()){
        template.monsterMoving.set(true);
      }
    }
  },
  'mousemove/touchmove #monster_story_upload'(event, template){
    if (template.monsterMoving.get()){
      event.preventDefault();
      let monster = document.getElementById('monster').children.item(0);
      let bg_img = document.getElementById('monster_bg_img').children.item(0);
      let x = event.clientX;
      let y = event.clientY;
      let top = bg_img.offsetTop;
      let left = bg_img.offsetLeft;

      //moving things
      if ((y > top + monster.clientHeight/2) && (y < top + bg_img.clientHeight - monster.clientHeight/2)
      && (x > left + monster.clientWidth/2) && (x < left + bg_img.clientWidth - monster.clientWidth/2)) {
        monster.style.left = (x - monster.clientWidth/2 ) + 'px';
        monster.style.top = (y - monster.clientHeight/2 ) + 'px';
      }
    }
  },
  'mouseup/touchend #monster_story_upload'(event, template){
    if (template.monsterMoving.get()){
      event.preventDefault();
      template.monsterMoving.set(false);
    }

  },
  'submit #preparticipate'(event, instance){
    event.preventDefault();

    const experience = this.experience;
    const location = this.location ? this.location : {lat: null, lng: null};
    const iid = Router.current().params.iid;
    const needName = Router.current().params.needName;
    const uid = Meteor.userId();
    const timestamp = Date.now()
    const submissions = {};

    const images = event.target.getElementsByClassName('fileinput');

    //otherwise, we do have ImageUpload to upload so need to hang around for that
    _.forEach(images, (image, index) => {
      let picture;
      if (event.target.photo) { // form has input[name=photo]
        picture = event.target.photo.files[index]
      } else {
        let ImageURL = $('.fileinput-preview').attr('src');
        let block = ImageURL.split(";");
        let contentType = block[0].split(":")[1];
        let realData = block[1].split(",")[1];
        picture = b64toBlob(realData, contentType);
      }


      const imageFile = Images.insert(picture, (err, imageFile) => {
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
            }
          }, (err, docs) => {
            if (err) {
              console.log('upload error,', err);
            } else {
            }
          });

          const cursor = Images.find(imageFile._id).observe({
            changed(newImage) {
              if (newImage.isUploaded()) {
                cursor.stop();
                document.getElementById('bg_img_upload').style.display = "none";
                document.getElementById('monster_story_upload').style.display = "block";
              }
            }
          });
        }
      });

      submissions[image.id] = imageFile._id;
    });
  },
  'click #back_to_bg_img_upload'(){
    document.getElementById('bg_img_upload').style.display = "block";
    document.getElementById('monster_story_upload').style.display = "none";
  },
  'submit #monsterParticipate'(event, instance){
    event.preventDefault();

    const experience = this.experience;
    const location = this.location ? this.location : {lat: null, lng: null};
    const iid = Router.current().params.iid;
    const needName = Router.current().params.needName;
    const uid = Meteor.userId();
    const timestamp = Date.now()
    const submissions = {};
    const resultsUrl = '/apicustomresults/' + iid + '/' + experience._id;

    const textBoxes = event.target.getElementsByClassName('textinput');
    _.forEach(textBoxes, (textBox) => {
      submissions[textBox.id] = textBox.value;
    });

    bg_img = document.getElementById('bg_img').children.item(0);
    monster = document.getElementById('monster').children.item(0);
    canvas = document.createElement('canvas');
    canvas.width = bg_img.width;
    canvas.height = bg_img.height;
    canvas.style.left = parseInt(bg_img.offsetLeft)+'px';
    canvas.style.top = parseInt(bg_img.offsetTop)+'px';
    let ctx = canvas.getContext('2d');

    ctx.drawImage(bg_img, 0, 0)
    ctx.drawImage(monster,
      monster.offsetLeft - bg_img.offsetLeft,
      monster.offsetTop - bg_img.offsetTop );

    let block = canvas.toDataURL();
    block = block.split(";");
    let contentType = block[0].split(":")[1];
    let realData = block[1].split(",")[1];
    let picture = b64toBlob(realData, contentType);

    const imageFile = Images.insert(picture, (err, imageFile) => {
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
          }
        }, (err, docs) => {
          if (err) {
            console.log('upload error,', err);
          } else {
          }
        });
        const cursor = Images.find(imageFile._id).observe({
          changed(newImage) {
            if (newImage.isUploaded()) {
              cursor.stop();
              Router.go(resultsUrl);
            }
          }
        });
      }
    });

    submissions[picture.id] = imageFile._id;

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
  }
})

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

Template.imitationGame.helpers({
  getPreviousImageSub() {
    return this.images.find(i => i.uid === this.toPass.previousSub.uid);
  },
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

//is there a way to generalize template helpers/on create funtions?
Template.groupCheers.onCreated(() => {
  Template.instance().imageSubmitReady = new ReactiveVar(false);
  Template.instance().cameraStarted = new ReactiveVar(false);
});

Template.groupCheers.onDestroyed(() => {
  CameraPreview.stopCamera();
});

//see halfhalf_participate.events
//how to generalize this so I don't have to reuse code?
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
  else {
    let triOverlay = document.getElementById('bottomTriPreview');
    rect = triOverlay.getBoundingClientRect();
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
    //do check
    //document.getElementById('takeHalfHalfPhoto').style.display = "inline";
    //do check
    document.getElementById('takePhoto').style.display = "inline";
    document.getElementById('switchCamera').style.display = "inline";
  }
  else if (mode === "takePhotoInProgress") {
    document.getElementById('takePhotoInProgress').style.display = "inline";
    //do check
    //document.getElementById('takeHalfHalfPhoto').style.display = "none";
    //do check
    document.getElementById('takePhoto').style.display = "inline";
    document.getElementById('switchCamera').style.display = "none";
  }
  else if (mode === "takePhotoDone") {
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
    let stitchOffsetsX = [0];
    let stitchOffsetsY = [0];
    // get num of sources
    for(let src in sources) {
      numImages++;
    }

    for(let src in sources) {
      images[src] = new Image();
      // Must ensure canvas is not tainted, and "allow cross-origin use of images and canvas"
      // https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
      images[src].crossOrigin = "Anonymous";

      images[src].onload = function() {
        stitchOffsetsX.push(images[src].width);
        stitchOffsetsY.push(images[src].height);
        if(++loadedImages >= numImages) {
          loadImagesCallback(images, stitchOffsetsX, stitchOffsetsY);
        }
      };
      images[src].src = sources[src];
    }
  }

  loadImages(sources, function(images, stitchOffsetsX, stitchOffsetsY) {
    canvas.height = (verticalStitch) ?
      stitchOffsetsY.reduce((a,b) => a + b) :
      stitchOffsetsY.reduce((a,b) => Math.max(a,b));
    canvas.width = (verticalStitch) ?
      stitchOffsetsX.reduce((a,b) => Math.max(a,b)) :
      stitchOffsetsX.reduce((a,b) => a + b);
    let offset = 0;
    for(let i in images) {
      if (verticalStitch) {
        offset += stitchOffsetsY[i];
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

Template.api_custom.onCreated(() => {
  this.state = new ReactiveDict();

  if (!Meteor.userId()) {
    Router.go('home');
    return;
  }

  const params = Router.current().params;
  this.state.set('iid', params.iid);
  this.state.set('needName', params.needName);

  const incident = Incidents.findOne({_id: params.iid});
  if (!needIsAvailableToParticipateNow(incident, params.needName)) {
    // TODO: redirect to an apology page
    //Router.go('home');
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

Template.api_custom.events({
  'submit #participate'(event, instance) {
    event.preventDefault();

    //this makes the loading circle show up
    console.log(event.target.getElementsByClassName('overlay'));

    event.target.getElementsByClassName('overlay')[0].style.display = 'initial';


    const experience = this.experience;
    // give null values for use when testing submitted photos on the web, without location data
    const location = this.location ? this.location : {lat: null, lng: null};
    const iid = Router.current().params.iid;
    const needName = Router.current().params.needName;
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
      Router.go(resultsUrl);
    }

    if (needName == "drinksTalk"){
      //if it is the final submission... curr number of submitted images is 2
      if (this.images.filter(image => image.iid == iid).length === 2){
        let monster0 = document.getElementById('hello').children[0];
        let monster1 = document.getElementById('hello').children[1];
        let monster2 = document.getElementsByClassName('fileinput')[0].children[0];
        console.log([monster0.src, monster1.src, monster2.src]);
        stitchImageSources([monster0.src, monster1.src, monster2.src], true, function(ImageURL){
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

          submissions['stitchedImage'] = imageFile._id
        });
      }
    }

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
                Router.go(resultsUrl);
              }
            }
          });
        }
      });

      // add the submitted image to the submissions content dictionary
      submissions[image.id] = imageFile._id;
      //submissions['imageid'] = imageFile._id;
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
  'submit #triparticipate'(event, instance) {
    event.preventDefault();

    //this makes the loading circle show up
    console.log(event.target.getElementsByClassName('overlay'));

    event.target.getElementsByClassName('overlay')[0].style.display = 'initial';


    const experience = this.experience;
    // give null values for use when testing submitted photos on the web, without location data
    const location = this.location ? this.location : {lat: null, lng: null};
    const iid = Router.current().params.iid;
    const needName = Router.current().params.needName;
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
      Router.go(resultsUrl);
    }

    //sad that there's this condition for this specific experience but :-///
    //i dont want to mess around w creating different forms for different submits
    if (needName == "monsterCreate"){
      //if it is the final submission... curr number of submitted images is 2
      if (this.images.filter(image => image.iid == iid).length === 2){
        let monster0 = document.getElementsByClassName('content')[0].children[1];
        let monster1 = document.getElementsByClassName('content')[1].children[1];
        let monster2 = document.getElementsByClassName('fileinput')[0].children[0];
        stitchImageSources([monster0.src, monster1.src, monster2.src], true, function(ImageURL){
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
                Router.go(resultsUrl);
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
