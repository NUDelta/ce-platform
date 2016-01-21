if (Experiences.find().count() === 0) {
  let beatriceId = Meteor.users.insert({
    emails: [{
      address: "jayz@hov.com",
      verified: true
    }],
    profile: {
      name: 'Beatrice Montgomery',
      experiences: []
    }
  });

  let eId1 = Experiences.insert({
    name: 'Sunset',
    author: beatriceId,
    desc: 'Upload a picture of the sunset where you are right now!',
    start_email_text: '<p>Get your camera ready because it\'s time to post a picture of the sunset. Follow this <a href="http://sunset.meteor.com/upload">link</a></p>',
    module: 'photo'
  });

  let eId2 = Experiences.insert({
    name: 'Pet Dog',
    author: beatriceId,
    desc: 'Upload a picture of you petting your dog right now!',
    start_email_text: '<p>Get your camera ready because it\'s time to post a picture of the yourself petting a dog. Follow this <a href="http://dogs-are-great.meteor.com">link</a></p>',
    module: 'photo'
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
  let sachaId = Meteor.users.insert({
    emails: [{
      address: "sgnachreiner@gmail.com",
      verified: true
    }],
    profile: {
      name: 'Sacha Greif',
      experiences: [eId1, eId2]
    }
  });
}
