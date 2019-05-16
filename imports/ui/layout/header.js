import './header.html';

import { Template } from 'meteor/templating';

Template.header.onRendered(function () {

});

Template.header.helpers({
  connectionStatus() {
    return Meteor.status().status;
  }
});
