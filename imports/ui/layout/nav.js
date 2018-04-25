import './nav.html';

import { Router } from 'meteor/iron:router';

Template.nav.onRendered(function () {
  // adjustActive();
});

Template.nav.helpers({
  isCurrentPage(pageName) {
    if(pageName === 'home'){
      return ['home', 'api.custom'].includes(Router.current().route.getName());
    }else if (pageName === 'profile'){
      return ['profile', 'api.customresults'].includes(Router.current().route.getName());
    }else if(pageName === 'affordances'){
      return Router.current().route.getName() === pageName;
    }else{
      return false;
    }
  }
});

const adjustActive = function () {
  $('.nav-item').removeClass('active');
  const route = Router.current().route.getName();
};
