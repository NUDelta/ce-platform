Template.myExperiencesPage.helpers({
  experiences: function() {
    return Experiences.find({author: Meteor.userId()});
  }
});


Template.myExperiencesPage.events({
  'click .btn-delete': function () {
    Meteor.call('removeExperience', this._id);
  }
});