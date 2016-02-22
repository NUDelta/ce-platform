var getBase64Data = function(doc, callback) {
  console.log('this');
  var buffer = new Buffer(0);
  // callback has the form function (err, res) {}
  var readStream = doc.createReadStream();
  readStream.on('data', function(chunk) {
    buffer = Buffer.concat([buffer, chunk]);
    console.log(buffer);
  });
  readStream.on('error', function(err) {
    callback(err, null);
  });
  readStream.on('end', function() {
    // done
    callback(null, buffer.toString('base64'));
  });
};
var getBase64DataSync = Meteor.wrapAsync(getBase64Data);

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
    })  ;

    return query._id.$in;
  },
  getEmails: function(users) {
    let emails = [];
    users.forEach((user) => {
      emails.push(Meteor.users.findOne(user).emails[0]);
    });
    return users;
  },
  updateUserExperiences: function(userId) {
    // TODO: Figure out if it's possible to turn this into an efficent Mongo query
    let user = Meteor.users.findOne(userId);
    //console.log(user);
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
    return Meteor.users.findOne(userId, { fields: { 'profile.subscriptions': 1 }});
  },
  insertPhoto: function(experienceId, picture, title='upload.png') {
    let newFile = new FS.File();
    newFile.attachData(new Buffer(picture, 'base64'), { type: 'image/png' }, function(error) {
      if (error) throw error;

      newFile.name(title);
      let image = Images.insert(newFile);
      image = Images.findOne(image._id);
      Images.update({ _id: image._id }, {$set : { experience: experienceId }});
    });
    return picture;
  },
  getPhotos: function(experienceId) {
    let pics = [];
    Images.find({experience: experienceId}).forEach((pic) => {
      pics.push(getBase64DataSync(pic));
    });
    console.log(pics);
    return pics
  }
 });
