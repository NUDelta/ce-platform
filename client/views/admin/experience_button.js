Template.experienceButton.events({
  'click .exp-btn': function(e) {
      e.preventDefault();

      console.log(this);

      console.log(this.start_email_text);

      Meteor.call('sendEmail',
            'shannonnachreiner2012@u.northwestern.edu',
            'Event is starting!',
            this.startEmailText, this._id);
      alert(`Sent ${this.name}`);
  }
});
