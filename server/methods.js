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
  updateUserExperiences: function(userId) {
    // TODO: Figure out if it's possible to turn this into an efficent Mongo query
    let user = Meteor.users.findOne(userId);
    console.log(user)
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
    Meteor.users.update(userId, {$set: {'profile.experiences': exps}});
    let subs = user.profile.subscriptions;
    subs = subs.filter((sub) => {
      return _.contains(exps, sub);
    });
    Meteor.users.update(userId, {$set: {'profile.subscriptions': subs}});
  },
  updateUserProfile: function(userId) {
    return "we got here"
  },
  getExperiences: function(params1 = {}, params2 = {}) {
    console.log(params1);
    return Experiences.find(params1, params2).fetch();
  },
  getUsers: function(params1 = {}, params2 = {}) {
    return Meteor.users.find(params1, params2).fetch();
  }
});
