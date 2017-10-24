import './api_custom_results.html';
import './storyPageResults.html'
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
    var imgs =  Images.find({incidentId: instance.state.get("incidentId")}).fetch();
    var text =  TextEntries.find({incidentId: instance.state.get("incidentId")}).fetch();
    var subs = Submissions.find({incidentId: instance.state.get("incidentId")}).fetch();
    console.log(subs)
    console.log(subs[0].contributionTemplate)

    return {"images": imgs, "text": text, "submissions": subs}
  },
  template_name() {
    const instance = Template.instance();
    return instance.state.get('experience').resultsTemplate;
  },
});

//these helpers shouldn't be db calls

Template.registerHelper( 'getImage', (id) => {
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


///storybook
var slideIndex = 1;

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  slides[slideIndex-1].style.display = "block";
}

Template.storyPageResults.onCreated(function() {
  this.autorun(() => {
    window.onload = function () {
      showSlides(slideIndex);
    }
  });
});

Template.storyPageResults.helpers({
  getNextSentenceId(photoIndex){
    const instance = Template.instance()
    var submission = instance.data.submissions[photoIndex-1];
    return submission.content.nextSentence

  },
  isFirst(index){
    return index > 0;
  },
  notLast(index){
    const instance = Template.instance()
    var length = instance.data.submissions.length
    return index < length-1;
  }
});

Template.storyPageResults.events({
  'click .prev'(event, instance) {
    event.preventDefault();
    plusSlides(-1)
  },
  'click .next'(event, instance) {
    event.preventDefault();
    plusSlides(1)
  }
});

Template.star.helpers({
  getId(){
      const instance = Template.instance()
      var starId = instance.data.starId;
      return starId;
  }
});

function getColor(submissions, color){
  var filtered = submissions.filter(function(s){
    return s.contributionTemplate == color;
  });
  var mapped = filtered.map(function(s){
    var content = s.content;
    return Object.values(content)[0]
  });
  return mapped;
}

Template.star.onCreated(function(){
  console.log(this)
  console.log(Template.instance())
})

Template.americanFlagResults.helpers({
  getStarBuildInfo(index){
    var submissions = Template.instance().data.submissions;
    var redImages = getColor(submissions, "red");
    if(redImages.length > index){
      return {starId: index, imageId: redImages[index], hasImage: true, color: "red"}
    }
    return {starId: index, imageId: null, hasImage: false, color: "red"};
  },
  getColorInfo(index, color){
      var submissions = Template.instance().data.submissions;
      var colorImages = getColor(submissions, color);
      if(colorImages.length > index){
        return {colorId: index, imageId: colorImages[index], hasImage: true, color: color}
      }
      return {colorId: index, imageId: null, hasImage: false, color: color};
  },
  noImage(color){
    var submissions = Template.instance().data.submissions;
    var colorImages = getColor(submissions, color);
    if(colorImages.length > 0){
      return false;
    }
    return true;
  }
});
