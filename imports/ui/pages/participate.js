import './participate.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { _ } from 'meteor/underscore';

import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';
import { Images } from '../../api/images/images.js';
import { TextEntries } from '../../api/text-entries/text-entries.js';

import '../components/experience_buttons.js';

let photoChosenLocal = (exp) => {
  let modules = Experiences.findOne(exp._id).modules;
  return _.contains(modules, 'camera');
};

let textChosenLocal = (exp) => {
  let modules = Experiences.findOne(exp._id).modules;
  return _.contains(modules, 'text');
};

Template.participate.onCreated(function() {
  this.subscribe('experiences', this.data._id);
  this.subscribe('incidents');
  this.subscribe('images', this.data._id);
});

Template.participate.helpers({
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

Template.participate.events({
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
        experience: this._id,
        incident: this.activeIncident
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
            { $set : { experience: this._id, caption: captionText, incident: this.activeIncident } }
            );
          console.log('Image metadata created.');
          alert('We got it!');

          Router.go('results', {_id: this.activeIncident});
          //let observer = Images.find(imageObj._id).observe({
          //  changed: (newImage, oldImage) => {
          //    if (newImage.isUploaded()) {
          //      observer.stop();
          //      alert('We got it!');
          //    }
          //  }
          //})
    }
  });
    } else {
      Router.go('results', {_id: this.activeIncident});
    }
  }
});
