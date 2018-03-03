import { Push } from 'meteor/raix:push';
import { Router } from 'meteor/iron:router';

import { log, serverLog } from '../../api/logs.js';

Push.addListener('startup', (notification) => {

  if (notification.payload.route) {
    serverLog.call({message: `Cold start with ${ JSON.stringify(notification.payload) }`});

    let bgGeo = window.BackgroundGeolocation;
    serverLog.call({message: 'we r cordova! ', bgGeo});

    bgGeo.stop();
    bgGeo.start();

    Router.go(notification.payload.route, {_id: notification.payload.experienceId});
  }
});

Push.addListener('message', (notification) => {
  if (notification.payload.route) {
    serverLog.call({ message: `Hot start with ${ JSON.stringify(notification.payload) }` });
    if(Meteor.isCordova){
      let bgGeo = window.BackgroundGeolocation;
      serverLog.call({message: "we r cordova! ", bgGeo});

      bgGeo.stop();
      bgGeo.start();
    }
    Router.go(notification.payload.route, { _id: notification.payload.experienceId });
  }
});

