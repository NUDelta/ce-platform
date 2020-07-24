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
    }else if(pageName === 'chat'){
<<<<<<< 88ad7ab60f45257d6eadbb9e7c09c428ee7ed5a2
      return Router.current().route.getName() === pageName;
=======
      return Router.current().route.getName() === chat;
>>>>>>> some chat layout stuff working thanks @gcan @sanfeng
    }
    else{
      return false;
    }
  }
});

const adjustActive = function () {
  $('.nav-item').removeClass('active');
  const route = Router.current().route.getName();
};
