import './participate.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';

import { Cerebro } from '../../api/cerebro/client/cerebro-client.js';
import { Experiences } from '../../api/experiences/experiences.js';
import { Images } from '../../api/images/images.js';
import { TextEntries } from '../../api/text-entries/text-entries.js';
import { ParticipationLocations } from '../../api/participation-locations/participation_locations.js';
import { LocationManager } from '../../api/locations/client/location-manager-client.js';

import '../components/experience_buttons.js';
import '../components/map.js';

Template.participate.onCreated(function() {
  const experienceId = Router.current().params._id;

  this.subscribe('experiences.single', experienceId);
  this.subscribe('images', experienceId);
  this.subscribe('incidents');
  this.subscribe('participation_locations');

  this.state = new ReactiveDict();
  this.autorun(() => {
    const experience = Experiences.findOne(experienceId);

    if (experience) {
      this.state.set('experience', experience);
      this.state.set('incidentId', experience.activeIncident);
      Session.set('incidentId', experience.activeIncident);
      this.state.set('modules', this.state.get('experience').modules);
    }
  });

  this.usesModule = (module) => {
    return _.contains(this.state.get('modules'), module);
  };

  //need to deal with what happens when an experience ends (time stamp incidents?)
});

Template.participate.helpers({
  moduleChosen(module) {
    const instance = Template.instance();
    const modules = instance.state.get('modules');
    return _.contains(modules, module);
  },
  ownExperience() {
    const instance = Template.instance();
    const experience = instance.state.get('experience');
    return experience && experience.author == Meteor.userId();
  },
  formChosen() {
    const instance = Template.instance();
    const modules = instance.state.get('modules');
    return _.contains(modules, 'camera') ||
      _.contains(modules, 'text');
  },
  experienceButtonsArgs() {
    const instance = Template.instance();
    return {
      experience: instance.state.get('experience')
    };
  }
});

Template.participate.events({
  'submit form'(event, instance) {
    event.preventDefault();

    const caption = event.target.write.value || '';
    const picture = event.target.photo.files[0];

    const location = LocationManager.currentLocation();
    const place = Cerebro.getSubmissionLocation(location.lat, location.lng);
    const experienceId = Router.current.params._id;
    const incidentId = instance.state.get('incidentId');

    if (instance.usesModule('text')) {
      TextEntries.insert({
        submitter: Meteor.userId(),
        text: caption,
        experience: experienceId,
        incident: incidentId,
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
                experience: experienceId,
                caption: caption,
                incident: incidentId,
                lat: location.lat,
                lng: location.lng,
                location: place
              }
            }
          );
        }
      });
    }
    Router.go('results', { _id: incidentId });
  },
  'click #participate-btn'(event, instance) {
    event.preventDefault();

    const longitude = -(Math.random()*(90-70+1)+70);
    const latitude = Math.random()*(50-30+1)+30;
    const loc = {lat: latitude, lng: longitude};

    //for when mobile works
    // const loc = LocationManager.currentLocation();

    let participationLocLog = {
      incidentId: instance.state.get('incidentId'),
      experience: Router.current().params._id,
      userId: Meteor.userId(),
      lat: loc.lat,
      lng: loc.lng
    };

    ParticipationLocations.insert(participationLocLog);

    window.plugins.flashlight.available(function(isAvailable) {
      if (isAvailable) {
        console.log("we in here");
        // switch on
        window.plugins.flashlight.toggle();

      } else {
        console.log("We couldn't make it fam");
        alert("Flashlight not available on this device");
      }
    });
  }
});
