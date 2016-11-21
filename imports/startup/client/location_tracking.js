import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

import { log, serverLog } from '../../api/logs.js';
import { LocationManager } from '../../api/locations/client/location-manager-client.js';

if (Meteor.isCordova) {
  Meteor.startup(() => {
    //Configure Plugin
    BackgroundLocation.configure({
      desiredAccuracy: 1, // Desired Accuracy of the location updates (lower = more accurate).
      distanceFilter: 1, // (Meters) Distance between points aquired.
      debug: false, // Show debugging info on device.
      interval: 5000, // (Milliseconds) Requested Interval in between location updates.
      useActivityDetection : true, // Shuts off GPS when your phone is still, increasing battery life enormously

      //[Android Only Below]
      notificationTitle: 'BG Plugin', // Customize the title of the notification.
      notificationText: 'Tracking', // Customize the text of the notification.
      fastestInterval: 5000, //(Milliseconds) - Fastest interval OS will give updates.
    });

    //Register a callback for location updates.
    //this is where location objects will be sent in the background
    BackgroundLocation.registerForLocationUpdates(function (location) {
      console.log("We got a Background Update" + JSON.stringify(location));
      if (Meteor.userId()) {
        HTTP.post(`${ Meteor.absoluteUrl() }api/geolocation`, {
          data: {
            location: location,
            userId: Meteor.userId()
          }
        }, (err, res) => {
          
        });
      }
    }, function (err) {
      console.log("Error: Didnt get an update", err);
    });

    //Register a callback for activity updates 
    //If you set the option useActivityDetection to true you will recieve
    //periodic activity updates, see below for more information
    BackgroundLocation.registerForActivityUpdates(function (activities) {
      console.log("We got an activity Update" + activites);
    }, function (err) {
      console.log("Error:", err);
    });

    //Start the Background Tracker. 
    //When you enter the background tracking will start.
    BackgroundLocation.start();

    ///later, to stop
    //BackgroundLocation.stop();
  });
} else {
}

Meteor.startup(() => {
  trackerInterval = Meteor.setInterval(updateLocation, 10000);
});

var updateLocation = function() {
   LocationManager.trackUpdates(Tracker, () => {}, () => {});
};
