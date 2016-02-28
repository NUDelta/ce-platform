var photoChosenLocal = function(exp) {
  let modules = Experiences.findOne(exp._id).modules;
  return _.contains(modules, 'camera');
}

var textChosenLocal = function(exp) {
  let modules = Experiences.findOne(exp._id).modules;
  return _.contains(modules, 'text');
}

Template.participatePage.helpers({
  photoChosen: function() {
    return photoChosenLocal(this);
  },
  ownExperience: function() {
    return this.author === Meteor.userId();
  },
  textChosen: function() {
    return textChosenLocal(this);
  }
});

Template.participatePage.events({
  'submit form': function(event, template) {
    event.preventDefault();

    let image = {};
    let textEntry = {};

    let isPhoto = photoChosenLocal(this);
    let isText = textChosenLocal(this);

    if (isPhoto) {
      let picture = event.target.photo.files[0];
      image = Images.insert(picture, (err, pictureObj) => {
        if (err) {
          console.log(error);
        } else {
          alert('we got it!');
        }
      });

      image = Images.findOne(image._id);

      let captionText = '';
      if (isText) {
        captionText = event.target.write.value;
      }

      Images.update({ _id: image._id }, {$set : { experience: this._id}});
    }

    if (isText) {
      let text = event.target.write.value;

      textEntry = {
        submitter: Meteor.userId(),
        text: text,
        experience: this._id
      }

      TextEntries.insert(textEntry);
    }

    Router.go('resultsPage', this);
  }
});
