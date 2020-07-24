import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import { Messages } from '../messages.js';

Meteor.methods({
	sendMessage: function (data) {
		check(data, {
			message: String, //the message to send
      name: Match.Optional(String), //if the user already has a name
      image: String,
		});

    let participant = Meteor.users.findOne({
      "_id": data.name,
    })

    let userName = data.name ? participant.profile.firstName : "Anonymous";

    const matchName = data.message.match(/^My name is (.*)/i);
    let img;

    if (data.image != "") {
      img = data.image
    } else {
      img = ""
    }

    Messages.insert({
      name: userName,
      message: data.message,
      createdAt: new Date(),
      recipient: "all",
      imageID: img,
    });

    return {
      name: userName
    };

	},

});
