import './home.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Experiences } from '../../api/experiences/experiences.js';

import '../components/active_experience.js';

Template.home.onCreated(function() {
    this.state = new ReactiveDict();
    this.state.set('render', true);
    console.log("hello")
    var handle = this.autorun(() => {
      console.log("rerunning")
      Template.instance().state.set('render', true);
      this.subscribe('experiences.activeUser', Template.instance().state.get('render')); // TODO: make more specific
    });

});

Template.home.events({
  'click .refresh'(event, instance){
    ///Template.instance().state.set('render', false);
    var rend = Template.instance().state.get('render');
    Template.instance().state.set('render', false);
    location.reload();

  }
})

Template.home.helpers({
  activeExperiences() {
    console.log(Meteor.users.findOne(Meteor.userId()).profile.activeExperiences);
    return Meteor.users.findOne(Meteor.userId()).profile.activeExperiences;
  },
  noActiveExperiences() {
    let activeExperiences = Meteor.users.findOne(Meteor.userId()).profile.activeExperiences;
    return activeExperiences == null || activeExperiences.length == 0;
  },
  activeExperienceArgs(experienceId, render) {
    console.log("all the experiences returned by subscription", Experiences.find().fetch())
    var rend = Template.instance().state.get('render');

    return {
      experience: Experiences.findOne({_id: experienceId})
    };
  }
});
