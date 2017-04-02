import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/underscore';

import { Cerebro } from '../api/cerebro/client/cerebro-client.js';
import { Experiences } from '../api/experiences/experiences.js';
import { Incidents } from '../api/incidents/incidents.js';
import { Images } from '../api/images/images.js';
import { TextEntries } from '../api/text-entries/text-entries.js';
import { ParticipationLocations } from '../api/participation-locations/participation_locations.js';
import { LocationManager } from '../api/locations/client/location-manager-client.js';
import { CONFIG } from '../api/config.js'

import './components/experience_buttons.js';
import './components/map.js';
import './components/loading_overlay.js';


export const photoInput = function(event){
  // NOTE: oddly, touchstart seems to happily trigger events, but
  // click won't.
  event.stopImmediatePropagation();
  event.stopPropagation();
  $('input[name=photo]').trigger('click');
}

export const photoUpload = function(event){
  const files = event.target.files;
  if (files && files[0]) {
    const reader = new FileReader();
    reader.onload = (event2) => {
      $('.fileinput-new').hide();
      $('.fileinput-exists').show();
      $('.fileinput-preview').attr('src', event2.target.result);
    };
    reader.readAsDataURL(files[0]);
  }
}

Template.registerHelper( 'gExperience', () => {
    const instance = Template.instance();
    return instance.state.get('experience');
});
Template.registerHelper( 'gModuleChosen', (module) => {
  const instance = Template.instance();
  const modules = instance.state.get('modules');
  return _.contains(modules, module);
});
Template.registerHelper( 'glboalLastEntry', (module) => {
  const instance = Template.instance();
  if (module == 'text') {
    const entry = TextEntries.findOne(instance.state.get('text'));
    return entry && entry.text;
  }
});

Template.registerHelper( 'gOwnExperience', () => {
  const instance = Template.instance();
  const experience = instance.state.get('experience');
  return experience && experience.author == Meteor.userId();
});
Template.registerHelper( 'gUploadRequired', () => {
  const instance = Template.instance();
  const modules = instance.state.get('modules');
  return _.contains(modules, 'camera') ||
      _.contains(modules, 'text') ||
      _.contains(modules, 'chain');
});
Template.registerHelper( 'gMapArgs', () => {
  const instance = Template.instance();
  const incident = Incidents.findOne();

  return {
    incidentId: incident && incident._id
  };
});
Template.registerHelper( 'gExperienceButtonsArgs', () => {
  const instance = Template.instance();
  return {
    experience: instance.state.get('experience')
  };
});
Template.registerHelper( 'gIsDebugUser', () => {
  return Meteor.isDevelopment || _.contains(CONFIG.DEBUG_USERS, Meteor.userId());
});
Template.registerHelper( 'gExperienceIsActive', () => {
  const instance = Template.instance();
  const experience = instance.state.get('experience');
  return experience.activeIncident;
});
Template.registerHelper( 'gIsSubmitting', () => {
  const instance = Template.instance();
  return instance.submitting.get();
});

//methods used in customresult.js
Template.registerHelper( 'gImages', () => {
  const instance = Template.instance();
  return Images.find(instance.filter.get());
});
Template.registerHelper( 'gTextEntries', () => {
  const instance = Template.instance();
  return TextEntries.find(instance.filter.get());
});
Template.registerHelper( 'gNoSubmissions', () => {
  const instance = Template.instance();
  return Images.find(instance.filter.get()).count() == 0 && TextEntries.find(instance.filter.get()).count() == 0;
});

Template.body.events({
  'submit form'(event, instance) {
    event.preventDefault();

    instance.submitting.set(true);

    // TODO: Probably can generalize this logic
    const caption = event.target.write && event.target.write.value || '';
    const picture = event.target.photo && event.target.photo.files[0];

    const location = LocationManager.currentLocation();
    const place = Cerebro.getSubmissionLocation(location.lat, location.lng);
    const experienceId = Router.current().params._id;
    const incidentId = Incidents.findOne()._id; // TODO: might need to handle error cases?

    if (instance.usesModule('text')) {
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

    if (instance.usesModule('camera')) {
      Images.insert(picture, (err, imageFile) => {
        if (err) {
          // shouldn't happen
          alert(err);
        } else {
          Images.update(imageFile._id,
            {
              $set: {
                experienceId: experienceId,
                caption: caption,
                incidentId: incidentId,
                lat: location.lat,
                lng: location.lng,
                location: place
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
                Router.go('results', { _id: incidentId });
              }
            }
          });
        }
      });
    } else {
      Router.go('results', { _id: incidentId });
    }
  },
  'click #flashlight-off-btn'(event, instance) {
    const incidentId = Incidents.findOne()._id;

    window.plugins.flashlight.available(function(isAvailable) {
      if (isAvailable) {
        // switch on
        window.plugins.flashlight.toggle();
        document.getElementById('participate-btn').style.display = "block";
        document.getElementById('flashlight-off-btn').style.display = "none";
      } else {
        alert("Flashlight not available on this device");
      }
    });

    let entryToRemove = ParticipationLocations.findOne({incidentId: incidentId, userId: Meteor.userId()});
    ParticipationLocations.remove({_id: entryToRemove._id});

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

    if (instance.usesModule('flashlight')) {
      window.plugins.flashlight.available(function(isAvailable) {
        if (isAvailable) {
          // switch on
          window.plugins.flashlight.toggle();
          document.getElementById('flashlight-off-btn').style.display = "block";
        } else {
          alert("Flashlight not available on this device");
        }
      });
    }
  },
  'click .fileinput, touchstart .glyphicon-camera'(event, target) {
    // NOTE: oddly, touchstart seems to happily trigger events, but
    // click won't.
    event.stopImmediatePropagation();
    event.stopPropagation();
    $('input[name=photo]').trigger('click');
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
    const files = event.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event2) => {
        $('.fileinput-new').hide();
        $('.fileinput-exists').show();
        $('.fileinput-preview').attr('src', event2.target.result);
      };
      reader.readAsDataURL(files[0]);
    }
  }
});
