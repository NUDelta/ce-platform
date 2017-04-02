import './custom.html';

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


Router.route('/participate/custom/:_id', {
  template: 'custom'
});

Template.custom.helpers({
  options() {
    return {"camera": true, "text": false}
  }
});

Template.custom.onCreated(function() {

  this.submitting = new ReactiveVar(false);
  this.state = new ReactiveDict();
  const experiencesHandle = this.subscribe('experiences.byRoute', 'custom');
  this.autorun(() => {
    if (experiencesHandle.ready()) {
      const experienceId = Experiences.findOne({route: 'custom'})._id;
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

//
// Template.custom.events({
//   'submit form'(event, instance) {
//     console.log("CUSTOM");
//
//     event.preventDefault();
//
//     instance.submitting.set(true);
//
//     // TODO: Probably can generalize this logic
//     const caption = event.target.write && event.target.write.value || '';
//     const picture = event.target.photo && event.target.photo.files[0];
//
//     const location = LocationManager.currentLocation();
//     const place = Cerebro.getSubmissionLocation(location.lat, location.lng);
//     const experienceId = Router.current().params._id;
//     const incidentId = Incidents.findOne()._id; // TODO: might need to handle error cases?
//
//     if (instance.usesModule('text')) {
//       TextEntries.insert({
//         submitter: Meteor.userId(),
//         text: caption,
//         experienceId: experienceId,
//         incidentId: incidentId,
//         lat: location.lat,
//         lng: location.lng,
//         location: place
//       });
//     }
//
//     if (instance.usesModule('camera')) {
//       Images.insert(picture, (err, imageFile) => {
//         if (err) {
//           // shouldn't happen
//           alert(err);
//         } else {
//           Images.update(imageFile._id,
//             {
//               $set: {
//                 experienceId: experienceId,
//                 caption: caption,
//                 incidentId: incidentId,
//                 lat: location.lat,
//                 lng: location.lng,
//                 location: place
//               }
//             }
//           );
//           // TODO: setTimeout for automatically moving on if upload takes too long
//           // This is a bit unfortunate...(waiting for a completed callback)
//           // https://github.com/CollectionFS/Meteor-CollectionFS/issues/323
//           const cursor = Images.find(imageFile._id).observe({
//             changed(newImage) {
//               if (newImage.isUploaded()) {
//                 cursor.stop();
//                 Router.go('results', { _id: incidentId });
//               }
//             }
//           });
//         }
//       });
//     } else {
//       Router.go('results', { _id: incidentId });
//     }
//   },
//   'click #flashlight-off-btn'(event, instance) {
//     const incidentId = Incidents.findOne()._id;
//
//     window.plugins.flashlight.available(function(isAvailable) {
//       if (isAvailable) {
//         // switch on
//         window.plugins.flashlight.toggle();
//         document.getElementById('participate-btn').style.display = "block";
//         document.getElementById('flashlight-off-btn').style.display = "none";
//       } else {
//         alert("Flashlight not available on this device");
//       }
//     });
//
//     let entryToRemove = ParticipationLocations.findOne({incidentId: incidentId, userId: Meteor.userId()});
//     ParticipationLocations.remove({_id: entryToRemove._id});
//
//   },
//   'click #participate-btn'(event, instance) {
//     event.preventDefault();
//
//     //for when mobile works
//     const loc = LocationManager.currentLocation();
//     const incidentId = Incidents.findOne()._id;
//
//     let participationLocLog = {
//       incidentId: incidentId,
//       experience: Router.current().params._id,
//       userId: Meteor.userId(),
//       lat: loc.lat,
//       lng: loc.lng
//     };
//
//     let submissionId = ParticipationLocations.insert(participationLocLog);
//     instance.autorun(() => {
//       const newLoc = LocationManager.currentLocation();
//       ParticipationLocations.update(submissionId, {$set: {lat: newLoc.lat, lng: newLoc.lng}});
//     });
//
//     //can only participate once, will need to be made smarter in the future
//     document.getElementById('participate-btn').style.display = "none";
//
//     if (instance.usesModule('flashlight')) {
//       window.plugins.flashlight.available(function(isAvailable) {
//         if (isAvailable) {
//           // switch on
//           window.plugins.flashlight.toggle();
//           document.getElementById('flashlight-off-btn').style.display = "block";
//         } else {
//           alert("Flashlight not available on this device");
//         }
//       });
//     }
//   },
//   'click .fileinput, touchstart .glyphicon-camera'(event, target) {
//     photoInput(event);
//   },
//   'click .glyphicon-remove'(event, target) {
//     // NOTE: 5/22/16: simpler methods don't seem to work here
//     // e.g. $fileInput.val('');
//     event.stopImmediatePropagation();
//     event.stopPropagation();
//     const $fileInput = $('input[name=photo]');
//     $fileInput.replaceWith($fileInput.val('').clone(true));
//
//     $('.fileinput-preview').attr('src', '#');
//     $('.fileinput-exists').hide();
//     $('.fileinput-new').show();
//   },
//   'change input[name=photo]'(event, target) {
//     photoUpload(event);
//   }
// });
