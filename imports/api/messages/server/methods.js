import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import { Messages } from '../messages.js';

Meteor.methods({
	
	sendMessage: function (data) {
    console.log("sending Message")

		check(data, {
			message: String, //the message to send
      name: Match.Optional(String), //if the user already has a name
      image: String,
		});

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
    let img;

    if (data.image != "") {
      img = data.image
    } else {
      img = ""
    }

    console.log("img: " + img)
    
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
        imageID: img,
        //chapter: "1"
      });
    //}
    
    return {
      name: userName
    };
		
	},
  
  sendWhisper: function (role, user) {
    Messages.insert({
        name: "Narrator",
        message: "Welcome! You've been cast in the " + role + " role",
        createdAt: new Date(),
        recipient: user,
      });
  },

  sendPrompt: function (info, user) {
    Messages.insert({
        name: "Narrator",
        message: info,
        createdAt: new Date(),
        recipient: user,
      });
  }
  
  
});