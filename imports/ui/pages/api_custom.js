import './api_custom.html';
import '../components/contributions.html';
import '../components/loading_overlay.html';
import '../components/loading_overlay.js';
import '../components/loading_overlay.scss';

import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';
import { Users } from '../../api/users/users.js';

import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/underscore';

import { Cerebro } from '../../api/cerebro/client/cerebro-client.js';
import { Submissions } from '../../api/submissions/submissions.js';
import { Images } from '../../api/images/images.js';
import { TextEntries } from '../../api/text-entries/text-entries.js';
import { ParticipationLocations } from '../../api/participation-locations/participation_locations.js';
import { LocationManager } from '../../api/locations/client/location-manager-client.js';

import { photoInput } from '../globalHelpers.js';
import { photoUpload } from '../globalHelpers.js';

Template.registerHelper('storyContribs', (situationNeedName, contributionTemplate)=> {
  var dict = {}
  var textContributions = [];
  var dropDownContributions = [];
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
    if(typeof value == "object"){
      var newDict = {}
      newDict[key] = value[1]
      dropDownContributions.push(newDict);
    }
  }
  dict["situationNeed"] = situationNeedName,
  dict["contributionTemplateName"] = contributionTemplate.name
  dict["textContributions"] = textContributions
  dict["imageContributions"] = imageContributions
  dict["dropDownContributions"] = dropDownContributions
  return dict;
});

Template.registerHelper('getPrevSentence', (subs) => {
  if(subs.length == 0){
    return "Jimmy feel asleep while watching the clouds move across the sky."
  }
  var submission = subs[subs.length-1];
  var id = submission.content.nextSentence
  var prevSentence = TextEntries.findOne({_id: id}).text;
  return prevSentence;
});

Template.registerHelper('getPrevAffordance', (subs) => {
  if(subs.length == 0){
    return "cloud watch";
  }
  var submission = subs[subs.length-1];
  var id = submission.content.nextAffordance
  var prevAff = TextEntries.findOne({_id: id}).text;
  return prevAff;
});


Template.registerHelper('passContributionName', (name) => {
      const instance = Template.instance();
      var contributions = instance.data.contributionTemplate.contributions;
      if(typeof contributions[name] == "object"){
        return {key:name, options: contributions[name][1]}
      }
      return {key: name}

});


Template.api_custom.helpers({
  data2pass(){
    const instance = Template.instance();
    var incident = instance.state.get('incident');
    var subs = Submissions.find({incidentId: incident._id}).fetch();
    hasSubs = false;
    if (subs.length > 0) {
      hasSubs = true;
    }
    // TODO: fix, dont want to get by experience
    var exp = instance.state.get('experience')
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
    instance.state.set('situationNeedName', situationNeedName);
    instance.state.set('contributionTemplate', contributionTemplate);


    return {"incident": incident,
            "situationNeedName": situationNeedName,
            "contributionTemplate": contributionTemplate,
            "submissions": subs}
  },
  template_name() {
    const instance = Template.instance();
    return instance.state.get('experience').participateTemplate;
  }
});

Template.api_custom.onCreated(function() {
  console.log("user id that is logged in", Meteor.userId())
  const incidentId = Router.current().params._id;
  this.subscribe('images', incidentId);
  this.subscribe('submissions', incidentId);
  this.subscribe('textEntries.byIncident', incidentId);
  const incHandle = this.subscribe('incidents.byId', incidentId);
  const expHandle = this.subscribe('experiences.byIncident', incidentId);

  const experiencesHandle = this.subscribe('experiences.byIncident', incidentId);
  this.subscribe('participation_locations');

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


Template.storyPage.helpers({
    getPrevSentenceId(photoIndex){
        const instance = Template.instance()
        var incident = instance.state.get('incident');
        var subs = Submissions.find({incidentId: incident._id}).fetch();
        // var submission = instance.data.submissions[photoIndex-1];
        // console.log(submission)
        // console.log(submission.content.nextSentence)
        var id = submission.content.nextSentence
        var text = TextEntries.findOne({_id: id});
        return text.text;
    },
    getPageNum(){
      return this.submissions.length+1;
    },
    notLastPage(){
      //TODO: pass in stopping critera
      return this.submissions.length < 5-1;
    }
  });

  Template.api_custom.events({
  'submit form'(event, instance) {
    console.log("cameraUpload");
    console.log("userID on submission is", Meteor.userId())

    event.preventDefault();
        // instance.submitting.set(true);
    console.log('event.target.: ', event.target);
    event.target.getElementsByClassName("overlay")[0].style.display = "initial";
    

    // TODO: Probably can generalize this logic

    // const captions = event.target.write && event.target.write.value || '';
    // console.log("captions are ", captions)
    const picture = event.target.photo && event.target.photo.files[0];

    const location = LocationManager.currentLocation();
    const place = Cerebro.getSubmissionLocation(location.lat, location.lng);
    const incidentId = Router.current().params._id;
    const incident = Incidents.findOne({_id: incidentId}) // TODO: might need to handle error cases?
    const experienceId = incident.experienceId;

    var submissions = {};

    var dropDowns = event.target.getElementsByClassName("dropdown")
    for(var i =0; i < dropDowns.length; i++){
      var index = dropDowns[i].selectedIndex;
        var id = TextEntries.insert({
          submitter: Meteor.userId(),
          text: dropDowns[i][index].value,
          contribution: dropDowns[i].id,
          experienceId: experienceId,
          incidentId: incidentId,
          lat: location.lat,
          lng: location.lng,
          location: place,
        });
        submissions[dropDowns[i].id] = id;
      }

    var forms = event.target.getElementsByClassName("form-control")
    for(var i =0; i < forms.length; i++){
        var id = TextEntries.insert({
          submitter: Meteor.userId(),
          text: forms[i].value,
          contribution: forms[i].id,
          experienceId: experienceId,
          incidentId: incidentId,
          lat: location.lat,
          lng: location.lng,
          location: place,
        });
        submissions[forms[i].id] = id;
      }


      var images = event.target.getElementsByClassName("fileinput")
      if(images.length== 0){
        Router.go('/apicustomresults/'+incidentId);
      }
      for(var i =0; i < images.length; i++){
        var imageFile = Images.insert(picture, (err, imageFile) => {
            if (err) {
              // shouldn't happen
              alert(err);
            } else {
              Images.update(imageFile._id,
                {
                  $set: {
                    experienceId: experienceId,
                    //caption: caption,
                    incidentId: incidentId,
                    lat: location.lat,
                    lng: location.lng,
                    location: place,
                  }
                }
              );
              // TODO: setTimeout for automatically moving on if upload takes too long
              // This is a bit unfortunate...(waiting for a completed callback)
              // https://github.com/CollectionFS/Meteor-CollectionFS/issues/323
              const cursor = Images.find(imageFile._id).observe({
                changed(newImage) {
                  if (newImage.isUploaded()) {
                    cursor.stop();
                    Router.go('/apicustomresults/'+incidentId);
                  }
                }
              });
            }
          });
    

    submissions[images[i].id] = imageFile._id;
    var submissionObject = {
      submitter: Meteor.userId(),
      experienceId: experienceId,
      incidentId: incidentId,
      situationNeed: instance.state.get('situationNeedName'),
      contributionTemplate: instance.state.get('contributionTemplate').name,
      content: submissions
    }

    console.log('submissionObject: ', submissionObject);

    Submissions.insert(submissionObject, (err, docs) => {
      if (err) {
        console.log("Didn't submit", err);
      } else {
        console.log("DID SUBMIT", docs)
      }});
    }
    
    Meteor.users.update({_id: Meteor.userId()}, {
      $set: {"profile.lastParticipated": Date.parse(new Date()) }
    })


  },
  'click #participate-btn'(event, instance) {
    event.preventDefault();

    //for when mobile works
    const loc = LocationManager.currentLocation();
    const incidentId = Incidents.findOne()._id;

    let participationLocLog = {
      incidentId: incidentId,
      experience: Router.current().params._id,
      userId: Meteor.userId(),
      lat: loc.lat,
      lng: loc.lng
    };

    let submissionId = ParticipationLocations.insert(participationLocLog);
    instance.autorun(() => {
      const newLoc = LocationManager.currentLocation();
      ParticipationLocations.update(submissionId, {$set: {lat: newLoc.lat, lng: newLoc.lng}});
    });

    //can only participate once, will need to be made smarter in the future
    document.getElementById('participate-btn').style.display = "none";

  },
  'click .fileinput, touchstart .glyphicon-camera'(event, target) {
    photoInput(event);
  },
  'click .glyphicon-remove'(event, target) {
    // NOTE: 5/22/16: simpler methods don't seem to work here
    // e.g. $fileInput.val('');
    event.stopImmediatePropagation();
    event.stopPropagation();
    const $fileInput = $('input[name=photo]');
    $fileInput.replaceWith($fileInput.val('').clone(true));

    $('.fileinput-preview').attr('src', '#');
    $('.fileinput-exists').hide();
    $('.fileinput-new').show();
  },
  'change input[name=photo]'(event, target) {
    photoUpload(event);
  }
});
