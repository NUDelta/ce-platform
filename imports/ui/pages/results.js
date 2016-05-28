import './results.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/underscore';

import PhotoSwipe from 'photoswipe/dist/photoswipe.min';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default.min';

import { Experiences } from '../../api/experiences/experiences.js';
import { Images } from '../../api/images/images.js';
import { TextEntries } from '../../api/text-entries/text-entries.js';
import { Incidents } from '../../api/incidents/incidents.js';

Template.results.onCreated(function() {
  const incidentId = Router.current().params._id;

  this.subscribe('images', incidentId);
  this.subscribe('textEntries.byIncident', incidentId);
  const incHandle = this.subscribe('incidents.byId', incidentId);
  const expHandle = this.subscribe('experiences.byIncident', incidentId);

  this.state = new ReactiveDict();
  this.state.set('incidentId', incidentId);
  this.filter = new ReactiveVar({ incidentId: incidentId});

  this.autorun(() => {
    if (expHandle.ready() && incHandle.ready()) {
      const experience = Experiences.findOne();
      const incident = Incidents.findOne();
      this.state.set({
        incident: incident,
        experience: experience,
        modules: experience.modules
      });
    }
  });
});

Template.results.helpers({
  incident() {
    const instance = Template.instance();
    return instance.state.get('incident');
  },
  moduleChosen(module) {
    const instance = Template.instance();
    const modules = instance.state.get('modules');
    return _.contains(modules, module);
  },
  images() {
    // TODO: filter out incomplete uploads
    // TODO: sort images in order? might require a timestamp
    const instance = Template.instance();
    return Images.find(instance.filter.get());
  },
  noImages() {
    const instance = Template.instance();
    return Images.find(instance.filter.get()).count() == 0;
  },
  textEntries() {
    const instance = Template.instance();
    return TextEntries.find(instance.filter.get());
  },
  noTextEntries() {
    const instance = Template.instance();
    return TextEntries.find(instance.filter.get()).count() == 0;
  },
  experience() {
    const instance = Template.instance();
    return instance.state.get('experience');
  },
  isActive: function() {
    const instance = Template.instance();
    return Experiences.findOne() == instance.state.get('incidentId');
  }
});

Template.results.events({
  'change #filter-dropdown'(event, instance) {
    const newValue = $('#filter-dropdown option:selected').text();
    const newFilter = { incidentId: instance.state.get('incidentId') };
    if (newValue != instance.filter.get() && newValue != 'Anywhere') {
      newFilter.location = newValue;
    }
    instance.filter.set(newFilter);
  },
  'click img'(event, instance) {
    const galleryElement = document.getElementById('gallery');
    const items = Images.find(instance.filter.get()).fetch()
      .filter(image => image.metadata) // in case of incomplete uploads
      .map((image) => {
        return {
          src: image.url(),
          w: image.metadata.width,
          h: image.metadata.height,
          title: `${ image.caption } from ${ image.location }`
        };
      });
    const options = {
      index: parseInt(event.target.getAttribute('data-index'))
    };
    const gallery = new PhotoSwipe(galleryElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
  }
});
