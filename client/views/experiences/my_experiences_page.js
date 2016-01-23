Template.myExperiencesPage.helpers({
  experiences: function() {
    return Experiences.find({author: Meteor.userId()});
  }
});
