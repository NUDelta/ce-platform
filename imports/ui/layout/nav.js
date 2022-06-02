import './nav.html';

import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.nav.onRendered(function () {
  // adjustActive();
});

Template.nav.helpers({
  isCurrentPage(pageName) {
    if(pageName === 'home'){
      return ['home', 'api.custom'].includes(FlowRouter.getRouteName());
    }else if (pageName === 'profile'){
      return ['profile', 'api.customresults'].includes(FlowRouter.getRouteName());
    }else if(pageName === 'affordances'){
      return FlowRouter.getRouteName() === pageName;
    }else if(pageName === 'chat'){
      return FlowRouter.getRouteName() === pageName;
    }
    else{
      return false;
    }
  }
});

const adjustActive = function () {
  $('.nav-item').removeClass('active');
  const route = FlowRouter.getRouteName();
};
