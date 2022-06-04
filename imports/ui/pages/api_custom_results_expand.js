import './api_custom_results_expand.html';

import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


import { Template } from "meteor/templating";
import { Meteor } from 'meteor/meteor'
import '../components/displayImage.html';

// HELPER FUNCTIONS FOR LOADING CUSTOM PRESTORY QUESTIONS
Template.api_custom_results_expand_page.onCreated(function () {
  const iid = FlowRouter.getParam('iid');
  const eid = FlowRouter.getParam('eid');
  this.autorun(() => {
    this.subscribe('experiences.single', eid);
    this.subscribe('submissions.activeIncident', iid);
    this.subscribe('users.all');
    this.subscribe('avatars.all');
  });
});

Template.api_custom_results_expand_page.helpers({
  apiCustomResultsExpandArgs() {
    const instance = Template.instance();
    return {
      experience: Experiences.findOne(),
      submissions: Submissions.find({}).fetch(),
      users: Meteor.users.find().fetch(),
      avatars: Avatars.find({}).fetch(),
    }
  }
});

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
    return this;
  }

});

Template.seniorFinalsExpand.helpers({
  getSub(){
    // console.log('running')
    const subId = FlowRouter.getParam('sid');
    const thisSub = this.submissions.filter(function(x){
      // console.log('id ', subId);
      if (x._id === subId) {
        return x;
      }
      // return x._id = subId;
    })
    // console.log('getsub ',thisSub);
    return thisSub;
  },
  getImageSub(sub) {
    // OLD VERSION WITH METEOR CFS
    // creatorSub = this.images.find(i => i._id === sub.content.proof);
    // return creatorSub;

    // S3 LINK
    return sub.content.proof;
  },
  getAvatarImg(sub) {
    // console.log("sub ", sub);
    // console.log("this ", this);
    // console.log("user ", this.avatars[0].username);
    let avatarImg = this.users.filter(function(user) {
      if (user._id === sub.uid) {
        return user;
      }
    });
    creatorAvatar = this.avatars.find(i => i.username === avatarImg[0].username);
    // console.log("avatarImg ", avatarImg[0].username);
    // console.log("creator ", creatorSub);
    return creatorAvatar;
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
    let timeBlocks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    console.log('time ',sub.timestamp.getDay(0));
    //let dayOfWeek = timeBlocks[sub.timestamp.getDay()];
    dayOfWeek = 'Monday'
    return dayOfWeek + ", " + sub.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  },
  getSentence(sub){
    console.log('in get sentence')
    if (sub.content.sentence === undefined){
      console.log('in if')
      let fullname = this.users.filter(function(user){
        if (user._id === sub.uid) {
          return user;
        }
      });
      let placeholder = fullname[0].profile.firstName  + " is feeling " + sub.castCategory + " .";
      return placeholder;
    }
    else{
      console.log('in else')
      return "\"" + sub.content.sentence + "\"";
    }
  }
});

//note: needName for triparticipate often split into needName_triad#
Template.api_custom_results_expand.events({
  //Todo: a back button?
  'click #back-btn': function(event, instance) {
    // console.log('back');
    // event.preventDefault();
    window.history.back();
  }
});
