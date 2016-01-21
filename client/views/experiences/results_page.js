Template.resultsPage.helpers({
  images: function(params) {
    return Images.find({experience: params._id});
  }
});
