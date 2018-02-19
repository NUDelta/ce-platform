import { Router } from 'meteor/iron:router';

import { updateUserLocationAndAffordances } from '../../api/locations/methods.js';
import { log } from '../../api/logs.js';
import { Location_log } from '../../api/locations/location_log.js'
import { onLocationUpdate } from "../../api/locations/methods";
import {serverLog} from "../../api/logs";
import {Meteor} from "meteor/meteor";


Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({ extended: false }));

Router.route('/api/geolocation', { where: 'server' })
  .get(function () {
    this.response.end('ok');
  })

  //curl -i -X POST -H 'Content-Type: app '{"userId": "sb8Feb8jEe5Lao9S3", "location": {"coords": {"latitude": 43, "longitude": -87}}}' http://localhost:3000/api/geolocation
  .post(function () {
    console.log("request body:", this.request.body);
    const uid = this.request.body.userId;
    const location = this.request.body.location;
    // const activity = this.request.body.activity;

    onLocationUpdate(uid, location.coords.latitude, location.coords.longitude, function () {
      serverLog.call({ message: "triggering internal location update for: " + uid });
    });

    this.response.writeHead(200, { 'Content-Type': 'application/json' });
    this.response.end('ok');

  })
  .put(function () {
    this.response.writeHead(200, { 'Content-Type': 'application/json' });
    this.response.end('ok');
  });

