import './cheers.html';

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
import { ParticipationLocations } from '../../api/participation-locations/participation_locations.js';
import { LocationManager } from '../../api/locations/client/location-manager-client.js';
import { CONFIG } from '../../api/config.js'
import '../globalHelpers.js';
import '../components/experience_buttons.js';
import '../components/map.js';
import '../components/loading_overlay.js';
import '../components/camera_upload.js';


Router.route('/participate/cheers/:_id', {
  template: 'cheers'
});

Template.cheers.helpers({
  options() {
    var side = "left";
    if(Images.find().count() % 2 == 0){
      side =  "right";
    }
    return {"camera": true, "text": false, "details": side}
  }
});

Template.cheers.onCreated(function() {
  this.submitting = new ReactiveVar(false);
  this.state = new ReactiveDict();
  const experiencesHandle = this.subscribe('experiences.byRoute', 'cheers');
  this.autorun(() => {
    if (experiencesHandle.ready()) {
      const experienceId = Experiences.findOne({route: 'cheers'})._id;
      this.subscribe('participation_locations');
      this.subscribe('incidents.byExperience', experienceId);

      const experience = Experiences.findOne(experienceId);
      this.state.set('experience', experience);
      this.state.set('modules', this.state.get('experience').modules);

      if (experience.activeIncident) {
        this.subscribe('images', experience.activeIncident);
      }
    }
  });

  this.usesModule = (module) => {
    return _.contains(this.state.get('modules'), module);
  };

  //need to deal with what happens when an experience ends (time stamp incidents?)
});
