import { Meteor } from 'meteor/meteor';
import { BackgroundLocation } from 'meteor/mirrorcell:background-geolocation-plus';

import { LocationManager } from '../../api/locations/client/location-manager-client.js';

if (Meteor.isCordova) {
  Meteor.startup(function() {
    BackgroundLocation.configure({
      desiredAccuracy: 5, // Desired Accuracy of the location updates (lower = more accurate).
      distanceFilter: 1, // (Meters) Distance between points aquired.
      debug: false, // Show debugging info on device.
      interval: 9000, // (Milliseconds) Requested Interval in between location updates.
      //[Android Only Below]
      notificationTitle: 'BG Plugin', // Customize the title of the notification.
      notificationText: 'Tracking', // Customize the text of the notification.
      fastestInterval: 5000, //(Milliseconds) - Fastest interval OS will give updates.
      useActivityDetection : true // Shuts off GPS when your phone is still, increasing battery life enormously
    });

    //Register a callback for location updates.
    //this is where location objects will be sent in the background
    BackgroundLocation.registerForLocationUpdates(function (location) {
      console.log("We got a Background Update" + JSON.stringify(location));
      LocationManager.updateUserLocation({
        lat: location.latitude,
        lng: location.longitude
      });
    }, function (err) {
      console.log("Error: Didnt get an update", err);
    });

    //Start the Background Tracker.
    //When you enter the background tracking will start.
    BackgroundLocation.start();
  });
}
