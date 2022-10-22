import { Template } from 'meteor/templating';
import { Users } from '../../api/UserMonitor/users/users.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './contributions.html';
import moment from 'moment';
import { CEResponse } from '../react-component/ce_response';
import { CEResponseChat } from '../react-component/ce_response_chat';
import { Followups } from '../react-component/followups';

Template.message.helpers({

  CEResponse(){
    return CEResponse
  },
  Followups(){
    return Followups
  },
  CEResponseChat(){
    return CEResponseChat
  },
  timestamp(timestamp) {
    const sentTime = moment(timestamp);
    //if today, just show time, else if some other day, show date and time
    if (sentTime.isSame(new Date(), "day")) {
      return sentTime.format("h:mm a");
    }
    return sentTime.format("M/D/YY h:mm a");
  },
  getUsername(uid){
    return Meteor.users.findOne({_id: uid}).username;
  },
  getFirstName(uid){
    return Meteor.users.findOne({_id: uid}).profile.firstName;
  },
  getSenderAndSetClass(uid, system){
    if (Meteor.userId() == uid) {
      return 'sender message'
    } else {
      return 'recipient message'
    }
  },
  isReceiver(msg){
    // console.log("hiiii");
    // console.log(msg);
    // let currentUser = Meteor.users.findOne(Meteor.userId());
    // return true;
    return Meteor.userId() === msg.replyRecipient;
  }
});

Template.message.events({
  'click .system'(event, instance) {
    event.preventDefault();
    FlowRouter.go(this.route);
  }
})
