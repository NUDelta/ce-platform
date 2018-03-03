import {Meteor} from "meteor/meteor";
import {serverLog} from "../../api/logs";

if (Meteor.isCordova) {

  serverLog.call({ message: 'meteor is cordova'});

  Meteor.startup(() => {
    var BackgroundFetch = window.BackgroundFetch;
    serverLog.call({ message: 'tryna do bg fetch ', BackgroundFetch});


    // Your background-fetch handler.
    var fetchCallback = function() {
      console.log('[js] BackgroundFetch event received');
      serverLog.call({ message: 'BackgroundFetch event received'});


      // Required: Signal completion of your task to native code
      // If you fail to do this, the OS can terminate your app
      // or assign battery-blame for consuming too much background-time
      BackgroundFetch.finish();
    };

    var failureCallback = function(error) {
      console.log('- BackgroundFetch failed', error);
      serverLog.call({ message: '- BackgroundFetch failed'});
      serverLog.call({ message: error});


    };

    BackgroundFetch.configure(fetchCallback, failureCallback, {
      minimumFetchInterval: 15, // <-- default is 15
    });


  });

}