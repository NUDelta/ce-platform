import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { log } from '../logs.js';
import { Locations } from './locations.js';
import { Schema } from '../schema.js';

//updates location and affordances
//called by location-tracking package through server/router
export const updateUserLocationAndAffordances = new ValidatedMethod({
  name: 'locations.updateUserLocationAndAffordances',
  validate: Schema.Locations.validator(),
  run({ uid, lat, lng }) {

    console.log("Info passed is", lat, lng)
    let request = require('request');
    let url = 'http://0.0.0.0:5000/location_keyvalues/' + lat.toString() + '/' + lng.toString();
    // let url = 'https://affordanceaware.herokuapp.com/location_tags/' + lat.toString() + '/' + lng.toString();
    request(url, Meteor.bindEnvironment(function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let res = JSON.parse(body);
        if (res !== Object(res)) {
          log.warning("Locations/methods expected type Object but did not receive an Object, instead we are returning an empty Object")
          return updateLocation(uid, lat, lng, {});
        }
        return updateLocation(uid, lat, lng, res);
      }else{
        log.warning("Locations/methods, can't retrieve affordances, instead we are returning an empty Object")
        updateLocation(uid, lat, lng, {});
      }
    }));
  }
});

//updates the location for a user
function updateLocation( uid, lat, lng, givenAffordances) {
  const entry = Locations.findOne({ uid: uid });
  console.log("our affs are", givenAffordances)
  if (entry) {
    Locations.update(entry._id, { $set: {
      lat: lat,
      lng: lng,
      affordances: givenAffordances
    }}, (err, docs) => {
      if (err) {
        log.error("Locations/methods, can't update a location", err);
      }
    });
  }else {
    Locations.insert({
      uid: uid,
      lat: lat,
      lng: lng,
      affordances: givenAffordances,
      lastNotification: null,
    }, (err, docs) => {
      if (err) {
        log.error("Locations/methods, can't add a new location", err);
      }
    });
  }
}
