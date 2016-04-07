Template.home.helpers({
  activeExperiences: function () {
    return Meteor.users.findOne({_id: Meteor.userId()}).profile.activeExperiences;
  }
});

Template.activeExperience.events({
  'click .btn-participate': function () {
    Router.go('participatePage', {_id: this});
  }
});

Template.activeExperience.helpers({
  name: function () {
    return Experiences.findOne(this.toString()).name;
  }
});