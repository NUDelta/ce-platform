import { Meteor } from 'meteor/meteor';
import { Messages } from './messages';
import { Router } from 'meteor/iron:router';

Meteor.methods({
	sendMessage({uid, message, recipients}) {
		Messages.insert({
			uid: uid,
			recipients: recipients,
			message: message,
			createdAt: new Date(),
			isSystem: false,
			isReply: false,
			isExp: false,
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
			isSystem: false,
			isReply: true,
			isExp: false,
			replyRecipient: receiver[1],
			route: null,
			
		});
	},
});

export const sendSystemMessage = (message, recipients, route) => {
	Messages.insert({
		uid: "",
		recipients: recipients,
		message: message,
		createdAt: new Date(),
		isSystem: true,
		isReply: false,
		isExp: false,
		replyRecipient: null,
		route: null,
	});
};

export const postExpInChat = (message, recipients, expInChat) => {
	Messages.insert({
		uid: "",
		recipients: recipients,
		message: message,
		createdAt: new Date(),
		isSystem: false,
		isExp: expInChat,
		isReply: false,
		replyRecipient: null,
		route: null,
	});
};