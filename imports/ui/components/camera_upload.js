import './camera_upload.html'
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
import '../custom_exports.js';
import '../components/experience_buttons.js';
import '../components/map.js';
import '../components/loading_overlay.js';
import '../components/camera_upload.js';
import { photoInput } from '../globalHelpers.js';
import { photoUpload } from '../globalHelpers.js';

var permissions;
Template.cameraUpload.onCreated(function() {
  this.submitting = new ReactiveVar(false);
  this.state = new ReactiveDict();
  console.log(this.data.text, this.data.camera);
  permissions = this.data;
});

Template.cameraUpload.events({
  'submit form'(event, instance) {
    console.log("cameraUpload");

    event.preventDefault();

    instance.submitting.set(true);

    // TODO: Probably can generalize this logic
    const caption = event.target.write && event.target.write.value || '';
    const picture = event.target.photo && event.target.photo.files[0];

    const location = LocationManager.currentLocation();
    const place = Cerebro.getSubmissionLocation(location.lat, location.lng);
    const experienceId = Router.current().params._id;
    const experienceRoute = Experiences.findOne({_id: experienceId}).route;
    const incidentId = Incidents.findOne()._id; // TODO: might need to handle error cases?

    if (instance.data.text) {
      TextEntries.insert({
        submitter: Meteor.userId(),
        text: caption,
        experienceId: experienceId,
        incidentId: incidentId,
        lat: location.lat,
        lng: location.lng,
        location: place
      });
    }

    if (instance.data.camera) {
      Images.insert(picture, (err, imageFile) => {
        if (err) {
          // shouldn't happen
          alert(err);
        } else {
          var dets = "";
          if(instance.data.details){
            dets = instance.data.details;
          }
          Images.update(imageFile._id,
            {
              $set: {
                experienceId: experienceId,
                caption: caption,
                incidentId: incidentId,
                lat: location.lat,
                lng: location.lng,
                location: place,
                details:dets
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
                Router.go('/results/'+experienceRoute+'/'+incidentId);
              }
            }
          });
        }
      });
    } else {
      Router.go('/results/'+experienceRoute+'/'+incidentId);
    }
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
