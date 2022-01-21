import { Meteor } from 'meteor/meteor';
import { Messages } from './messages';

Meteor.methods({
	sendMessage({uid, message, recipients}) {
		Messages.insert({
			uid: uid,
			recipients: recipients,
			message: message,
			createdAt: new Date(),
			system: false,
			isReply: false,
			replyRecipient: null,
			route: null,
		});
	},
	sendReplyMessage({sender, message, receiver}){
		Messages.insert({
			uid: sender,
			recipients: receiver,
			message: message,
			createdAt: new Date(),
			system: false,
			isReply: true,
			replyRecipient: receiver[1],
			route: null,
		});
		
	}
});

export const sendSystemMessage = (message, recipients, route) => {
	Messages.insert({
		uid: "",
		recipients: recipients,
		message: message,
		createdAt: new Date(),
		system: true,
		isReply: false,
		replyRecipient: null,
		route: route,
	});
};
