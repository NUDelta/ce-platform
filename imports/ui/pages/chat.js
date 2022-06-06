import './chat.html';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Messages } from '../../api/Messages/messages.js';

import '../components/contributions.js';

Template.chat_page.onCreated(function () {
  const iid = FlowRouter.getParam('iid');
  const eid = FlowRouter.getParam('eid');
  this.autorun(() => {
    this.subscribe('users.all');
    // this.subscribe('messages.all');
    this.subscribe('messages.user', Meteor.userId());
    // this.subscribe('avatars.all');
  });
});

Template.chat_page.helpers({
  chatArgs() {
    const instance = Template.instance();
    return {
      pageReady: instance.subscriptionsReady(),
      users: Meteor.users.find().fetch(),
      messages: Messages.find().fetch(),
      // avatars: Avatars.find({}).fetch(),
    }
  }
});

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

//find their partner given the uid
export const findPartner = function(uid) {
  console.log(`my uid: ${uid}`);
  //find their partner (look for another user with "pairX" in staticAffordances)
  let aff = Meteor.user().profile.staticAffordances;
  // console.log("affordance: " + aff)
  let pair = Object.keys(aff).filter(k => k.search('pair') != -1)[0];
  // console.log("pair: " + pair)
  let partner = Meteor.users.find().fetch().filter(
    u => (u._id != uid)
    && (pair in u.profile.staticAffordances)
  )
  partner = partner.map(u => u._id);
  console.log(`partner: ${partner}`);
  return partner; 
}

Template.chat.onRendered(function () {
  const messageContainer = document.getElementById('messages');
  messageContainer.style.height = `${window.innerHeight - 52 - 35 - 66}px`;
  scrollToBottomAbs(messageContainer);
});

Template.chat.helpers({
  scroll(messages){
    const messageContainer = document.getElementById('messages');
    scrollToBottom(messageContainer);
    return
  }
})

 Template.chat.events({
  'submit #message'(event, instance) {
    event.preventDefault();

    const $el = $(event.currentTarget);
    const $input = $el.find('.message-input');
    const uid = Meteor.userId();
    const data = { message: $input.val() };
    if (data.message === "") return;
    data.uid = uid;
    data.recipients = [uid]
    
    otherStranger = findPartner(uid)
    // console.log("other stranger: " + otherStranger)
    data.recipients = data.recipients.concat(otherStranger)
    let currrentUsername = Meteor.users.findOne(Meteor.userId()).username;

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
    Meteor.call('sendNotification', otherStranger, `${currrentUsername}: ${data.message}`, ' ', '/chat');
  }
});
