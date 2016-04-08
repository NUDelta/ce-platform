import './admin_experiences.html';

import { Template } from 'meteor/templating';
import { Experiences } from '../../api/experiences/experiences.js';

import '../components/experience_buttons.js';

Template.admin_experiences.helpers({
  experiences: function() {
    return Experiences.find({});
  }
});
