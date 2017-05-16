import './api_custom_results.html';

import '../components/displayImage.html';

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
import { Submissions } from '../../api/submissions/submissions.js';

import { Incidents } from '../../api/incidents/incidents.js';

Template.api_custom_results.helpers({
  data2pass(){
    const instance = Template.instance();
    console.log(instance.state.get("incidentId"));
    var imgs =  Images.find({incidentId: instance.state.get("incidentId")}).fetch();
    var text =  TextEntries.find({incidentId: instance.state.get("incidentId")}).fetch();
    var subs = Submissions.find({incidentId: instance.state.get("incidentId")}).fetch();
    console.log(subs)
    return {"images": imgs, "text": text, "submissions": subs}
  },
  template_name() {
    const instance = Template.instance();
    console.log("temp name:", instance.state.get('experience').resultsTemplate);
    return instance.state.get('experience').resultsTemplate;
  },
});
Template.registerHelper( 'getImage', (id) => {
  var img =  Images.findOne({_id: id});
  return {img: Images.findOne({_id: id})};
});
Template.registerHelper( 'getText', (id) => {
  var text = TextEntries.findOne({_id: id});
  return text.text;
});

Template .registerHelper('var',function(name, value){
  this[name] = value;
});


Template.api_custom_results.onCreated(function() {
  const incidentId = Router.current().params._id;

  this.subscribe('images', incidentId);
  this.subscribe('submissions', incidentId);
  this.subscribe('textEntries.byIncident', incidentId);
  const incHandle = this.subscribe('incidents.byId', incidentId);
  const expHandle = this.subscribe('experiences.byIncident', incidentId);

  this.state = new ReactiveDict();
  this.state.set('incidentId', incidentId);
  this.filter = new ReactiveVar({ incidentId: incidentId});

  this.autorun(() => {
    if (expHandle.ready() && incHandle.ready()) {
      const experience = Experiences.findOne();
      if (experience.route == 'button_game') {
        Router.go(`/results/button_game/${incidentId}`);
      }
      if (experience.route == 'custom') {
        Router.go(`/results/custom/${incidentId}`);
      }
      const incident = Incidents.findOne();
      this.state.set({
        incident: incident,
        experience: experience,
        modules: experience.modules
      });
    }
  });
});
