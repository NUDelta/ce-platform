import './chat.html';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Messages } from '../../api/Messages/messages.js';

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

    //find the other chat recipient: will be in same triad && have stranger static affordance
    let aff = this.users.filter(u => u._id == uid)[0].profile.staticAffordances;
    console.log("affordance: " + aff)
    let triad = Object.keys(aff).filter(k => k.search('triad') != -1)[0];
    console.log("triad: " + triad)
    let otherStranger = this.users.filter(
      u => (u._id != uid)
      && (triad in u.profile.staticAffordances)
      // && !('friend' in u.profile.staticAffordances)
    );
    otherStranger = otherStranger.map(u => u._id)
    console.log("other stranger: " + otherStranger)
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
    Meteor.call('sendNotification', otherStranger, `${currrentUsername}: ${data.message}`,
     '/chat');
  }
});
