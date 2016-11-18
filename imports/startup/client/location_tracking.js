import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

import { log, serverLog } from '../../api/logs.js';
import { LocationManager } from '../../api/locations/client/location-manager-client.js';

if (Meteor.isCordova) {
  // Meteor.startup(() => {
  //   const bgGeo = window.BackgroundGeolocation;

  //   function success(location, taskId) {
  //     if (Meteor.userId()) {
  //       HTTP.post(`${ Meteor.absoluteUrl() }api/geolocation`, {
  //         data: {
  //           location: location.coords,
  //           userId: Meteor.userId()
  //         }
  //       }, (err, res) => {
  //         bgGeo.finish(taskId);
  //       });
  //     } else {
  //       bgGeo.finish(taskId);
  //     }
  //   }

  //   function error(error) {
  //     console.log(error);
  //   }

  //   bgGeo.on('location', success, error);

  //   const options = {
  //     desiredAccuracy: 0,
  //     stationaryRadius: 20,
  //     distanceFilter: 10,
  //     locationUpdateInterval: 1000,

  //     debug: false,
  //     stopOnTerminate: false,
  //     startOnBoot: true,
  //   };

  //   bgGeo.configure(options, (state) => {
  //     bgGeo.start();
  //   });
  // });
} else {
}

Meteor.startup(() => {
  trackerInterval = Meteor.setInterval(updateLocation, 10000);
});

var updateLocation = function() {
   LocationManager.trackUpdates(Tracker, () => {}, () => {});
};
