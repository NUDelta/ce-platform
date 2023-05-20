import './api_custom_prestory.html';
import '../components/contributions.html';
import '../components/loading_overlay.html';
import '../components/loading_overlay.js';
import '../components/loading_overlay.scss';

import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { Users } from '../../api/UserMonitor/users/users.js';
import { Images } from '../../api/ImageUpload/images.js';
import { Incidents } from "../../api/OCEManager/OCEs/experiences";

import { photoInput } from './photoUploadHelpers.js'
import { photoUpload } from './photoUploadHelpers.js'
import {Meteor} from "meteor/meteor";
import {needIsAvailableToParticipateNow} from "../../api/OpportunisticCoordinator/strategizer";
import { EventBusy } from '@mui/icons-material';
import { Submissions } from '/imports/api/OCEManager/currentNeeds';


// HELPER FUNCTIONS FOR LOADING CUSTOM PRESTORY QUESTIONS


// Template.cookNight.helpers({
//   notDefault: function() {
//     console.log(document.getElementById("selected"));
//   }
// })

Template.api_custom_prestory_page.onCreated(function() {

  const eid = FlowRouter.getParam('eid');
  const iid = FlowRouter.getParam('iid');
  this.autorun(() => {
    this.subscribe('experiences.single', eid);
    this.subscribe('incidents.single', iid);
    this.subscribe('images.activeIncident', iid);
    this.subscribe('submissions.activeIncident', iid);
    this.subscribe('users.all');
    this.subscribe('avatars.all');
    this.subscribe('locations.activeUser');

  })
});

Template.api_custom_prestory_page.helpers({
  apiCustomPrestoryArgs() {
    const instance = Template.instance();
    return {
      experience: Experiences.findOne(),
      incident: Incidents.findOne(),
      location: Locations.findOne(),
      submissions: Submissions.find().fetch()
    }
  }
});

Template.api_custom_prestory.helpers({

  data() {
    let navbar = document.querySelector(".nav-footer");
    navbar.style.display = "block";
    let currentNeed = this.incident.contributionTypes.find(function (x) {
      return x.needName === FlowRouter.getParam('needName');
    });

    this.iid = FlowRouter.getParam('iid');
    this.needName = FlowRouter.getParam('needName');
    this.toPass = currentNeed.toPass;

    return this;
  },
  imageValue: function(submission){
  
    console.log("Final submission: ", submission);
    if (submission.content.proof != undefined) {
      // let element = document.createElement('div');
      // element.innerHTML = 'chocolate';
      // console.log(element);
      // document.getElementByClassName("sunsetSlides").appendChild(element);
      // return 0;
      return submission.content.proof;
    } else {
      return "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E";
    }
  },
  previousSubmission: function(){
    debugger;
    console.log("aha", submission)
  },


});

Template.debias_1.helpers({
  previousSubmission: function(){
    console.log(this.needName)
    // debugger;
    // console.log("aha", this.submissions)
    // debugger;
    res = this.submissions.filter(sub => sub.needName == this.needName && sub.content.proof != undefined)
    // console.log("res: ", res.length)
    const end = res.length
    console.log("end is: ",end)
    console.log("Previous submission is: ", res[end-1].content)
    if (end != 0){
      return res[end-1].content.proof
    }
    else{
      return "https://res.cloudinary.com/dwruudqoc/image/upload/v1684111699/placeholder_uuupdh.png"
    }
  },
  previousAnnotation1: function(){
    const end = res.length
    return res[end-1].content.sentence1

  },
  previousAnnotation2: function(){
    const end = res.length
    return res[end-1].content.sentence2

  }



})



Template.debias_1.events({
  'submit #cn-participate'(event, instance){
    event.preventDefault();
    const experience = this.experience;
    const location = this.location ? this.location : {lat: null, lng: null};
    const iid = FlowRouter.getParam('iid');
    const needName = FlowRouter.getParam('needName');
    const uid = Meteor.userId();
    const timestamp = Date.now()
    const submissions = {};
    // const resultsUrl = '/apicustomresults/' + iid + '/' + experience._id;
    const participateUrl = '/apicustom/' + iid + '/' + experience._id + '/' + needName;
    console.log(this.submissions)

    FlowRouter.go(participateUrl);
    FlowRouter.go(participateUrl);

    const submissionObject = {
      uid: uid,
      eid: experience._id,
      iid: iid,
      needName: needName,
      content: submissions,
      timestamp: timestamp,
      lat: location.lat,
      lng: location.lng,
      
      // castDescription: castDescription
    };

    Meteor.call('createInitialSubmission', submissionObject);


  }
})



//note: needName for triparticipate often split into needName_triad#
Template.api_custom_prestory.events({
  'submit #cn-participate'(event, instance) {
    event.preventDefault();

    //this makes the loading circle show up
    //console.log(event.target.getElementsByClassName('overlay'));

    //event.target.getElementsByClassName('overlay')[0].style.display = 'initial';


    const experience = this.experience;
    // give null values for use fwhen testing submitted photos on the web, without location data
    const location = this.location ? this.location : {lat: null, lng: null};
    const iid = FlowRouter.getParam('iid');
    const needName = FlowRouter.getParam('needName');
    const uid = Meteor.userId();
    const timestamp = Date.now()
    const submissions = {};
    // const resultsUrl = '/apicustomresults/' + iid + '/' + experience._id;
    const participateUrl = '/apicustom/' + iid + '/' + experience._id + '/' + needName;

    //castCategory
    const castDropDown = document.getElementById('dropDown');
    console.log("CAST DROP DOWN: ", castDropDown)
    const index = castDropDown.selectedIndex;
    const castCategory = castDropDown[index].value;
    // const castDescription = document.getElementById('castDescription').value
    
    // console.log("GOT EMOTION: ", castDescription)

    FlowRouter.go(participateUrl);

    const submissionObject = {
      uid: uid,
      eid: experience._id,
      iid: iid,
      needName: needName,
      content: submissions,
      timestamp: timestamp,
      lat: location.lat,
      lng: location.lng,
      castCategory: castCategory,
      
      // castDescription: castDescription
    };

    Meteor.call('createInitialSubmission', submissionObject);
  },

  'click #back-btn': function(event, instance) {
    // console.log('back');
    // event.preventDefault();
    FlowRouter.go('home');
  }
});