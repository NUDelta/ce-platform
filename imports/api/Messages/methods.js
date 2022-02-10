import { Meteor } from 'meteor/meteor';
import { Messages } from './messages';

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
		route: route,
	});
};

export const postExpInChat = (message, recipients, eid, iid) => {
	Messages.insert({
		uid: "",
		recipients: recipients,
		message: message,
		createdAt: new Date(),
		isSystem: false,
		isExp: (eid, iid),
		isReply: false,
		replyRecipient: null,
		route: null,
	});
};
 