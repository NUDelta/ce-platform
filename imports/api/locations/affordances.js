import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Locations } from './locations.js';


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
    console.log("hello, its me!!");
    let updated_affordances = [];
    let request = require('request');
    let url = 'https://affordanceaware.herokuapp.com/conditions/' + lat + '/' + lng;
    request(url, Meteor.bindEnvironment(function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let res = JSON.parse(body);
            let userIds = [uid];
            console.log(res.affordances);

            Locations.update(uid, { $set: {
              lat: lat,
              lng: lng,
              affordances : res.affordances //updated_affordances
            }});
          }
      }));
    }
});
