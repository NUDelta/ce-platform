import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Locations } from './locations.js';
import { Experiences } from '../experiences/experiences.js';

export const findAffordances = new ValidatedMethod({
  name: 'locations.findAffordances',
  validate: new SimpleSchema ({
    lat: {
      type: String,
      label: 'latitude'
    },
    lng: {
      type: String,
      label: 'longitude'
    },
    uid: {
      type: String,
      label: 'uid'
    }
  }).validator(),
  run({ lat, lng, uid}) {
    let updated_affordances = [];
    let request = require('request');
    let url = 'https://affordanceaware.herokuapp.com/location_tags/' + lat + '/' + lng;
    request(url, Meteor.bindEnvironment(function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let res = JSON.parse(body);
            // Locations.update({uid: uid}, { $set: {
            //   affordances : res //updated_affordances
            // }}, (err, docs) => {
            //   if (err) { console.log(err); }
            //   else {     console.log("updating affordacnes for " + uid); }
            // });
          }
      }));
    //update_available();

    }
});
