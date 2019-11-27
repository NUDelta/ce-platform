import './active_experience.html';

import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Schema } from '../../api/schema.js';
// import {Meteor} from "meteor/meteor";

Template.activeExperience.onCreated(function () {
  this.autorun(() => {
    this.subscribe('experiences.activeUser');
  })
});

Template.activeExperience.events({
  'click .card-action': function() {
    if (Meteor.userId()) {
      let dic = {
        uid: Meteor.userId(),
        timestamp: Date.now(),
        route: "home_to_customparticipate",
        params: {
          iid: this.iid,
          eid: this.experience._id,
          needName: this.needName
        }
      };
      Meteor.call('insertLog', dic);
    }
  }
});
