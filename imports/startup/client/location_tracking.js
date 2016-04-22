import { Meteor } from 'meteor/meteor';

import { log, serverLog } from '../../api/logs.js';
import { LocationManager } from '../../api/locations/client/location-manager-client.js';

if (Meteor.isCordova) {
  Meteor.startup(() => {

    function success(location) {
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
} else {
  Meteor.startup(() => {
    LocationManager.trackUpdates(Tracker, () => {}, () => {});
  });
}
