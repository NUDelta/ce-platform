import './active_experience.html';

import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Schema } from '../../api/schema.js';



Template.activeExperience.onCreated(function() {
  this.autorun(() => {
    new SimpleSchema({
      experience: {
        type: Schema.Experience,
      }
    }).validate(Template.currentData());
  })
});
