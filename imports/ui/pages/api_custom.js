import './api_custom.html';
import '../components/contributions.html';
import '../components/loading_overlay.html';
import '../components/loading_overlay.js';
import '../components/loading_overlay.scss';

import { ReactiveDict } from 'meteor/reactive-dict';

import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import { Experiences, Incidents } from '../../api/OCEManager/OCEs/experiences.js';
import { Users } from '../../api/UserMonitor/users/users.js';
import { Locations } from '../../api/UserMonitor/locations/locations.js';
import { Submissions } from '../../api/OCEManager/currentNeeds.js';
import { Images } from '../../api/ImageUpload/images.js';

import { photoInput } from './photoUploadHelpers.js'
import { photoUpload } from './photoUploadHelpers.js'
import {Meteor} from "meteor/meteor";


// HELPER FUNCTIONS FOR LOADING CUSTOM EXPERIENCES
Template.api_custom.helpers({

  data() {

    let currentNeed = this.incident.contributionTypes.find(function (x) {
      return x.needName === Router.current().params.needName;
    });

    return {
      location: this.location,
      experience: this.experience,
      iid: Router.current().params.iid,
      needName: Router.current().params.needName,
      toPass: currentNeed.toPass,
      notification_log: this.notification_log,
      users: this.users,
    }
  },
});
Template.storyPage.helpers({

  dropdownData() {
    console.log(this.toPass.dropdownChoices);
   return this.toPass.dropdownChoices;

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

Template.halfhalfPhoto.helpers({
  notEmpty(images) {
    return images.length > 0;
  },
  zeroIndex(index) {
    return index === 0;
  },
  getName(x){
    return x.friendName;
  },
  getImage(x){
    return x.image;
  },
  getMyImage(x){
    return x.myImage;
  },
  bumpees() {
    // copied from bumpedResults template helper in api_custom_results.js
    // TODO: if a total copy, maybe reuse this helper function in both places instead of copying code
    // TODO: WILL THIS BREAK IF NO SUBMISSIONS EXIST?
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

    console.log("contents", contents);

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

    console.log("contents2", contents);
    return contents;
  }
});
/**
 * Convert a base64 string in a Blob according to the data and contentType.
 *
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
function b64toBlob(b64Data, contentType, sliceSize) {
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
}



  // data2pass() {
  //   //TODO: clean up this hot mess of a function
  //   const instance = Template.instance();
  //   const incident = instance.state.get('incident');
  //   const subs = Submissions.find({ incidentId: incident._id }).fetch();
  //   const hasSubs = subs.length > 0;
  //
  //   // TODO: fix, dont want to get by experience
  //   const exp = instance.state.get('experience');
  //   incident.situationNeeds.forEach((sitNeed) => {
  //     if (sitNeed.notifiedUsers.includes(Meteor.userId())) {
  //       situationNeedName = sitNeed.name;
  //       contributionTemplateName = sitNeed.contributionTemplate;
  //       affordance = sitNeed.affordance
  //     }
  //   });
  //   let contributionTemplate;
  //   exp.contributionGroups.forEach((group) => {
  //     group.contributionTemplates.forEach((template) => {
  //       if (template.name === contributionTemplateName) {
  //         contributionTemplate = template
  //       }
  //     });
  //   });
  //
  //   instance.state.set('situationNeedName', situationNeedName);
  //   instance.state.set('contributionTemplate', contributionTemplate);
  //
  //   return {
  //     'incident': incident,
  //     'situationNeedName': situationNeedName,
  //     'contributionTemplate': contributionTemplate,
  //     'submissions': subs
  //   }
  // },
  // template_name() {
  //   const instance = Template.instance();
  //   return instance.state.get('experience').participateTemplate;
  // }

Template.api_custom.onCreated(() => {

});

Template.api_custom.events({
  'submit form'(event, instance) {
    event.preventDefault();

    //this makes the loading circle show up
    event.target.getElementsByClassName('overlay')[0].style.display = 'initial';


    const experience = this.experience;
    const location = this.location;
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
  'click .fileinput, touchstart .glyphicon-camera'(event, target) {
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
  'click #testPhoto'() {
    let sampleImgSrc = "data:image/gif;base64,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";
    $('.fileinput-preview').attr('src', sampleImgSrc);
  },
  'click #openHalfHalfCamera'(event, target) {
    CameraPreview.startCamera({x: 5, y: 100, width: 300, height:300, camera: "front", tapPhoto: true, previewDrag: false, toBack: true});
  },
  'click #takeHalfHalfPhoto'(event,target) {
    CameraPreview.takePicture(function(imgData){
      $('.fileinput-preview').attr('src', 'data:image/jpeg;base64,' + imgData);
    });
  },
  'click #hideCamera'(event, target) {
    // hide Camera and overlay
    CameraPreview.hide();
    document.getElementsByClassName('camera-overlay').hide();

    // show photos
    $('.fileinput-preview').attr('src').show();
  },
  'click #showCamera'(event, target) {
    // show Camera and overlay
    CameraPreview.show();
    document.getElementsByClassName('camera-overlay').show();

    // hide photos
    $('.fileinput-preview').attr('src').hide();
  }
});
