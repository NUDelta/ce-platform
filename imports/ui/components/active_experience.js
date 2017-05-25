import './active_experience.html';

import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Schema } from '../../api/schema.js';

Template.activeExperience.onCreated(function() {
  this.autorun(() => {
    this.subscribe('experiences.activeUser'); // TODO: make more specific
    console.log("Current data for the template is", Template.currentData())
    new SimpleSchema({
      experience: {
        type: Schema.Experience,
      }
    }).validate(Template.currentData());
  })
});
