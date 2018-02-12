import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {_} from 'meteor/underscore';



export const addActiveIncidentToUser = function(uid, iid);
{
    console.log('setActiveExperiences', userId, iid);
    Meteor.users.update({
        _id: userId
    }, {
        $addToSet: {
            'profile.activeIncidents': iid
        }
    });
}


export const getEmails = new ValidatedMethod({
    name: 'users.getEmails',
    validate: new SimpleSchema({
        users: {
            type: Array
        },
        'users.$': {
            type: Object
        }
    }).validator(),
    run({users}) {
        return _.map(users, user => Meteor.users.findOne(user).emails[0]);
    }
});

export const removeFromAllActiveExperiences = new ValidatedMethod({
    name: 'users.removeFromAllActiveExperiences',
    validate: new SimpleSchema({
        experienceId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        }

    }).validator(),
    run({experienceId}) {
        console.log("experience ended so removing frmo user profiles")
        return Meteor.users.update({}, {$pull: {'profile.activeExperiences': experienceId}}, {multi: true});
    }
});

// Note: subscribe all users to all experiences by running
// Experiences.find().fetch().forEach(function(elem, index, array) { Meteor.call('users.subscribeAllUsersToExperience', {experienceId: elem._id}); });
// in your console with all Experiences subscribed
export const subscribeAllUsersToExperience = new ValidatedMethod({
    name: 'users.subscribeAllUsersToExperience',
    validate: new SimpleSchema({
        experienceId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        }
    }).validator(),
    run({experienceId}) {
        return Meteor.users.update({'profile.subscriptions': {$nin: [experienceId]}}, {$push: {'profile.subscriptions': experienceId}}, {multi: true});
    }
});

export const subscribeUserToExperience = new ValidatedMethod({
    name: 'users.subscribeUserToExperience',
    validate: new SimpleSchema({
        experienceId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        }
    }).validator(),
    run({experienceId}) {
        return Meteor.users.update({
            _id: this.userId,
            'profile.subscriptions': {$nin: [experienceId]}
        }, {$push: {'profile.subscriptions': experienceId}});
    }
});

export const unsubscribeUserFromExperience = new ValidatedMethod({
    name: 'users.unsubscribeUserFromExperience',
    validate: new SimpleSchema({
        experienceId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        }
    }).validator(),
    run({experienceId}) {
        return Meteor.users.update({
            _id: this.userId,
            'profile.subscriptions': experienceId
        }, {$pull: {'profile.subscriptions': experienceId}});
    }
});
