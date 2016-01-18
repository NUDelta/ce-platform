Meteor.methods({
  sendEmail: function (from, subject, text, expId) {

      // Let other method calls from the same client start running,
      // without waiting for the email sending to complete.
      this.unblock();

      var users = Meteor.users.find({'profile.experiences': expId}).fetch();

      for (var i = 0; i < users.length; i++) {
        var email = users[i].emails[0].address;
        // MAIL_URL="smtp://postmaster@sandbox31e59e1446774315b14003638c8f64ba.mailgun.org:fe2c40e92b55de91104c823fdec0967c@smtp.mailgun.org:587" meteor

        Email.send({
          to: email,
          from: from,
          subject: subject,
          html: text
        });
      }
  }
});
