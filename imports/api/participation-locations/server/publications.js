import { Meteor } from 'meteor/meteor';
import { ParticipationLocations } from '../participation_locations.js';

Meteor.publish('participation_locations', function() {
  return ParticipationLocations.find();
});

if (ParticipationLocations.find().count() === 0) {
  ParticipationLocations.insert({
    userId: 'aKr3vQs7yq3YuoBCL',
    lat: '42.05',
    lng: '-87.7'
  });
  ParticipationLocations.insert({
    userId: 'aKr3vQs7yq3YuoBCL',
    lat: '42.060531',
    lng: '-87.693012'
  });
  ParticipationLocations.insert({
    userId: 'aKr3vQs7yq3YuoBCL',
    lat: '41.93329',
    lng: '-87.67607'
  });
}
