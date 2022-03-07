import './chat.html';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Messages } from '../../api/Messages/messages.js';
import { ChatOverview } from "../react-component/r_chat_overview"
import { Router } from 'meteor/iron:router';

import '../components/contributions.js';

//the settimeout is a bad hack to wait for newest messages to come in
//would recommend that you use tracker autorun instead (look at the collective narrative branch)
export const scrollToBottom = function(container){
  if (container == null) {return}
  if (container.scrollHeight - container.clientHeight - container.scrollTop > 200) {return}
  setTimeout(() => {
    container.scrollTop = container.scrollHeight - container.clientHeight;
  }, 200);
}

export const scrollToBottomAbs = function(container){
  if (container == null) {return}
  setTimeout(() => {
    container.scrollTop = container.scrollHeight - container.clientHeight;
  }, 200);
}

export const findPartner = function(uid, users) {
  //find the other chat recipient: will be in same triad && have stranger static affordance
  let aff = users.filter(u => u._id == uid)[0].profile.staticAffordances;
  // console.log("affordance: " + aff)
  let pair = Object.keys(aff).filter(k => k.search('pair') != -1)[0];
  // console.log("pair: " + pair)
  let otherStranger = users.filter(
    u => (u._id != uid)
    && (pair in u.profile.staticAffordances)
    // && !('friend' in u.profile.staticAffordances)
  );
  otherStranger = otherStranger.map(u => u._id);
  return otherStranger; 
}

export const getOtherUser = () => {
  let url =  Router.current().url;
  let userId = url.split("/");
  userId = userId[userId.length-1]
  return userId;
}

Template.chat.helpers({
  ChatOverview(){
    return ChatOverview
  }
})

Template.chatUsers.onRendered(function () {
  const messageContainer = document.getElementById('messages');
  messageContainer.style.height = `${window.innerHeight - 52 - 35 - 66}px`;
  scrollToBottomAbs(messageContainer);
});

Template.chatUsers.helpers({
  scroll(messages){
    const messageContainer = document.getElementById('messages');
    scrollToBottom(messageContainer);
    return
  },
  filterMessage(messages) {
    const otherUser = getOtherUser()
    return messages.filter(msg => msg.recipients.includes(otherUser) && msg.recipients.includes(Meteor.userId()))
  },
  getOtherUserName(){
    const otherUser = getOtherUser();
    const otherUserName =  Meteor.users.find({"_id": otherUser}).fetch()[0];
    return otherUserName.profile.firstName
  }
})

 Template.chatUsers.events({
  'submit #message'(event, instance) {
    event.preventDefault();
    const otherUser = getOtherUser();

    const $el = $(event.currentTarget);
    const $input = $el.find('.message-input');
    const uid = Meteor.userId();
    const data = { message: $input.val() };
    if (data.message === "") return;
    data.uid = uid;
    data.recipients = [uid, otherUser]
    
    let currentUsername = Meteor.users.findOne(Meteor.userId()).username;

    Meteor.call("sendMessage", data, (error, response) => {
      if (error) {
        console.log(error)
      } else {
        $input.val("");
        //always scroll to bottom after sending a message
        const messageContainer = document.getElementById('messages');
        scrollToBottomAbs(messageContainer);
      }
    });

    //send notification to the recipient for every message
    Meteor.call('sendNotification', otherUser, `${currentUsername}: ${data.message}`, " ",
     `/chat/${otherUser}`);
  }
});
