import { Router } from 'meteor/iron:router';

import { updateUserLocationAndAffordances } from '../../api/locations/methods.js';
import { log } from '../../api/logs.js';
import { Location_log } from '../../api/locations/location_log.js'


Router.onBeforeAction(Iron.Router.bodyParser.urlencoded( {extended : false} ));

Router.route('/api/geolocation', { where: 'server' })
  .get(function() {
    this.response.end('ok');
  })

  .post(function() {
    const userId = this.request.body.userId;
    const location = this.request.body.location;
    const activity = this.request.body.activity;

    updateUserLocationAndAffordances.call({
      uid: userId,
      lat: location.coords.latitude,
      lng: location.coords.longitude
    });

    Location_log.insert({
      uid: userId,
      lat: location.coords.latitude,
      lng: location.coords.longitude,
      time: Date.now() / 1000,
    }, (err, docs) => {
      if (err) {
        log.error("Not adding to location log correctly", err);
      }
    });


    this.response.writeHead(200, {'Content-Type': 'application/json'});
    this.response.end('ok');
  })
  .put(function() {
    this.response.writeHead(200, {'Content-Type': 'application/json'});
    this.response.end('ok');
  });
