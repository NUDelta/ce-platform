import './admin_experiences.html';

import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { getConfig, toggleDebugPush } from '../../api/config.js';
import { Experiences } from '../../api/experiences/experiences.js';

import '../components/experience_buttons.js';

Template.admin_experiences.onCreated(function() {
  this.state = new ReactiveDict();

  getConfig.call({}, (err, config) => {
    if (err) {
      alert(err);
    } else {
      this.state.set('config', config);
    }
  });
});

Template.admin_experiences.helpers({
  experiences() {
    return Experiences.find({});
  },
  experienceButtonArgs(experience) {
    return {
      experience: experience
    };
  },
  debugNotify() {
    const instance = Template.instance();
    const config = instance.state.get('config');
    if (config && config.DEBUG_PUSH) {
      return 'checked';
    } else {
      return '';
    }
  }
});

Template.admin_experiences.events({
  'change input[type=checkbox]'(event, instance) {
    toggleDebugPush.call({
      on: event.target.checked
    }, (err, checked) => {
      if (err) {
        alert(err);
      } else {
        let config = instance.state.get('config');
        config.DEBUG_PUSH = checked;
        instance.state.set('config', config);
      }
    });
  }
});

Template.admin_experiences.onRendered(function() {
  $('[data-toggle=toggle]').bootstrapToggle();
});
