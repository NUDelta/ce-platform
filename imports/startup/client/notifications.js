import { Push } from 'meteor/raix:push';
import { Router } from 'meteor/iron:router';

import { log, serverLog } from '../../api/logs.js';

Push.addListener('startup', (notification) => {

  if (notification.payload.route) {
    serverLog.call({message: `Cold start with ${ JSON.stringify(notification.payload) }`});

    let bgGeo = window.BackgroundGeolocation;

    if(bgGeo){
      bgGeo.stop();
      bgGeo.start();
    }

    Router.go(notification.payload.route);

  }
});

Push.addListener('message', (notification) => {
  if (notification.payload.route) {
    serverLog.call({ message: `Hot start with ${ JSON.stringify(notification.payload) }` });

    let bgGeo = window.BackgroundGeolocation;

    if(bgGeo){
      bgGeo.stop();
      bgGeo.start();
    }

    Router.go(notification.payload.route);

  }
});

