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

Template.bumpedThree.helpers({
  friendNames() {
    const friends = this.users.filter(friend => {
      return this.notification_log.filter(notif => friend._id == notif.uid && friend._id !== Meteor.userId()).length > 0;
    });

    return {
      friendOne: friends[0].username,
      friendTwo: friends[1].username
    }
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

/** Based on whether the preview window is on the left or right, this function returns the rectangle that
 * contains information about the coordinates of the preview.
 *
 * @returns rect {DOMRect}
 */
const getPreviewRect = function() {
  let rect;
  // first one to take picture, so the left half of image will be cropped and used
  if (document.getElementById('leftHalfPreview') !== null) {
    let halfOverlay = document.getElementById('leftHalfPreview');
    rect = halfOverlay.getBoundingClientRect();
  }
  else {
    let halfOverlay = document.getElementById('rightHalfPreview');
    rect = halfOverlay.getBoundingClientRect();
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

const toggleCameraControls = function(mode) {
  if (mode === "startCamera") {
    $(".fileinput-preview").hide();
    document.getElementById('retakePhoto').style.display = "none";
    document.getElementById('takeHalfHalfPhoto').style.display = "inline";
    document.getElementById('switchCamera').style.display = "inline";
  }
  else if (mode === "takePhotoInProgress") {
    document.getElementById('takePhotoInProgress').style.display = "inline";
    document.getElementById('takeHalfHalfPhoto').style.display = "none";
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
    Router.go('home');
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
  'submit form'(event, instance) {
    event.preventDefault();

    //this makes the loading circle show up
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

    Meteor.call('updateSubmission', submissionObject);

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
