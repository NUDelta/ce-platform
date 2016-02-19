Template.participatePage.helpers({
  photoChosen: function() {
    let modules = Experiences.findOne(this._id).modules;
    return _.contains(modules, 'camera');
  },
  ownExperience: function() {
    return this.author === Meteor.userId();
  }
});

Template.participatePage.events({
  'submit form': function(event, template) {
    event.preventDefault();

    let image = {};
    let picture = event.target.photo.files[0];
    image = Images.insert(picture, (err, pictureObj) => {
      if (err) {
        console.log(error);
      } else {
        alert('we got it!');
      }
    });

    image = Images.findOne(image._id);
    Images.update({ _id: image._id }, {$set : { experience: this._id }});

    Router.go('resultsPage', this);
  }
});
