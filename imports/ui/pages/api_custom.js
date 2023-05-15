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
import { KinesisVideoSignalingChannels } from 'aws-sdk';


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

    // package, raw-veggies, cutfood, boiling, readyMeal

    // console.log("EVENT TARGET: ", event.target);

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
    console.log(this,submissions.uid)
    console.log(Meteor.userId())
    const userSubs = this.submissions.filter(sub => sub.uid === Meteor.userId());
    const mostRecentSub = userSubs.reduce((a, b) => (a.timestamp > b.timestamp ? a : b));
    const subId = userSubs.length === 0 ? null : mostRecentSub._id;

    // dropdown info
    const dropDowns = event.target.getElementsByClassName('dropdown');
    _.forEach(dropDowns, (dropDown) => {
      const index = dropDown.selectedIndex;
      submissions[dropDown.id] = dropDown[index].value
    });

    // text info
    const textBoxes = event.target.getElementsByClassName('textinput');
    _.forEach(textBoxes, (textBox) => {
      submissions[textBox.id] = textBox.value;
      
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
        // console.log(event.target.photo)
        
        picture = event.target.photo.files[index]
        console.log
        let reader = new FileReader();
        reader.readAsDataURL(picture);

        // console.log(reader.readAsDataURL(picture))

        reader.onload = () => {
          const submissionObject = {
            uid: uid,
            eid: experience._id,
            iid: iid,
            needName: needName,
            content: submissions,
            timestamp: timestamp,
            lat: location.lat,
            lng: location.lng,
          };
          // this is the picture and it's correct
          console.log(reader.result)
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
          lng: location.lng,
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
