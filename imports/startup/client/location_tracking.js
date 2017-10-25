import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

import { log, serverLog } from '../../api/logs.js';
import { LocationManager } from '../../api/locations/client/location-manager-client.js';

if (Meteor.isCordova) {
  Meteor.startup(() => {
    //Configure Plugin
    var bgGeo = window.BackgroundGeolocation;


    //This callback will be executed every time a geolocation is recorded in the background.
    var callbackFn = function(location) {
        var coords = location.false;
        var lat    = coords.latitude;
        var lng    = coords.longitude;
        console.log('- Location: ', JSON.stringify(location));

      if (Meteor.userId()) {
        HTTP.post(`${ Meteor.absoluteUrl() }api/geolocation`, {
          data: {
            location: location,
            userId: Meteor.userId()
          }
        }, (err, res) => {

        });
      }
    };

    var failureFn = function(errorCode) {
       console.warn('- BackgroundGeoLocation error: ', errorCode);
     }
     // Listen to location events & errors.
    bgGeo.on('location', callbackFn, failureFn);
    // Fired whenever state changes from moving->stationary or vice-versa.
    bgGeo.on('motionchange', function(isMoving) {
      console.log('- onMotionChange: ', isMoving);
    });
    // Fired whenever a geofence transition occurs.
    bgGeo.on('geofence', function(geofence) {
      console.log('- onGeofence: ', geofence.identifier, geofence.location);
    });
    // Fired whenever an HTTP response is received from your server.
    bgGeo.on('http', function(response) {
      console.log('http success: ', response.responseText);
    }, function(response) {
      console.log('http failure: ', response.status);
    });


    bgGeo.configure({
            // Geolocation config
            desiredAccuracy: 0,
            distanceFilter: 10,
            stationaryRadius: 25,
            // Activity Recognition config
            activityRecognitionInterval: 10000,
            stopTimeout: 5,
            // Application config
            debug: false,  // <-- Debug sounds & notifications.
            stopOnTerminate: false,
            startOnBoot: true,
            // HTTP / SQLite config
            //url: "http://your.server.com/locations",
            method: "POST",
            autoSync: true,
            maxDaysToPersist: 3,
            // headers: {  // <-- Optional HTTP headers
            //     "X-FOO": "bar"
            // },
            // params: {   // <-- Optional HTTP params
            //     "auth_token": "maybe_your_server_authenticates_via_token_YES?"
            // }
        }, function(state) {
            // This callback is executed when the plugin  is ready to use.
            console.log("BackgroundGeolocation ready: ", state);
            if (!state.enabled) {
                bgGeo.start();
            }
        });

    bgGeo.start();
  });
} else {
}

Meteor.startup(() => {
  trackerInterval = Meteor.setInterval(updateLocation, 10000);
});

var updateLocation = function() {
   LocationManager.trackUpdates(Tracker, () => {}, () => {});
};
