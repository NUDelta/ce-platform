import './profile_question.html';

import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Schema } from '../../api/schema.js';

Template.profile_question.helpers({
  question: function () {
    return "Are you smart?";
  }
});