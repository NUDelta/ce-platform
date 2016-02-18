Meteor.methods({
  sendEmail: function(from, subject, text, expId) {

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    let query = {},
        experience = Experiences.findOne(expId);

    query['profile.subscriptions'] = expId;
    if (experience.location && experience.location !== 'anywhere') {
      try {
        query._id = { $in: Cerebro.liveQuery(experience.location) };
      } catch (e) {
        // TODO: yelp needs a predefined type of location from its list https://www.yelp.com/developers/documentation/v2/all_category_list
      }
    }

    console.log(query);

    Meteor.users.find(query).forEach((user) => {
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
    return Experiences.find(params1, params2).fetch();
  },
  getUsers: function(params1 = {}, params2 = {}) {
    return Meteor.users.find(params1, params2).fetch();
  },
  getSubscriptions: function(userId) {
    console.log(userId);
    return Meteor.users.findOne(userId, { fields: { 'profile.subscriptions': 1 }});
  },
  insertPhoto: function(experienceId, picture) {
    //console.log(experienceId)
    //console.log(picture)

    function _base64ToArrayBuffer(base64) {
      var binary_string = new Buffer(base64).toString('base64');
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes.buffer;
    }

    var newFile = new FS.File();
    newFile.attachData(new Buffer(picture), {type: 'image/png'}, function(error){
      if(error) throw error;
      newFile.name('myGraphic.png');
      var image = Images.insert(newFile);

      image = Images.findOne(image._id);
      Images.update({_id: image._id}, {"$set" : {experience: experienceId}});
    });

    return picture
  }
});
