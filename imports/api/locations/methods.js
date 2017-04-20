import { Meteor } from 'meteor/meteor';

import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Locations } from './locations.js';
import { Schema } from '../schema.js';

import { findAffordances } from './affordances.js'


export const updateLocation = new ValidatedMethod({
  name: 'locations.updateUser',
  validate: Schema.Locations.validator(),
  run({ uid, lat, lng }) {
    console.log("UPDATING THE LOCATIONS")
    const entry = Locations.findOne({ uid: uid });
    if (entry) {

      Locations.update(entry._id, { $set: {
        lat: lat,
        lng: lng
      }});

      Meteor.call('locations.findAffordances', {
        lat: lat.toString(),
        lng: lng.toString(),
        uid: uid
      }, (err, res) => {
        if(err){ console.log(err);}else{
        }
      });


    } else {
      Locations.insert({ uid: uid, lat: lat, lng: lng });
    }
  }
});
