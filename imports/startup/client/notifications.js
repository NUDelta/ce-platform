import { Push } from 'meteor/raix:push';
import { Router } from 'meteor/iron:router';
import { log, serverLog } from '../../api/logs.js';

Push.Configure({
  android: {
    senderID: 12341234,
    alert: true,
    badge: true,
    sound: true,
    vibrate: true,
    clearNotifications: true
    // icon: '',
    // iconColor: ''
  },
  ios: {
    alert: true,
    badge: true,
    sound: true,
    vibrate: true
  }
});

/**
 * This event is occurs when Push.send is called from the server, notification is received by client, but
 * client is in the background. Then, client opens the push notification, bringing application into foreground.
 */
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

/**
 * This event occurs when Push.send is called from the server, and the mobile clients app is in the foreground
 * However, there is no interface indicator that a message was sent.  The message can be viewed as a notification on
 * the phone's home screen, once the app is in the background.
 */
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

  // empty, invisible notification
  if (notification.payload.text === "") {
    serverLog.call({ message: "RYAN RYAN RYAN RYAN RYAN! notification.payload.text is emtpy string "})
    // silent push of death.... to all other notifications!
    if ('push' in Push) {
      serverLog.call({ message: "native push is a property of Push!"})

      if ('clearAllNotifications' in Push.push) {
        serverLog.call({ message: "clearAllNotifications is a property of Push!"})
      }
    }
    // FIXME(rlouie): the call to push.clearAllNotifications does nothing, and the callbacks are not run
    Push.push.clearAllNotifications(
      () => {
        serverLog.call({ message: 'Successfully cleared push notifications for ' + uids });
      },
      () => {
        serverLog.call({message: 'Operation failed: tried to clear push notifications for ' + uids});
      }
    );
  }

});

