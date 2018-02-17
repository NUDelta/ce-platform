import { Router } from 'meteor/iron:router';

import { updateUserLocationAndAffordances } from '../../api/locations/methods.js';
import { log } from '../../api/logs.js';
import { Location_log } from '../../api/locations/location_log.js'
import {onLocationUpdate} from "../../api/locations/methods";


Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({ extended: false }));

Router.route('/api/geolocation', { where: 'server' })
  .get(function () {
    this.response.end('ok');
  })

  .post(function () {
    const uid = this.request.body.userId;
    const location = this.request.body.location;
    const activity = this.request.body.activity;

    onLocationUpdate = (uid, location.coords.latitude, location.coords.longitude, function(){
      this.response.writeHead(200, { 'Content-Type': 'application/json' });
      this.response.end('ok');
    });


  })
  .put(function () {
    this.response.writeHead(200, { 'Content-Type': 'application/json' });
    this.response.end('ok');
  });
