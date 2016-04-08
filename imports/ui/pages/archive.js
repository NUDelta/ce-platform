import './archive.html';

import { Template } from 'meteor/templating';
import { Experiences } from '../../api/experiences/experiences.js';
import { removeExperience } from '../../api/experiences/methods.js';

Template.archive.helpers({
  experiences: function() {
    return Experiences.find({ author: Meteor.userId() });
  }
});


Template.archive.events({
  'click .btn-delete': function () {
    removeExperience.call({ experienceId: this._id });
  }
});