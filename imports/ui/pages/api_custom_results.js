import './api_custom_results.html';

import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';

import {FlowRouter} from 'meteor/ostrio:flow-router-extra';
import { Template } from "meteor/templating";
import { Meteor } from 'meteor/meteor'
import '../components/displayImage.html';
import { findPartner, scrollToBottomAbs } from "../pages/chat"
//import {notify} from "../../api/OpportunisticCoordinator/server/noticationMethods";
import { Incidents } from "../../api/OCEManager/OCEs/experiences";
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
    this.subscribe('incidents.single', iid);
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
      incident: Incidents.findOne(),
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

    // get topass at result page
    // let currentNeed = this.incident.contributionTypes.find(function (x) {
    //   return x.needName === FlowRouter.getParam('needName');
    // });

    // I kinda hardcode here because we assume all contributions have the same number of perspectives. 
    this.perspectives = this.incident.contributionTypes[0].toPass.dropdownChoices.options


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
    // console.log("Final submission: ", submission);
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
  context_topic:function(){
    return this.incident.contributionTypes[0].toPass.scene_description.topic
  },
  subject_topic:function(){
    return this.incident.contributionTypes[2].toPass.scene_description.topic
  },
  conflict_topic:function(){
    return this.incident.contributionTypes[4].toPass.scene_description.topic
  },
  resolutotion_topic:function(){
    return this.incident.contributionTypes[6].toPass.scene_description.topic
  },

  topic: function(){
    console.log("perspectives: ", this.perspectives)
    console.log("bettersubmission: ", this.submissions)
    // console.log("aha: ", this.toPass.dropdownChoices)
    return this.incident.contributionTypes[0].toPass.story_topic
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
    for(let i of this.betterSubmissions){
      if(i.needName == "Context Building1" ){
        return true
      }
    }
    return false
  },

  Contextb_value_1(){
    // return this.betterSubmissions.filter(submission => submission.content.Needname == "Context Building1")
    const res = this.betterSubmissions.filter(submission => submission.castCategory === this.perspectives[0] && submission.needName === "Context Building1")
    // const res = this.betterSubmissions.filter(submission => submision.castCategory == "USA")
    console.log("context building shit: ", res)
    return res
  },

  Contextb_value_2(){
    const res = this.betterSubmissions.filter(submission => submission.castCategory === this.perspectives[1] && submission.needName === "Context Building1")
    console.log("Context Building shit: ", res)
    return res
  },

  Subjectresolution(){
    // this.betterSubmissions.filter(element => {
    //   if(element === "Character Introduction"){
    //     return true
    //   }
    // });
    // return false
    for(let i of this.betterSubmissions){
      if(i.needName === 'Character Introduction'){
        return true
      }
    }
    return false
  },

  Conflict(){
    for(let i of this.betterSubmissions){
      if(i.needName === 'Conflict'){
        return true
      }
    }
    return false
  },
  Conflict_value_1(){
    const res = this.betterSubmissions.filter(submission => submission.castCategory === this.perspectives[0] && submission.needName === "Conflict")
    return res
  },
  Conflict_value_2(){
    const res = this.betterSubmissions.filter(submission => submission.castCategory === this.perspectives[1] && submission.needName === "Conflict")
    return res
  },

  Conflict_resolution(){
    for(let i of this.betterSubmissions){
      if(i.needName === 'Conflict resolution'){
        return true
      }
    }
    return false
  },
  Conflict_resolution_value_1(){
    const res = this.betterSubmissions.filter(submission => submission.castCategory === this.perspectives[0] && submission.needName === "Conflict resolution")
    return res
  },
  Conflict_resolution_value_2(){
    const res = this.betterSubmissions.filter(submission => submission.castCategory === this.perspectives[1] && submission.needName === "Conflict resolution")
    return res
  },


  Subjectresolution_value_1(){
    const res = this.betterSubmissions.filter(submission => submission.castCategory === this.perspectives[0] && submission.needName === "Character Introduction")
    console.log("subject: ", res)
    return res
  },

  Subjectresolution_value_2(){
    const res = this.betterSubmissions.filter(submission => submission.castCategory === this.perspectives[1] && submission.needName === "Character Introduction")
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


