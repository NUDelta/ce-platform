import './header.html';

import { Template } from 'meteor/templating';

Template.header.onRendered(function () {

});

Template.header.events({
  'click .navbar-brand'() {
    let navbar = document.querySelector(".nav-footer");
    navbar.style.display = "block";
  },
})

Template.header.helpers({
  connectionStatus() {
    return Meteor.status().status;
  }
});
