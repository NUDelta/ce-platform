Template.home.helpers({
  activeExperiences: function () {
    return Meteor.users.findOne({_id: Meteor.userId()}).profile.activeExperiences;
  }
});

Template.activeExperience.events({
  'click .btn-participate': function () {
    incidentId = Experiences.findOne({_id: this.toString()}).activeIncident;
    Router.go('participatePage', {_id: incidentId});
  }
});

Template.activeExperience.helpers({
  name: function () {
    return Experiences.findOne(this.toString()).name;
  }
});