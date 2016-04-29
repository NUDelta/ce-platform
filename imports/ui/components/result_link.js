import './result_link.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';
import { Schema } from '../../api/schema.js';

Template.resultLink.onCreated(function () {
  this.autorun(() => {
    new SimpleSchema({
      incidentId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
      },
      experience: {
        type: Schema.Experience
      }
    }).validate(Template.currentData());
  });
});

