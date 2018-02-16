import { GoogleMaps } from 'meteor/dburles:google-maps';

Meteor.startup(() => {
  GoogleMaps.load({ key: 'AIzaSyA4LczQjd7IBHE0VV-WDRo0qkkGPQJBn6I' });
});
