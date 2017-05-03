import './api_custom.html';

import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/underscore';


import '../components/camera_upload.js';


import { Cerebro } from '../../api/cerebro/client/cerebro-client.js';
import { Images } from '../../api/images/images.js';
import { TextEntries } from '../../api/text-entries/text-entries.js';
import { ParticipationLocations } from '../../api/participation-locations/participation_locations.js';
import { LocationManager } from '../../api/locations/client/location-manager-client.js';
import { CONFIG } from '../../api/config.js'
import { getNumberOfUser } from '../../api/incidents/methods.js';



Template.registerHelper('camera_options', (detail) => {
  console.log("IN camera", detail)
  return {"camera": true, "text": false, "details":detail}
});



Template.api_custom.helpers({
  data2pass(){
    const instance = Template.instance();
    var userTag;
    var incident = instance.state.get('incident');

    incident.userMappings.forEach((uM)=>{
      if(uM.users.includes(Meteor.userId())){
        userTag = uM.name;
      }
    });

    console.log(Meteor.userId())
    console.log("user group is" + userTag);
    return {"incident": incident, "experience": instance.state.get('experience'), "user_mapping": userTag }
  },
  template_name() {
    const inst = Template.instance();
    console.log("temp name:", inst.state.get('experience').name.toLowerCase());
    return inst.state.get('experience').name.toLowerCase();
  },

});

Template.api_custom.onCreated(function() {
  const incidentId = Router.current().params._id;

  const experiencesHandle = this.subscribe('experiences.byIncident', incidentId);
  this.subscribe('participation_locations');

  this.submitting = new ReactiveVar(false);
  this.state = new ReactiveDict();
  const incidentHandle = this.subscribe('incidents.byId', incidentId);

  var first_run = true;
  this.autorun(() => {

    if (experiencesHandle.ready() && incidentHandle.ready()) {
      const incident = Incidents.findOne(incidentId);
      this.state.set('incident', incident);

      const experience = Experiences.findOne(incident.experienceId);
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
