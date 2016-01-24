before(() => {
  Experiences.remove({});
  Meteor.users.remove({});

  profiles.forEach((profile) => {
    Meteor.users.insert(profile);
  });

  experiences.forEach((experience) => {
    Experiences.insert(experience);
  })
});

let profiles = [{
  _id: 'beatrice',
  emails: [{
    address: 'jayz@hov.com',
    verified: true
  }],
  profile: {
    name: 'Beatrice Montgomery',
    experiences: [],
    subscriptions: [],
    qualifications: {
      hasDog: true,
      hasCamera: false
    }
  }
}, {
  _id: 'tom',
  emails: [{
    address: 'sgnachreiner@yahoo.com',
    verified: true
  }],
  profile: {
    name: 'Tom Coleman',
    experiences: ['sunset', 'dogsaregreat'],
    subscriptions: [],
    qualifications: {
      hasDog: true,
      hasCamera: true
    }
  }
}, {
  _id: 'sacha',
  emails: [{
    address: 'sgnachreiner@gmail.com',
    verified: true
  }],
  profile: {
    name: 'Sacha Greif',
    experiences: ['dogsaregreat'],
    subscriptions: [],
    qualifications: {
      hasDog: true,
      hasCamera: false
    }
  }
}];

let experiences = [{
  _id: 'sunset',
  name: 'Sunset',
  author: 'beatrice',
  description: 'Upload a picture of the sunset where you are right now!',
  startEmailText: '<p>Get your camera ready because it\'s time to post a picture of the sunset. Follow this <a href="http://sunset.meteor.com/upload">link</a></p>',
  modules: ['camera'],
  requirements: ['hasCamera']
}, {
  _id: 'dogsaregreat',
  name: 'Pet Dog',
  author: 'beatrice',
  description: 'Upload a picture of you petting your dog right now!',
  startEmailText: '<p>Get your camera ready because it\'s time to post a picture of the yourself petting a dog. Follow this <a href="http://dogs-are-great.meteor.com">link</a></p>',
  modules: ['camera'],
  requirements: ['hasDog']
}];
