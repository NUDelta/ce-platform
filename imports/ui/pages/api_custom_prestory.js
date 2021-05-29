import './api_custom_prestory.html';
import '../components/contributions.html';
import '../components/loading_overlay.html';
import '../components/loading_overlay.js';
import '../components/loading_overlay.scss';

import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import { Users } from '../../api/UserMonitor/users/users.js';
import { Images } from '../../api/ImageUpload/images.js';
import { Incidents } from "../../api/OCEManager/OCEs/experiences";

import { photoInput } from './photoUploadHelpers.js'
import { photoUpload } from './photoUploadHelpers.js'
import {Meteor} from "meteor/meteor";
import {needIsAvailableToParticipateNow} from "../../api/OpportunisticCoordinator/strategizer";


// HELPER FUNCTIONS FOR LOADING CUSTOM PRESTORY QUESTIONS
Template.api_custom_prestory.helpers({

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
    const iid = Router.current().params.iid;
    const needName = Router.current().params.needName;
    const uid = Meteor.userId();
    const timestamp = Date.now()
    const submissions = {};
    // const resultsUrl = '/apicustomresults/' + iid + '/' + experience._id;
    const participateUrl = '/apicustom/' + iid + '/' + experience._id + '/' + needName;
    
    //castCategory
    const castDropDown = document.getElementById('casting question');
    const index = castDropDown.selectedIndex;
    const castCategory = castDropDown[index].value;
        
    Router.go(participateUrl);

    const submissionObject = {
      uid: uid,
      eid: experience._id,
      iid: iid,
      needName: needName,
      content: submissions,
      timestamp: timestamp,
      lat: location.lat,
      lng: location.lng,
      castCategory: castCategory
    };
    
    Meteor.call('createInitialSubmission', submissionObject);
  },
});