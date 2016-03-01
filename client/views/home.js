Template.home.helpers({
  activeExperience: function () {
    return Meteor.users.findOne({_id: Meteor.userId()}).profile.activeExperience;
  }
});