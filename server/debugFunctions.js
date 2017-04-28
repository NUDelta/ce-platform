import { Experiences } from '../imports/api/experiences/experiences.js';
import { Incidents } from '../imports/api/incidents/incidents.js';
import { Locations } from '../imports/api/locations/locations.js';
import { Images } from '../imports/api/images/images.js';
import { TextEntries } from '../imports/api/text-entries/text-entries.js';
import { ParticipationLocations } from '../imports/api/participation-locations/participation_locations.js';
import { updateLocation } from '../imports/api/locations/methods.js';

export const cleardb = new ValidatedMethod({
  name: 'cleardb',
  validate: new SimpleSchema({
  }).validator(),
  run() {
    console.log("clearing the db");
    Meteor.users.remove({});
    Experiences.remove({});
    Locations.remove({});
    Images.remove({});
    TextEntries.remove({});
    ParticipationLocations.remove({});
    Incidents.remove({});
  }
});

export const updateLocationById = Meteor.methods({
  'updateLocationById' ({id, lat, long}){
    updateLocation.call({
      uid: Meteor.users.findOne({ '_id': id })._id,
      lat: lat,
      lng: long
    });
  }
});


export const createUsers = Meteor.methods({
  'addUsers' ({user}){
      console.log("adding users to the db");
      Accounts.createUser(user);
  }
});

export const addLocations = Meteor.methods({
  'addLocations' ({}){
      console.log("adding locatins to the users");
      updateLocation.call({
        uid: Accounts.findUserByEmail('a@gmail.com')._id,
        lat: 42.048513, //beach
        lng:  -87.672043
      });
      updateLocation.call({
        uid: Accounts.findUserByEmail('b@gmail.com')._id,
        lat: 42.054902,  //lakefill
        lng: -87.670197
      });
      updateLocation.call({
        uid: Accounts.findUserByEmail('c@gmail.com')._id,
        lat: 42.056975, //ford
        lng:  -87.676575
      });
      updateLocation.call({
        uid: Accounts.findUserByEmail('d@gmail.com')._id,
        lat: 42.059273, //garage
        lng: -87.673794
      });
      updateLocation.call({
        uid: Accounts.findUserByEmail('e@gmail.com')._id,
        lat: 42.044314,  //nevins
        lng: -87.682157
      });
      updateLocation.call({
        uid: Accounts.findUserByEmail('f@gmail.com')._id,
        lat: 42.046131,  //edzos
        lng: -87.681559
      });
      updateLocation.call({
        uid: Accounts.findUserByEmail('g@gmail.com')._id,
        lat: 42.044314,  //nevins
        lng: -87.682157
      });
      updateLocation.call({
        uid: Accounts.findUserByEmail('h@gmail.com')._id,
        lat: 42.045398,  //pubs 
        lng: -87.682431
      });
      updateLocation.call({
        uid: Accounts.findUserByEmail('i@gmail.com')._id,
        lat: 42.047621, //grocery, whole foods
        lng: -87.679488
      });
      updateLocation.call({
        uid: Accounts.findUserByEmail('j@gmail.com')._id,
        lat: 42.042617, //beach
        lng: -87.671474
      });
  }
});

export const addExperience = Meteor.methods({
  'addExperience' ({experience}){
      console.log("adding experience to the db");
      Experiences.insert(experience)
  }
});

// new ValidatedMethod({
//   name: 'addUsers',
//   validate({ user }){
//
//   },
//   run() {
//     console.log("adding users to the db");
//     console.log(this);
//     Accounts.createUser(user);
//
//   }
// });
