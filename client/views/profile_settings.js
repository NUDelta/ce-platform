Template.profileSettings.helpers({
  hc: function() {
    return Meteor.user().profile.qualifications.hasCamera;
  },
  hd: function() {
    return Meteor.user().profile.qualifications.hasDog;
  }
});

Template.profileSettings.events({
  'submit .profile-settings': function (event) {
    event.preventDefault();
    console.log(event);
    Meteor.users.update(Meteor.userId(), {$set: {'profile.qualifications.hasCamera': event.currentTarget.camera.checked}});
    Meteor.users.update(Meteor.userId(), {$set: {'profile.qualifications.hasDog': event.currentTarget.dog.checked}});
    Meteor.call('updateUserExperiences', Meteor.user(), (err, exps) => {
      Meteor.users.update(Meteor.userId(), {$set: {'profile.experiences': exps}});
      let subs = Meteor.user().profile.subscriptions;
      subs = subs.filter((sub) => {
        return _.contains(exps, sub);
      });
      Meteor.users.update(Meteor.userId(), {$set: {'profile.subscriptions': subs}});
    });
  }
});
