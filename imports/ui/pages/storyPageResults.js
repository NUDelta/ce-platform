import './storyPageResults.html';
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

import './api_custom_results.js';

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

Template.storyPageResults1.onCreated(function() {
  this.autorun(() => {
    console.log("loaded")
    window.onload = function () {
      showSlides(slideIndex);
    }
  });
});
Template.storyPageResults1.helpers({
  getNextSentenceId(photoIndex){
    const instance = Template.instance()

    var submission = instance.data.submissions[photoIndex-1];
    console.log(submission)
    console.log(submission.content.nextSentence)
    return submission.content.nextSentence

  },
  shouldLoadText(index){
    return index > 0;
  }
});

Template.storyPageResults1.events({
  'click .prev'(event, instance) {
    event.preventDefault();
    console.log("LEFTT");
    plusSlides(-1)
  },
  'click .next'(event, instance) {
    event.preventDefault();
    console.log("RIGHT");
    plusSlides(1)
  }
});
