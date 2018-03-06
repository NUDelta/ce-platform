import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

import { log, serverLog } from '../api/logs.js';
import {Experiences} from "../api/experiences/experiences";
import {createIncidentFromExperience, startRunningIncident} from "../api/incidents/methods";
////import { LocationManager } from '../../api/locations/client/location-manager-client.js';

///Example location object returned
// {
//     "timestamp":     [Date],     // <-- Javascript Date instance
//     "is_moving":     [Boolean],  // <-- The motion-state when location was recorded.
//     "uuid":          [String],   // <-- Universally unique identifier
//     "coords": {
//         "latitude":  [Float],
//         "longitude": [Float],
//         "accuracy":  [Float],
//         "speed":     [Float],
//         "heading":   [Float],
//         "altitude":  [Float]
//     },
//     "activity": {
//         "type": [still|on_foot|walking|running|in_vehicle|on_bicycle],
//         "confidence": [0-100%]
//     },
//     "battery": {
//         "level": [Float],
//         "is_charging": [Boolean]
//     }
// }



if (Meteor.isCordova) {

  let bgGeo = window.BackgroundGeolocation;

  export const toggleLocationTracking = function () {

    serverLog.call({message: "toggling location tracking " + Meteor.userId() + bgGeo});
    if(bgGeo){
      serverLog.call({message: "on cordova so toggle time" });
      bgGeo.stop();
      bgGeo.start();
    }

  };


  Meteor.startup(() => {
    //Configure Plugin
    bgGeo = window.BackgroundGeolocation;


    serverLog.call({ message: "setting up location tracking for: " + Meteor.userId()});
    serverLog.call({ message: "bgGeo: " + bgGeo});

    //This callback will be executed every time a geolocation is recorded in the background.
    var callbackFn = function (location) {
           serverLog.call({ message: "location package received update for: " + Meteor.userId() });

      if (Meteor.userId()) {
        HTTP.post(`${ Meteor.absoluteUrl() }api/geolocation`, {
          data: {
            location: location,
            userId: Meteor.userId()
          }
        }, (err, res) => {
          serverLog.call({ message: "Error with client/location-tracking sending location update to server" + Meteor.userId() });
          console.log("Error with client/location-tracking sending location update to server")
        });
      }
    };

    var failureFn = function (errorCode) {
      console.warn('- BackgroundGeoLocation error: ', errorCode);
    }

    // Listen to location events & errors.
    bgGeo.on('location', callbackFn, failureFn);
    // Fired whenever state changes from moving->stationary or vice-versa.
    bgGeo.on('motionchange', function (isMoving, location) {
      if (isMoving) {
        serverLog.call({ message: "device just started moving!" });
               bgGeo.start()
      } else {
        serverLog.call({ message: "device has stopped!" });

        console.log('Device has just STOPPED', location);
      }
    });

    // Fired whenever an HTTP response is received from your server.
    bgGeo.on('http', function (response) {
      console.log('http success: ', response.responseText);
      serverLog.call({ message: "http success!!!" });
      serverLog.call({ message: response });


    }, function (response) {
      console.log('http failure: ', response.status);
    });

    bgGeo.on('heartbeat', function (params) {
      serverLog.call({ message: "heartbeat being called!" });
      serverLog.call({ message: Meteor.userId() });

      // bgGeo.stop();
      // bgGeo.start();
    });

    bgGeo.configure({
      // Geolocation config
      desiredAccuracy: 0,
      distanceFilter: 10,
      stationaryRadius: 25,
      // Activity Recognition config
      activityRecognitionInterval: 1000,
      // Application config
      debug: false,  // <-- Debug sounds & notifications.
      stopOnTerminate: false,
      startOnBoot: true,
      // HTTP / SQLite config
      url: `${ Meteor.absoluteUrl() }api/geolocation/url`,
      method: "POST",
      autoSync: true,
      maxDaysToPersist: 1,
      logLevel: 5, //verbose
      preventSuspend: true,
      // heartbeatInterval: 300,
      pausesLocationUpdatesAutomatically: false,
      // headers: {  // <-- Optional HTTP headers
      //     "X-FOO": "bar"
      // },
      // params: {   // <-- Optional HTTP params
      //     "auth_token": "maybe_your_server_authenticates_via_token_YES?"
      // }
    }, function (state) {
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
