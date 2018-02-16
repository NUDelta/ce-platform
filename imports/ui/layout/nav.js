import './nav.html';

import { Router } from 'meteor/iron:router';

Template.nav.onRendered(function () {
  // adjustActive();
});

Template.nav.helpers({
  isCurrentPage(pageName) {
    return Router.current().route.getName() === pageName;
  }
});

const adjustActive = function () {
  $('.nav-item').removeClass('active');
  const route = Router.current().route.getName();
};
