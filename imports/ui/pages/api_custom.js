import './api_custom.html';
import '../components/contributions.html';
import '../components/loading_overlay.html';
import '../components/loading_overlay.js';
import '../components/loading_overlay.scss';

import { ReactiveDict } from 'meteor/reactive-dict';

import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';
import { Users } from '../../api/users/users.js';
import { Locations } from '../../api/locations/locations.js';
import { Submissions } from '../../api/submissions/submissions.js';
import { Images } from '../../api/images/images.js';
import { TextEntries } from '../../api/text-entries/text-entries.js';

import { photoInput } from './photoUploadHelpers.js'
import { photoUpload } from './photoUploadHelpers.js'


// HELPER FUNCTIONS FOR LOADING CUSTOM EXPERIENCES
Template.api_custom.helpers({

  test(){
    console.log(this.participateTemplate)
    return this.participateTemplate
  }
  // data2pass() {
  //   //TODO: clean up this hot mess of a function
  //   const instance = Template.instance();
  //   const incident = instance.state.get('incident');
  //   const subs = Submissions.find({ incidentId: incident._id }).fetch();
  //   const hasSubs = subs.length > 0;
  //
  //   // TODO: fix, dont want to get by experience
  //   const exp = instance.state.get('experience');
  //   incident.situationNeeds.forEach((sitNeed) => {
  //     if (sitNeed.notifiedUsers.includes(Meteor.userId())) {
  //       situationNeedName = sitNeed.name;
  //       contributionTemplateName = sitNeed.contributionTemplate;
  //       affordance = sitNeed.affordance
  //     }
  //   });
  //   let contributionTemplate;
  //   exp.contributionGroups.forEach((group) => {
  //     group.contributionTemplates.forEach((template) => {
  //       if (template.name === contributionTemplateName) {
  //         contributionTemplate = template
  //       }
  //     });
  //   });
  //
  //   instance.state.set('situationNeedName', situationNeedName);
  //   instance.state.set('contributionTemplate', contributionTemplate);
  //
  //   return {
  //     'incident': incident,
  //     'situationNeedName': situationNeedName,
  //     'contributionTemplate': contributionTemplate,
  //     'submissions': subs
  //   }
  // },
  // template_name() {
  //   const instance = Template.instance();
  //   return instance.state.get('experience').participateTemplate;
  // }
});

Template.api_custom.onCreated(() => {


  // do we really need all of these?
  // const incidentId = Router.current().params._id;
  // const imgHangle = this.subscribe('images', incidentId);
  // const incHandle = this.subscribe('incidents.byId', incidentId);
  // const expHandle = this.subscribe('experiences.byIncident', incidentId);
  // const locHandle = this.subscribe('locations.byUser', Meteor.userId());
  //
  //
  // // const subHangle = this.subscribe('submissions', incidentId);
  // // const textHangle = this.subscribe('textEntries.byIncident', incidentId);
  // this.state = new ReactiveDict();
  // this.autorun(() => {
  //   if (this.subscriptionsReady()) {
  //     console.log('subscriptions are now ready');
  //     const incident = Incidents.findOne(incidentId);
  //     this.state.set('incident', incident);
  //
  //     const location = Locations.findOne({ uid: Meteor.userId() });
  //     this.state.set('location', location);
  //
  //     //not sure if we need these last two?
  //     const experience = Experiences.findOne(incident.experienceId);
  //     this.state.set('experience', experience);
  //
  //     // if (experience.activeIncident) {
  //     //   this.subscribe('images', experience.activeIncident);
  //     // }
  //   }
  // });
});

Template.api_custom.events({
  'submit form'(event, instance) {
    event.preventDefault();

    //this makes the loading circle show up
    event.target.getElementsByClassName('overlay')[0].style.display = 'initial';

    // TODO: Probably can generalize this logic
    const location = instance.state.get('location');
    const incidentId = Router.current().params._id;
    const incident = instance.state.get('incident'); // Incidents.findOne({_id: incidentId}) // TODO: might need to handle error cases?
    const experienceId = incident.experienceId;
    const userId = Meteor.userId();
    const submissions = {};

    const dropDowns = event.target.getElementsByClassName('dropdown');
    _.forEach(dropDowns, (dropDown) => {
      const index = dropDown.selectedIndex;
      submissions[dropDown.id] = TextEntries.insert({
        submitter: userId,
        text: dropDown[index].value,
        contribution: dropDowns[i].id,
        experienceId: experienceId,
        incidentId: incidentId,
      });
    });

    const forms = event.target.getElementsByClassName('form-control');
    _.forEach((forms), (form) => {
      submissions[form.id] = TextEntries.insert({
        submitter: userId,
        text: form.value,
        contribution: form.id,
        experienceId: experienceId,
        incidentId: incidentId,
      });
    });

    const images = event.target.getElementsByClassName('fileinput');
    //no images being uploaded so we can just go right to the results page
    if (images.length === 0) {
      Router.go('/apicustomresults/' + incidentId);
    }

    //otherwise, we do have images to upload so need to hang around for that
    _.forEach(images, (image, index) => {
      const picture = event.target.photo && event.target.photo.files[index];

      // save image and get id of new document
      const imageFile = Images.insert(picture, (err, imageFile) => {
        //this is a callback for after the image is inserted
        if (err) {
          alert(err);
        } else {
          //success branch of callback

          //add more info about the photo
          Images.update({ _id: imageFile._id }, {
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
                Router.go('/apicustomresults/' + incidentId);
              }
            }
          });
        }
      });

      // add the submitted image to the submissions content dictionary
      submissions[image.id] = imageFile._id;
    });

    const submissionObject = {
      submitter: userId,
      experienceId: experienceId,
      incidentId: incidentId,
      situationNeed: instance.state.get('situationNeedName'),
      contributionTemplate: instance.state.get('contributionTemplate').name,
      content: submissions,
      timestamp: Date.now(),
      lat: location.lat,
      lng: location.lng
    };

    Submissions.insert(submissionObject, (err) => {
      if (err) {
        console.log('Error with submission, did not succeed', err);
      } else {
      }
    });
  },
  'click #participate-btn'(event, instance) {
    event.preventDefault();
    //makes it disappear so you don't see it while image is submitting
    document.getElementById('participate-btn').style.display = 'none';
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
