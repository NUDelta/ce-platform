import './nav.html';

Template.nav.onRendered(function() {
  // adjustActive();
});

Template.nav.helpers({
  isCurrentPage: function(pageName){
    return Router.current().route.getName() === pageName;
  }
});

adjustActive = function() {
  $('.nav-item').removeClass('active');
  let route = Router.current().route.getName();
  if (route === 'home') { $('#browse').addClass('active'); }
  if (route === 'creator') { $('#create').addClass('active'); }
}