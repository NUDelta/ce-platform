Template.home.helpers({
  activeExperience: function () {
    return Meteor.users.findOne({_id: Meteor.userId()}).profile.activeExperience;
  }
});

Template.home.events({
  'click .btn-participate': function () {
    Router.go('participatePage', {_id: Meteor.users.findOne({_id: Meteor.userId()}).profile.activeExperience});
  }
});