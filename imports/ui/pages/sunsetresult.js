import './sunsetresult.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/underscore';

import { Experiences } from '../../api/experiences/experiences.js';
import { Images } from '../../api/images/images.js';
import { TextEntries } from '../../api/text-entries/text-entries.js';
import { Incidents } from '../../api/incidents/incidents.js';
import '../globalHelpers.js';

isImageFullSize = false;

Router.route('/results/sunset/:_id', {
  template: 'sunsetresult',
});

var play = function(){
        var imgLen = document.getElementById('imgGallary');
        var images = imgLen.getElementsByTagName('img');
        var counter = 1;

        if(counter <= images.length){
            setInterval(function(){
                images[0].src = images[counter].src;
                counter++;

                if(counter === images.length){
                    counter = 1;
                }
            }, 600);
        }
};

Template.sunsetresult.onCreated(function() {
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
      play();
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
