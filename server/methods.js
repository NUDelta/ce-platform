Meteor.methods({
  sendEmail: function(from, subject, text, expId) {

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    let users = Meteor.users.find({
      'profile.subscriptions': expId
    }).forEach((user) => {
      let email = user.emails[0].address;
      // MAIL_URL="smtp://postmaster@sandbox31e59e1446774315b14003638c8f64ba.mailgun.org:fe2c40e92b55de91104c823fdec0967c@smtp.mailgun.org:587" meteor
      Email.send({
        to: email,
        from: from,
        subject: subject,
        html: text
      });
    });
  },
  updateUserExperiences: function(user) {
    // TODO: Figure out if it's possible to turn this into an efficent Mongo query
    let exps = Experiences.find().fetch().filter((doc) => {
      let match = true;
      doc.requirements.forEach((req) => {
        if (!user.profile.qualifications[req]) {
          match = false;
        }
      });
      return match;
    }).map((doc) => {
      return doc._id;
    });
    return exps;
  }
});
