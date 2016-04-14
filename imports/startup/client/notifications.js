import { Push } from 'meteor/raix:push';
import { Router } from 'meteor/iron:router';

Push.addListener('startup', (notification) => {
  console.log(JSON.stringify(notification));
  if (notification.payload.route) {
    Router.go(notification.payload.route, { _id: notification.payload.experienceId });
  }
});

Push.addListener('message', (notification) => {
  console.log(JSON.stringify(notification));
  if (notification.payload.route) {
    Router.go(notification.payload.route, { _id: notification.payload.experienceId });
  }
});
