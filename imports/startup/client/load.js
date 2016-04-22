import { GoogleMaps } from 'meteor/dburles:google-maps';

Meteor.startup(() => {
  GoogleMaps.load();
})
