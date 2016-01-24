Template.profileSettings.onCreated(function() {
  Session.set('hasDog', Meteor.user().profile.qualifications.hasDog);
  Session.set('hasCamera', Meteor.user().profile.qualifications.hasCamera);
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
    Meteor.users.update(Meteor.userId(), {$set: {'profile.qualifications.hasCamera': Session.get('hasCamera')}});
    Meteor.users.update(Meteor.userId(), {$set: {'profile.qualifications.hasDog': Session.get('hasDog')}});
    Meteor.call('updateUserExperiences', Meteor.user(), function(err, exps) {
      Meteor.users.update(Meteor.userId(), {$set: {'profile.experiences': exps}});
      let subs = Meteor.user().profile.subscriptions;
      subs = subs.filter(function(i) {
        return exps.indexOf(i) !== -1
      });
      Meteor.users.update(Meteor.userId(), {$set: {'profile.subscriptions': subs}});
    });
  }
});
