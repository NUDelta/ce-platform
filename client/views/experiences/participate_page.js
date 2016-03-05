let photoChosenLocal = (exp) => {
  let modules = Experiences.findOne(exp._id).modules;
  return _.contains(modules, 'camera');
};

let textChosenLocal = (exp) => {
  let modules = Experiences.findOne(exp._id).modules;
  return _.contains(modules, 'text');
};

Template.participatePage.onCreated(function() {
  this.subscribe('images', this.data._id);
});

Template.participatePage.helpers({
  photoChosen: function() {
    return photoChosenLocal(this);
  },
  ownExperience: function() {
    return this.author === Meteor.userId();
  },
  textChosen: function() {
    return textChosenLocal(this);
  },
  onlyTextChosen: function() {
    return !photoChosenLocal(this) && textChosenLocal(this);
  },
  photoOrTextChosen: function() {
    return photoChosenLocal(this) || textChosenLocal(this);
  }
});

Template.participatePage.events({
  'submit form': function(event, template) {
    event.preventDefault();

    let image = {},
        textEntry = {},
        isPhoto = photoChosenLocal(this),
        isText = textChosenLocal(this),
        captionText;

    if (isText) {
      captionText = event.target.write.value || '';
      textEntry = {
        submitter: Meteor.userId(),
        text: captionText,
        experience: this._id
      };
      TextEntries.insert(textEntry);
    }

    if (isPhoto) {
      let picture = event.target.photo.files[0];
      Images.insert(picture, (err, imageObj) => {
        if (err) {
          alert(error);
        } else {
          Images.update(imageObj._id,
            { $set : { experience: this._id, caption: captionText } }
          );
          console.log('Image metadata created.');
          alert('We got it!');
          Router.go('resultsPage', this);
          //let observer = Images.find(imageObj._id).observe({
          //  changed: (newImage, oldImage) => {
          //    if (newImage.isUploaded()) {
          //      observer.stop();
          //      alert('We got it!');
          //      Router.go('resultsPage', this);
          //    }
          //  }
          //})
        }
      });
    } else {
      Router.go('resultsPage', this);
    }
  }
});
