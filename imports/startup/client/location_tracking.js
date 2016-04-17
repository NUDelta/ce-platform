import { Meteor } from 'meteor/meteor';

import { LocationManager } from '../../api/locations/client/location-manager-client.js';

//noinspection JSUnresolvedVariable
if (Meteor.isCordova) {
  Meteor.startup(() => {
    function success(location) {
      console.log(location);
      LocationManager.updateUserLocation({
        lat: location.latitude,
        lng: location.longitude
      });
      backgroundGeoLocation.finish();
    }

    function error(error) {
      console.log(error);
    }

    const options = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      debug: false,
      stopOnTerminate: false
    };

    backgroundGeoLocation.configure(success, error, options);
    backgroundGeoLocation.start();
  });
}
