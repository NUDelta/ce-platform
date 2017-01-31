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
    console.log("hello, its me!!");
    let updated_affordances = [];
    let request = require('request');
    let url = 'https://affordanceaware.herokuapp.com/conditions/' + lat + '/' + lng;
    request(url, Meteor.bindEnvironment(function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let res = JSON.parse(body);
            let userIds = [uid];
            console.log(res.affordances);

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
    Locations.find().forEach((user) => {
      if(experience.affordance){
        if (_.contains(user.affordances, experience.affordance)) {
          console.log("found a valid user");
          available.push(user);
        }
      }
    });
    Experiences.update(experience._id, { $set: {
      available_users : available
    }}, (err, docs) => {
      if (err) { console.log(err); }
      else { console.log(docs)}
    });
  });

}
