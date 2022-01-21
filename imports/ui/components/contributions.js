import { Template } from 'meteor/templating';
import { Users } from '../../api/UserMonitor/users/users.js';
import { Router } from 'meteor/iron:router';
import './contributions.html';
import moment from 'moment';

Template.message.helpers({
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
    Router.go(this.route);
  }
})
