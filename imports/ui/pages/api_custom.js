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
import { Submissions } from '../../api/submissions/submissions.js';
import { Images } from '../../api/images/images.js';
import { TextEntries } from '../../api/text-entries/text-entries.js';
import { ParticipationLocations } from '../../api/participation-locations/participation_locations.js';
import { LocationManager } from '../../api/locations/client/location-manager-client.js';
import { CONFIG } from '../../api/config.js'
import { getNumberOfUser } from '../../api/incidents/methods.js';

Template.registerHelper('camera_options', (situationNeedName, contributionTemplate) => {
  return {"camera": true,
          "text": false,
          "situationNeed":situationNeedName,
          "contributionTemplate": contributionTemplate }
});

Template.registerHelper('storyContribs', (situationNeedName, contributionTemplate)=> {
  var dict = {}
  var textContributions = [];
  var imageContributions = false;
  var contributions = contributionTemplate.contributions;
  for (var key in contributions) {
    var value = contributions[key];
    if (value == "Image") {
      imageContributions = key;
    }
    if (value == "String"){
      textContributions.push(key);
    }
  }
  dict["situationNeed"] = situationNeedName,
  dict["contributionTemplateName"] = contributionTemplate.name
  dict["textContributions"] = textContributions
  dict["imageContributions"] = imageContributions
  return dict;
});

// Template.registerHelper('getText', (id) => {
//  var text = TextEntries.findOne({_id: id});
//  console.log("text: ", text.text);
//  console.log("getting text for ", id)
//  return text.text;
// });
//
// getNextSentenceId(photoIndex){
//    const instance = Template.instance()
//
//    var submission = instance.data.submissions[photoIndex-1];
//    console.log(submission)
//    console.log(submission.content.nextSentence)
//    return submission.content.nextSentence
//  },
//

Template.api_custom.helpers({
  data2pass(){
    const instance = Template.instance();
    var incident = instance.state.get('incident');

    var subs = Submissions.find({incidentId: incident._id}).fetch();

    hasSubs = false;
    if (subs.length > 0) {
      hasSubs = true;
    }
    console.log("subs are", subs);
    console.log(subs.length);

    // TODO: fix, dont want to get by experience
    var exp = instance.state.get('experience')
    aContribTemplate = exp.contributionGroups[0].contributionTemplates[0];
    contributions = aContribTemplate.contributions;
    var illustration = contributions.illustration;
    var nextSentence = contributions.nextSentence;
    var nextAffordance = contributions.nextAffordance;
    incident.situationNeeds.forEach((sitNeed)=>{
      if(sitNeed.notifiedUsers.includes(Meteor.userId())){
        situationNeedName = sitNeed.name;
        contributionTemplateName = sitNeed.contributionTemplate;
        affordance = sitNeed.affordance
      }
    });
    var contributionTemplate;

    exp.contributionGroups.forEach((group)=>{
      group.contributionTemplates.forEach((template)=>{
        if(template.name == contributionTemplateName){
          contributionTemplate = template
        }
      });
    });

    return {"incident": incident,
            "situationNeedName": situationNeedName,
            "contributionTemplate": contributionTemplate,
            "hasSubs": hasSubs,
            "pageNum": subs.length +1}
  },
  template_name() {
    const instance = Template.instance();
    console.log("temp name:", instance.state.get('experience').participateTemplate);
    return instance.state.get('experience').participateTemplate;
  }
});

Template.api_custom.onCreated(function() {
  const incidentId = Router.current().params._id;
  this.subscribe('images', incidentId);
  this.subscribe('submissions', incidentId);
  this.subscribe('textEntries.byIncident', incidentId);
  const incHandle = this.subscribe('incidents.byId', incidentId);
  const expHandle = this.subscribe('experiences.byIncident', incidentId);

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
