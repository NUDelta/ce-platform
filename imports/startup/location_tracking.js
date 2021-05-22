import { Meteor } from 'meteor/meteor';
import { serverLog } from '../api/logs.js';
import { Tracker } from 'meteor/tracker';

if (Meteor.isCordova) {
  export const toggleLocationTracking = () => {
    serverLog.call({message: "toggling location tracking " + Meteor.userId() + bgGeo});

    let bgGeo = window.BackgroundGeolocation;
    if(bgGeo && Meteor.isCordova) {
      serverLog.call({message: "on cordova so toggle time" });
      bgGeo.stop();
      bgGeo.start();
    }
  };

  Meteor.startup(() => {
    // initialize BackgroundGeolocation plugin
    let bgGeo = window.BackgroundGeolocation;

    // configure and start background geolocation when ready
    bgGeo.ready({
      reset: true, // always supply this configuration when application restarts

      // Geolocation config
      desiredAccuracy: 0, // highest accuracy, highest power consumption
      distanceFilter: 10, // meters device must move before location update is generated
      stationaryRadius: 25, // distance user must move in order to trigger location tracking
      disableElasticity: false, // disable dynamic filtering and return every distanceFilter amount

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
      url: `${ Meteor.absoluteUrl({secure: true}) }api/geolocation`, // submit location updates to backend route
      method: "POST", // submission method
      params: {
        userId: Meteor.userId()
      },
      autoSync: true, // upload each location update as it is received
      maxDaysToPersist: 1 // days for SQLite database to persist
    }, function (state) {
      // This callback is executed when the plugin is ready to use.
      serverLog.call({ message: "location tracking setup for: " + Meteor.userId()});
      serverLog.call({ message: `state: ${ JSON.stringify(state) }, bgGeo: ${ JSON.stringify(bgGeo) }` });

      // begin tracking
      if (!state.enabled) {
        bgGeo.start(function() {
          serverLog.call({ message: "Background location tracking started for " + Meteor.userId()});
        });
      }
    });

    // setup callbacks for location updates
    const locationSuccessCallback = function () {
      serverLog.call({ message: "location package received update for: " + Meteor.userId() });
    };

    const locationFailureCallback = function (errorCode) {
      console.warn('- BackgroundGeoLocation error: ', errorCode);
    };

    // listen to location updates and automatically save to DB
    /*
    Example location object returned
    {
       "location": {
          "coords": {
             "speed": [Float],
             "longitude": [Float],
             "floor": [Float],
             "latitude": [Float],
             "accuracy": [Float],
             "altitude_accuracy": [Float],
             "altitude": [Float],
             "heading": [Float]
          },
          "extras": {},
          "is_moving": [Boolean],
          "odometer": [Float],
          "uuid": [String],
          "activity":{
              "type": [still|on_foot|walking|running|in_vehicle|on_bicycle],
              "confidence": [0-100%]
          },
          "battery": {
              "level": [Float],
              "is_charging": [Boolean]
          }
          "timestamp": [String]
       },
       "userId": [String]
    }
    */
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
    bgGeo.on('http', function () {
      serverLog.call({ message: `http SUCCESS`});
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

    Tracker.autorun(() => {
      bgGeo.reset({
        reset: true, // always supply this configuration when application restarts

        // Geolocation config
        desiredAccuracy: 0, // highest accuracy, highest power consumption
        distanceFilter: 10, // meters device must move before location update is generated
        stationaryRadius: 25, // distance user must move in order to trigger location tracking
        disableElasticity: false, // disable dynamic filtering and return every distanceFilter amount

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
        url: `${ Meteor.absoluteUrl({secure: true}) }api/geolocation`, // submit location updates to backend route
        method: "POST", // submission method
        params: {
          userId: Meteor.userId()
        },
        autoSync: true, // upload each location update as it is received
        maxDaysToPersist: 1 // days for SQLite database to persist
      }, function (state) {
        // This callback is executed when the plugin is ready to use.
        serverLog.call({ message: "Tracker: location tracking setup for: " + Meteor.userId()});
        serverLog.call({ message: `Tracker: state: ${ JSON.stringify(state) }, bgGeo: ${ JSON.stringify(bgGeo) }` });

        // begin tracking
        if (!state.enabled) {
          bgGeo.start(function() {
            serverLog.call({ message: "Tracker: Background location tracking started for " + Meteor.userId()});
          });
        }
      })
    });

  });
} else {
}
