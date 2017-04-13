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
    let url = 'https://affordanceaware.herokuapp.com/conditions/' + lat + '/' + lng;
    request(url, Meteor.bindEnvironment(function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let res = JSON.parse(body);
            Locations.update({uid: uid}, { $set: {
              affordances : res.affordances //updated_affordances
            }}, (err, docs) => {
              if (err) { console.log(err); }
              else { }
            });
            update_available();
          }
      }));
    }
});

function update_available(){
  Experiences.find().forEach((experience) => {
    available = [];
    Locations.find().forEach((loc) => {
      if(experience.affordance){
        if (_.contains(loc.affordances, experience.affordance)) {
          available.push(loc.uid);
        }
      }else{
        available.push(loc.uid);
      }
    });
    Experiences.update(experience._id, { $set: {
      available_users : available
    }}, (err, docs) => {
      if (err) { console.log(err); }
      else {}
    });
  });

}
