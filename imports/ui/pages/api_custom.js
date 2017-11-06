import './api_custom.html';
import '../components/contributions.html';
import '../components/loading_overlay.html';
import '../components/loading_overlay.js';
import '../components/loading_overlay.scss';

import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/underscore';

import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';
import { Users } from '../../api/users/users.js';
import { Locations } from '../../api/locations/locations.js';
import { Cerebro } from '../../api/cerebro/client/cerebro-client.js';
import { Submissions } from '../../api/submissions/submissions.js';
import { Images } from '../../api/images/images.js';
import { TextEntries } from '../../api/text-entries/text-entries.js';

import { photoInput } from './photoUploadHelpers.js'
import { photoUpload } from './photoUploadHelpers.js'


// HELPER FUNCTIONS FOR STORYTIME
Template.registerHelper('getPrevSentence', (subs) => {
  if(subs.length == 0){
    return "Jimmy looked up at the sky."
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
    return this.submissions.length+2;
  },
  notLastPage(){
    //TODO: pass in stopping critera
    return this.submissions.length+2 < 8;
  }
});


// HELPER FUNCTIONS FOR LOADING CUSTOM EXPERIENCES
Template.api_custom.helpers({
  data2pass(){
    //TODO: clean up this hot mess of a function
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

  const incidentId = Router.current().params._id;
  const imgHangle = this.subscribe('images', incidentId);
  const incHandle = this.subscribe('incidents.byId', incidentId);
  const expHandle = this.subscribe('experiences.byIncident', incidentId);
  const locHandle = this.subscribe('locations.byUser', Meteor.userId());
  //do we really need all of these?
  // const subHangle = this.subscribe('submissions', incidentId);
  // const textHangle = this.subscribe('textEntries.byIncident', incidentId);

  this.state = new ReactiveDict();

  this.autorun(() => {
    if (this.subscriptionsReady()) {
      console.log("subscriptions are now ready")
      const incident = Incidents.findOne(incidentId);
      this.state.set('incident', incident);

      const location = Locations.findOne({uid: Meteor.userId()})
      this.state.set('location', location);

      //not sure if we need these last two?
      const experience = Experiences.findOne(incident.experienceId);
      this.state.set('experience', experience);

      // if (experience.activeIncident) {
      //   this.subscribe('images', experience.activeIncident);
      // }
    }
  });
});

Template.api_custom.events({
  'submit form'(event, instance) {
    event.preventDefault();

    //this makes the loading circle show up
    event.target.getElementsByClassName("overlay")[0].style.display = "initial";

    // TODO: Probably can generalize this logic

    const location = instance.state.get('location');
    const incidentId = Router.current().params._id;
    const incident = instance.state.get('incident') //Incidents.findOne({_id: incidentId}) // TODO: might need to handle error cases?
    const experienceId = incident.experienceId;
    const userId = Meteor.userId()
    var submissions = {};

    var dropDowns = event.target.getElementsByClassName("dropdown")
    for(var i =0; i < dropDowns.length; i++){
      var index = dropDowns[i].selectedIndex;
      var id = TextEntries.insert({
        submitter: userId,
        text: dropDowns[i][index].value,
        contribution: dropDowns[i].id,
        experienceId: experienceId,
        incidentId: incidentId,
      });
      submissions[dropDowns[i].id] = id;
    }

    var forms = event.target.getElementsByClassName("form-control")
    for(var i =0; i < forms.length; i++){
      var id = TextEntries.insert({
        submitter: userId,
        text: forms[i].value,
        contribution: forms[i].id,
        experienceId: experienceId,
        incidentId: incidentId,
      });
      submissions[forms[i].id] = id;
    }

    var images = event.target.getElementsByClassName("fileinput")
    //no images being uploaded so we can just go right to the results page
    if(images.length== 0){
      Router.go('/apicustomresults/'+incidentId);
    }

    //otherwise, we do have images to upload so need to hang around for that
    for(var i =0; i < images.length; i++){
      const picture = event.target.photo && event.target.photo.files[i];
      var imageFile = Images.insert(picture, (err, imageFile) => {
        //this is a callback for after the image is inserted
        if (err) {
          alert(err);
        } else {
          //success branch of callback

          //add more info about the photo
          Images.update({_id: imageFile._id},{
            $set: {
              experienceId: experienceId,
              incidentId: incidentId,
              }
            });
          // TODO: setTimeout for automatically moving on if upload takes too long
          // This is a bit unfortunate...(waiting for a completed callback)
          // https://github.com/CollectionFS/Meteor-CollectionFS/issues/323

          //watch to see when the image db has been updated, then go to results
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
      //add the submitted image to the submissions content dictionary
      submissions[images[i].id] = imageFile._id;

    }//exit the for loop for images

    var submissionObject = {
      submitter: userId,
      experienceId: experienceId,
      incidentId: incidentId,
      situationNeed: instance.state.get('situationNeedName'),
      contributionTemplate: instance.state.get('contributionTemplate').name,
      content: submissions,
      timestamp: Date.parse(new Date()),
      lat: location.lat,
      lng: location.lng
    }

    Submissions.insert(submissionObject, (err, docs) => {
      if (err) {
        console.log("Error with submission, did not succeed", err);
      } else {
      }});

    },

    'click #participate-btn'(event, instance) {
      event.preventDefault();

      //makes it disappear so you don't see it while image is submitting
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
