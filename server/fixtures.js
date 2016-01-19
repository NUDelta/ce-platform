if (Experiences.find().count() === 0) {
  let eId1 = Experiences.insert({
    name: 'Sunset',
    text: '<p>Get your camera ready because it\'s time to post a picture of the sunset. Follow this <a href="http://www.facebook.com">link</a></p>'
  });

  let eId2 = Experiences.insert({
    name: 'Pet Dog',
    text: '<p>Get your camera ready because it\'s time to post a picture of the yourself petting a dog. Follow this <a href="http://www.google.com">link</a></p>'
  });

  let tomId = Meteor.users.insert({
    emails: [{
      address: "sgnachreiner@yahoo.com",
      verified: true
    }],
    profile: {
      name: 'Tom Coleman',
      experiences: [eId1, eId2]
    }
  });
  let tom = Meteor.users.findOne(tomId);
  let sachaId = Meteor.users.insert({
    emails: [{
      address: "sgnachreiner@gmail.com",
      verified: true
    }],
    profile: {
      name: 'Sacha Greif',
      experiences: [eId1]
    }
  });
  let sacha = Meteor.users.findOne(sachaId);
}
