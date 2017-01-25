import './available_experiences.html';

import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { getConfig, toggleDebugPush } from '../../api/config.js';
import { Experiences } from '../../api/experiences/experiences.js';
import { Locations } from '../../api/locations/locations.js';


Template.available_experiences.onCreated(function() {
  this.state = new ReactiveDict();

  getConfig.call({}, (err, config) => {
    if (err) {
      alert(err);
    } else {
      this.state.set('config', config);
    }
  });
  
});

Template.available_experiences.helpers({
  experiences() {
    return Experiences.find({});
  },
  locations() {
    return Locations.find({});
  }
});
