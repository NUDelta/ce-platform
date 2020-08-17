import { Meteor } from 'meteor/meteor';
import { Messages } from '../messages.js';

Meteor.publish('messages.user', function(userId) {
  return Messages.find({
    recipients: userId
  },{
    limit: 100,
    sort: { createdAt: 1}
  });
})

Meteor.publish('messages',function(){
  return Messages.find();
});
