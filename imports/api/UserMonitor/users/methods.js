// import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Assignments } from "../../OpportunisticCoordinator/databaseHelpers";

// via dburles:collection-helpers
Meteor.users.helpers({
  /**
   * usage in Meteor client/server code: Meteor.users.findOne().activeIncidents()
   * usage in Meteor Blaze template JS code: N/A -- had difficulty doing this
   *
   * @returns: activeIncidents {Array} array of incident iids e.g. [iid1, iid2]
   */
  activeIncidents() {
    return getUserActiveIncidents(this._id);
  }
});

/**
 * activeIncidents are the ones in which a user is assigned.
 *
 * @param uid
 * @return activeIncidents {Array} array of incident iids e.g. [iid1, iid2] or empty array []
 */
export const getUserActiveIncidents = (uid) => {
  return Assignments.find({"needUserMaps.users.uid": uid}, {fields: {_id: 1}}).fetch().map(doc => doc._id);
};

export const findUserByUsername = function (username) {
  return Meteor.users.findOne({ 'username': username });
};

export const _removeActiveIncidentFromUser = function (uid, iid) {
  Meteor.users.update({
    _id: uid
  }, {
    $addToSet: {
      'profile.pastIncidents': iid
    }
  });

  // TODO(rlouie): remove the active incident/need/place/dist info too
};

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
  run({ users }) {
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
  run({ experienceId }) {
       return Meteor.users.update({}, { $pull: { 'profile.activeExperiences': experienceId } }, { multi: true });
  }
});

// Note: subscribe all users to all OCEs by running
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
  run({ experienceId }) {
    return Meteor.users.update({
      'profile.subscriptions': { $nin: [experienceId] }
    }, {
      $push: { 'profile.subscriptions': experienceId }
    }, {
      multi: true
    });
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
  run({ experienceId }) {
    return Meteor.users.update({
      _id: this.userId,
      'profile.subscriptions': { $nin: [experienceId] }
    }, { $push: { 'profile.subscriptions': experienceId } });
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
  run({ experienceId }) {
    return Meteor.users.update({
      _id: this.userId,
      'profile.subscriptions': experienceId
    }, { $pull: { 'profile.subscriptions': experienceId } });
  }
});
