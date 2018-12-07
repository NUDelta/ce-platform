import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import { Messages } from '../messages.js';

Meteor.methods({
	
	sendMessage: function (data) {
    console.log("sending Message")

		check(data, {
			message: String, //the message to send
      name: Match.Optional(String), //if the user already has a name
      chapterID: String
		});
    
    if (data.message=="") {
      throw new Meteor.Error("message-empty", "Your message is empty");
    }

    // if (data.name=="") {
    //   throw new Meteor.Error("no name");
    // }
    
    let userName = (data.name && data.name!="") ? data.name : "Anonymous";
    let chapterID = data.chapterID;
    
    const matchName = data.message.match(/^My name is (.*)/i);
    
    if (matchName && matchName[1]!="") {
      userName = matchName[1];
      Messages.insert({
        name: "Chat Bot",
        message: "Hey everyone, " + userName + " is here!",
        createdAt: new Date(),
        announcement: true,
        chapterID:  chapterID
      });
    } else {
      Messages.insert({
        name: userName,
        message: data.message,
        createdAt: new Date(),
        announcement: false,
        chapterID:  chapterID
        //chapter: "1"
      });
    }
    
    return {
      name: userName
    };
		
	}
  
});