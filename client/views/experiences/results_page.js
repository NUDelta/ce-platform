Template.resultsPage.onCreated(function() {
  this.subscribe('images', this.data._id);
  this.subscribe('textEntries');
});

Template.resultsPage.helpers({
  photoChosen: function(params) {
    let modules = Experiences.findOne(this.experience).modules;
    return _.contains(modules, 'camera');
  },
  textChosen: function(params) {
    let modules = Experiences.findOne(this.experience).modules;
    return _.contains(modules, 'text');
  },
  images: function(params) {
    return Images.find({incident: params._id});
  },
  textEntries: function(params) {
    return TextEntries.find({incident: params._id});
  }
});
