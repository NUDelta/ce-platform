import './api_custom_results_expand.html';

import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { Router } from 'meteor/iron:router';


import { Template } from "meteor/templating";
import { Meteor } from 'meteor/meteor'
import '../components/displayImage.html';

// HELPER FUNCTIONS FOR LOADING CUSTOM PRESTORY QUESTIONS
Template.api_custom_results_expand.helpers({

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
  }

});

Template.seniorFinalsExpand.helpers({
  getSub(){
    console.log('running')
    const subId = Router.current().params.sid;
    const thisSub = this.submissions.filter(function(x){
      return x._id = subId;
    })
    console.log('getsub',thisSub);
    return thisSub;
  }
});

//note: needName for triparticipate often split into needName_triad#
Template.api_custom_results_expand.events({
  //Todo: a back button?
});
