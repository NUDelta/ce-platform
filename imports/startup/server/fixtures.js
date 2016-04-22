import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Schema } from '../../api/schema.js';
import { Experiences } from '../../api/experiences/experiences.js';
import { Locations } from '../../api/locations/locations.js';
import { Images } from '../../api/images/images.js';
import { TextEntries } from '../../api/text-entries/text-entries.js';
import { ParticipationLocations } from '../../api/participation-locations/participation_locations.js';

import { log } from '../../api/logs.js';


import '../../api/users/users.js';

Meteor.startup(() => {

  // let count = 0;
  // // Remove locations that don't match users
  // Locations.find().forEach((location) => {
  //   const user = Meteor.users.findOne(location.uid);
  //   if (!user) {
  //     Locations.remove(location._id);
  //     count++;
  //   }
  // });
  //
  // log.debug(count);

  // if (Meteor.users.find().count() === 0) {
  //   const userData = [
  //     {
  //       email: 'jayz@hov.com',
  //       password: 'password',
  //       profile: {
  //         name: 'Beatrice Montgomery',
  //         qualifications: {
  //           hasDog: true,
  //           hasCamera: true
  //         }
  //       }
  //     },
  //     {
  //       email: 'sgnachreiner@yahoo.com',
  //       password: 'password',
  //       profile: {
  //         name: 'Tom Coleman',
  //         qualifications: {
  //           hasDog: true,
  //           hasCamera: true
  //         }
  //       }
  //     },
  //     {
  //       email: 'sgnachreiner@gmail.com',
  //       password: 'password',
  //       profile: {
  //         name: 'Sacha Greif',
  //         qualifications: {
  //           hasDog: true,
  //           hasCamera: true
  //         }
  //       }
  //     },
  //     {
  //       email: 'admin@admin.com',
  //       password: 'password'
  //     }
  //   ];
  //
  //   userData.forEach(user => Accounts.createUser(user));
  // }

  // if (ParticipationLocations.find().count() === 0) {
  //   const locationData = [
  //     {
  //       userId: 'aKr3vQs7yq3YuoBCL',
  //       lat: '42.05',
  //       lng: '-87.7'
  //     },
  //     {
  //       userId: 'aKr3vQs7yq3YuoBCL',
  //       lat: '42.060531',
  //       lng: '-87.693012'
  //     },
  //     {
  //       userId: 'aKr3vQs7yq3YuoBCL',
  //       lat: '41.93329',
  //       lng: '-87.67607'
  //     }
  //   ];
  //
  //   locationData.forEach(location => ParticipationLocations.insert(location));
  // }
});
