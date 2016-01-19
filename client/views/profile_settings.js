Template.profileSettings.onCreated(function() {
  Session.set('hasDog', Meteor.user().profile.hasDog);
  Session.set('hasCamera', Meteor.user().profile.hasCamera);
});

Template.profileSettings.helpers({
  hc: function() {
    return Session.get('hasCamera');
  },
  hd: function() {
    return Session.get('hasDog');
  }
});

Template.profileSettings.events({
  'change .has-camera input': function (event) {
    Session.set('hasCamera', event.target.checked);
  },
  'change .has-dog input': function (event) {
    Session.set('hasDog', event.target.checked);
  },
  'submit .profile-settings': function (event) {
    event.preventDefault();
    console.log(Session.get('hasCamera'));
    Meteor.users.update(Meteor.userId(), {$set: {'profile.hasCamera': Session.get('hasCamera')}});
    Meteor.users.update(Meteor.userId(), {$set: {'profile.hasDog': Session.get('hasDog')}});
  }
});
