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


Template.rainbow.helpers({
  camera_options(){
    const instance = Template.instance();
    return {"camera": true, "text": false, "versions":this.versions}
  }

});


Template.api_custom.helpers({
  data2pass(){
    const instance = Template.instance();
    return {"incident": instance.state.get('incident'), "experience": instance.state.get('experience'), "usernum" : instance.state.get('usernum')}
  },
  template_name() {
    const inst = Template.instance();
    console.log("temp name:", inst.state.get('experience').participate_template);
    return inst.state.get('experience').participate_template;
  },
  findUserNumber(){
    const inst = Template.instance();

    // var test = getNumberOfUser.call({userId: Meteor.userId(), inc_id: inst.state.get('incident')._id});
  return 0;
  }
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

      var inc = this.state.get('incident');

      if(first_run){
        console.log("is useId in the array alraeyd?",  inc == null || ! (Meteor.userId() in inc.in_progress_ids));
        if( inc == null || ! (Meteor.userId() in inc.in_progress_ids)){
          console.log("UPDATING AGAIN OOP")

          Meteor.call('incident.getNumberOfUser',{userId: Meteor.userId(), inc_id:  incidentId},
            function(error, result){
              if(error){
                console.log('Error');
              }else{
                console.log("it worked");
              }
            });
          first_run = false;

        }

      }
      const incident = Incidents.findOne(incidentId);
      this.state.set('incident', incident);

      var userArr =  incident.in_progress_ids;
      this.state.set('usernum', incident.in_progress_numbers[userArr.indexOf(Meteor.userId())]);
      console.log("usernum as saved in state", this.state.get('usernum'));


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
