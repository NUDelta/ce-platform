import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import { Messages } from '../messages.js';

Meteor.methods({
	
	sendMessage: function (data) {
    console.log("sending Message")

		check(data, {
			message: String, //the message to send
      name: Match.Optional(String), //if the user already has a name
		});
    
    if (data.message=="") {
      throw new Meteor.Error("message-empty", "Your message is empty");
    }

    let participant = Meteor.users.findOne({
      "_id": data.name,
    })

    // if (data.name=="") {
    //   throw new Meteor.Error("no name");
    // }
    console.log(participant.profile.firstName)
    
    let userName = data.name ? participant.profile.firstName : "Anonymous";
    //let role = data.role

    console.log(userName)
    
    const matchName = data.message.match(/^My name is (.*)/i);
    
    // if (matchName && matchName[1]!="") {
    //   userName = matchName[1];
    //   Messages.insert({
    //     name: "Narrator",
    //     message: "The murderer is at a " + info,
    //     createdAt: new Date(),
    //     recipient: "all",
    //   });
    // } else {
      Messages.insert({
        name: userName,
        message: data.message,
        createdAt: new Date(),
        recipient: "all",
        //chapter: "1"
      });
    //}
    
    return {
      name: userName
    };
		
	},
  
  sendWhisper: function (data) {
    Messages.insert({
        name: "Narrator",
        message: "Welcome! You've been cast in the " + data.role + " role",
        createdAt: new Date(),
        recipient: data.uid,
      });
  },

  sendPrompt: function (data) {
    Messages.insert({
        name: "Narrator",
        message: "The murderer is at a " + info,
        createdAt: new Date(),
        recipient: "all",
      });
  }
  
  
});