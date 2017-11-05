import './sunset.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/underscore';

import { Cerebro } from '../../api/cerebro/client/cerebro-client.js';
import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';
import { Images } from '../../api/images/images.js';
import { TextEntries } from '../../api/text-entries/text-entries.js';
import { CONFIG } from '../../api/config.js'
import '../globalHelpers.js';
import '../components/experience_buttons.js';
import '../components/loading_overlay.js';
import '../components/camera_upload.js';


Router.route('/participate/sunset/:_id', {
  template: 'sunset'
});

Template.sunset.helpers({
  options() {
    return {"camera": true, "text": false}
  }
});

Template.sunset.onCreated(function() {
  this.state = new ReactiveDict();
  const experiencesHandle = this.subscribe('experiences.byRoute', 'sunset');
  this.autorun(() => {
    if (experiencesHandle.ready()) {
      const experienceId = Experiences.findOne({route: 'sunset'})._id;
      this.subscribe('incidents.byExperience', experienceId);

      const experience = Experiences.findOne(experienceId);
      this.state.set('experience', experience);

      if (experience.activeIncident) {
        this.subscribe('images', experience.activeIncident);
      }
    }
  });

});
