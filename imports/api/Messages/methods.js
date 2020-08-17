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
			route: null,
		});
	}
});

/* why does this not work
export const sendSystemMessage = (message, recipients, route) => {
	Messages.insert({
		uid: "",
		recipients: recipients,
		message: message,
		createdAt: new Date(),
		system: true,
		route: route,
	});
};
*/
