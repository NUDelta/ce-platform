Template.experienceButton.events({
  'click .exp-btn': function(e) {
      e.preventDefault();


      Meteor.call('sendEmail',
            'shannonnachreiner2012@u.northwestern.edu',
            'Event is starting!',
            this.start_email_text, this._id);
      alert(`Sent ${this.name}`);
  }
});
