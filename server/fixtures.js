if (Experiences.find().count() === 0 && Meteor.users.find().count() === 0) {
  let beatriceId = Meteor.users.insert({
    emails: [{
      address: "jayz@hov.com",
      verified: true
    }],
    profile: {
      name: 'Beatrice Montgomery',
      experiences: [],
      subscriptions: [],
      qualifications: {
        hasDog: true,
        hasCamera: true
      }
    }
  });
  let eId1 = Experiences.insert({
    name: 'Sunset',
    author: beatriceId,
    description: 'Upload a picture of the sunset where you are right now!',
    startText: '<p>Get your camera ready because it\'s time to post a picture of the sunset. Follow this <a href="http://sunset.meteor.com/upload">link</a></p>',
    modules: ['camera'],
    requirements: ['hasCamera'],
    location: 'beach'
  });

  let eId2 = Experiences.insert({
    name: 'Pet Dog',
    author: beatriceId,
    description: 'Upload a picture of you petting your dog right now!',
    startText: '<p>Get your camera ready because it\'s time to post a picture of the yourself petting a dog. Follow this <a href="http://dogs-are-great.meteor.com">link</a></p>',
    modules: ['camera'],
    requirements: ['hasDog', 'hasCamera'],
    location: 'dog park'
  });

  let tomId = Meteor.users.insert({
    emails: [{
      address: "sgnachreiner@yahoo.com",
      verified: true
    }],
    profile: {
      name: 'Tom Coleman',
      experiences: [],
      subscriptions: [eId1, eId2],
      qualifications: {
        hasDog: true,
        hasCamera: true
      }
    }
  });
  let sachaId = Meteor.users.insert({
    emails: [{
      address: "sgnachreiner@gmail.com",
      verified: true
    }],
    profile: {
      name: 'Sacha Greif',
      subscriptions: [eId1, eId2],
      experiences: [],
      qualifications: {
        hasDog: true,
        hasCamera: true
      }
    }
  });

  var userObject = {
    email: 'admin@a.com',
    password: 'password'
  };
  Accounts.createUser(userObject);
}
