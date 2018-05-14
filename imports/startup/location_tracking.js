import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

import { log, serverLog } from '../api/logs.js';
import { Experiences } from "../api/experiences/experiences";
import { createIncidentFromExperience, startRunningIncident } from "../api/incidents/methods";

/*
  Example location object returned
  {
      "timestamp":     [Date],     // <-- Javascript Date instance
      "is_moving":     [Boolean],  // <-- The motion-state when location was recorded.
      "uuid":          [String],   // <-- Universally unique identifier
      "coords": {
          "latitude":  [Float],
          "longitude": [Float],
          "accuracy":  [Float],
          "speed":     [Float],
          "heading":   [Float],
          "altitude":  [Float]
      },
      "activity": {
          "type": [still|on_foot|walking|running|in_vehicle|on_bicycle],
          "confidence": [0-100%]
      },
      "battery": {
          "level": [Float],
          "is_charging": [Boolean]
      }
  }
 */

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
    // initialize BackgroundGeolocation plugin
    bgGeo = window.BackgroundGeolocation;
    serverLog.call({ message: "setting up location tracking for: " + Meteor.userId()});
    serverLog.call({ message: "bgGeo: " + bgGeo});

    // configure and start background geolocation when ready
    bgGeo.ready({
      reset: true, // always supply this configuration when application restarts

      // Geolocation config
      desiredAccuracy: 0, // highest accuracy, highest power consumption
      distanceFilter: 10, // meters device must move before location update is generated
      stationaryRadius: 25, // distance user must move in order to trigger location tracking
      disableElasticity: true, // disable dynamic filtering and return every distanceFilter amount

      // Activity Recognition config
      activityRecognitionInterval: 1000, // interval to check for changes in activity (in seconds)

      // Application config
      stopOnTerminate: false, // continue tracking user even if they terminate the application
      startOnBoot: true, // restart location tracking after device reboots
      preventSuspend: true, // prevent iOS from suspending application while stationary
      heartbeatInterval: 60, // firing heartbeat events (needed for preventSuspend)
      pausesLocationUpdatesAutomatically: true, // used for conserving battery, when able
      debug: false,  // debug sounds & notifications.
      logLevel: 5, // verbose logging WARNING: TURN OFF FOR PRODUCTION

      // HTTP / SQLite config
      url: `${ Meteor.absoluteUrl() }api/geolocation/url`, // submit location updates to
      method: "POST", // submission method
      autoSync: true, // automatically sync database
      maxDaysToPersist: 1 // days for SQLite database to persist
    }, function (state) {
      // This callback is executed when the plugin  is ready to use.
      console.log("BackgroundGeolocation ready: ", state);

      // begin tracking
      if (!state.enabled) {
        bgGeo.start(function() {
          console.log('BackgroundGeolocation has started tracking.')
        });
      }
    });

    // setup callbacks for location updates
    const locationSuccessCallback = function (location) {
      serverLog.call({ message: "location package received update for: " + Meteor.userId() });

      // POST data to backend API
      if (Meteor.userId()) {
        HTTP.post(`${ Meteor.absoluteUrl() }api/geolocation`, {
          data: {
            location: location,
            userId: Meteor.userId()
          }
        }, (err, res) => {
          // log only if error happens
          if (err) {
            let errorMessage = `Could not send location update to server for ${ Meteor.userId() }: ${ JSON.stringify(err) }`;
            serverLog.call({  message: errorMessage  });
            console.log(errorMessage);
          }
        });
      }
    };

    const locationFailureCallback = function (errorCode) {
      console.warn('- BackgroundGeoLocation error: ', errorCode);
    };

    // listen to location updates
    bgGeo.on('location', locationSuccessCallback, locationFailureCallback);

    // listen to motion change (moving -> stationary, stationary -> moving) events
    bgGeo.on('motionchange', function (isMoving, location) {
      if (isMoving) {
        serverLog.call({ message: `Device is MOVING at location ${ location }.` });
        // bgGeo.start(); // shouldnt have to call this
      } else {
        serverLog.call({ message: `Device is STOPPED at location ${ location }.` });
        console.log('Device is STOPPED', location);
      }
    });

    // listen for changes in power saving mode
    bgGeo.on('powersavechange', function (isPowerSaveMode) {
      if (isPowerSaveMode) {
        serverLog.call({ message: `Power saving mode for ${ Meteor.userId() } ENABLED.` });
      } else {
        serverLog.call({ message: `Power saving mode for ${ Meteor.userId() } DISABLED.` });
      }

      console.log(`Power saving mode enabled for ${ Meteor.userId() }? ${ isPowerSaveMode }`);
    });

    // listen for HTTP requests
    bgGeo.on('http', function (success) {
      serverLog.call({ message: `http SUCCESS: ${ JSON.stringify(success) }`});
    },
      function (error) {
        serverLog.call({ message: `http ERROR: ${ JSON.stringify(error) }`});
    });

    // listen for heartbeat events
    bgGeo.on('heartbeat', function (params) {
      serverLog.call({
        message: `heartbeat successfully called called for user ${ Meteor.userId() } with params ${ JSON.stringify(params) }.`
      });
    });

    // listen for connectivity change
    bgGeo.on('connectivitychange', function(event) {
      serverLog.call({
        message: `network connectivity change detected for user ${ Meteor.userId() }: ${ JSON.stringify(event) }.`
      });
    });
  });
} else {
}
