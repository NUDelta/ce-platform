Template.resultsPage.helpers({
  photoChosen: function(params) {
    let modules = Experiences.findOne(params._id).modules;
    return _.contains(modules, 'camera');
  },
  textChosen: function(params) {
    let modules = Experiences.findOne(params._id).modules;
    return _.contains(modules, 'text');
  },
  images: function(params) {
    return Images.find({experience: params._id});
  },
  textEntries: function(params) {
    console.log(params._id);
    return TextEntries.find({experience: params._id});
  }
});
