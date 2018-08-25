import './debug.js'

import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { Experiences, Incidents } from '../../api/OCEManager/OCEs/experiences.js';
import { Locations } from '../../api/UserMonitor/locations/locations.js';

Template.debug.onCreated(function () {

});

Template.debug.helpers({


});


Template.debug.events({

});

// Template.debug.events({
//   'click #clear_db'(event, instance) {
//     console.log("you clicked clear db");
//     Meteor.call("cleardb", {}, (err, res) => {
//       if (err) {
//         console.log(err);
//       }
//     });
//   },
//   'click #clear_participation'(event, instance) {
//     Meteor.call("clearParticipation", {}, (err, res) => {
//       if (err) {
//         console.log(err);
//       }
//     });
//   },
//   'click #add_users'(event, instance) {
//     // console.log("you clicked add users");
//     users.forEach(user => Meteor.call("addUsers", { user: user }));
//     // OCEs.forEach(experience => Meteor.call("addExperience", {experience: experience}));
//
//
//     //how to create user with out logging in?
//   },
//   'click #add_locations'(event, instance) {
//     Meteor.call('addLocations', {});
//   },
//   'submit form'(event, instance) {
//     event.preventDefault();
//     console.log("updating a location");
//     Meteor.call('locations.updateUserLocationAndAffordances', {
//       uid: event.target.id.value,
//       lat: parseFloat(event.target.lat.value),
//       lng: parseFloat(event.target.long.value)
//     });
//   }
// });