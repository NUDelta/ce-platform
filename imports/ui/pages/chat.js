import './chat.html';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Messages } from '../../api/Messages/messages.js';

import '../components/contributions.js';

//the settimeout is an EXTREMELY bad hack to wait for newest messages to come in
//would recommend that you use tracker autorun instead (look at the collective narrative branch)
export const scrollToBottom = function(container){
  setTimeout(() => {
    container.scrollTop = container.scrollHeight - container.clientHeight;
  }, 200);
}

Template.chat.onRendered(function () {
  const messageContainer = document.getElementById('messages');
  messageContainer.style.height = `${window.innerHeight - 52 - 35 - 66}px`;
  scrollToBottom(messageContainer);
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
    let triad = Object.keys(aff).filter(k => k.search('triad') != -1)[0];
    let otherStranger = this.users.filter(
      u => (u._id != uid)
      && (triad in u.profile.staticAffordances)
      && ('stranger' in u.profile.staticAffordances)
    );
    otherStranger = otherStranger.map(u => u._id)
    data.recipients = data.recipients.concat(otherStranger)

    Meteor.call("sendMessage", data, (error, response) => {
      if (error) {
        console.log(error)
      } else {
        $input.val("");
      }
    });

  },


  'click .ready-button'(event, instance) {
    event.preventDefault();
    const $el = $(event.currentTarget);
  }
});
