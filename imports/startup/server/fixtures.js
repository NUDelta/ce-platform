import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Schema } from '../../api/schema.js';
import { Experiences } from '../../api/experiences/experiences.js';
import { Images } from '../../api/images/images.js';
import { TextEntries } from '../../api/text-entries/text-entries.js';
import '../../api/users/users.js';

Meteor.startup(() => {
  if (Meteor.users.find().count() === 0) {
    const userData = [
      {
        email: 'jayz@hov.com',
        password: 'password',
        profile: {
          name: 'Beatrice Montgomery',
          qualifications: {
            hasDog: true,
            hasCamera: true
          }
        }
      },
      {
        email: 'sgnachreiner@yahoo.com',
        password: 'password',
        profile: {
          name: 'Tom Coleman',
          qualifications: {
            hasDog: true,
            hasCamera: true
          }
        }
      },
      {
        email: 'sgnachreiner@gmail.com',
        password: 'password',
        profile: {
          name: 'Sacha Greif',
          qualifications: {
            hasDog: true,
            hasCamera: true
          }
        }
      },
      {
        email: 'admin@admin.com',
        password: 'password'
      }
    ];

    userData.forEach(user => Accounts.createUser(user));
  }

  if (Experiences.find().count() === 0) {
    let beatriceId = Meteor.users.findOne({ 'emails.0.address': 'jayz@hov.com' });
    const experienceData = [
      {
        name: 'Sunset',
        author: beatriceId,
        description: 'Upload a picture of the sunset where you are right now!',
        startText: 'Get your camera ready because it\'s time to post a picture of the sunset.',
        modules: ['camera'],
        requirements: ['hasCamera'],
        location: 'beaches'
      },
      {
        name: 'Pet Dog',
        author: beatriceId,
        description: 'Upload a picture of you petting your dog right now!',
        startText: 'Get your camera ready because it\'s time to post a picture of yourself petting a dog.',
        modules: ['camera'],
        requirements: ['hasCamera'],
        location: 'dog_parks'
      }
    ];

    experienceData.forEach(experience => Experiences.insert(experience));
    // subscribe a few people
    // add image and text info
  }
});
