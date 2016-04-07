Template.archive.helpers({
  experiences: function() {
    return Experiences.find({author: Meteor.userId()});
  }
});


Template.archive.events({
  'click .btn-delete': function () {
    Meteor.call('removeExperience', this._id);
  }
});