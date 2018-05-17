import {Router} from 'meteor/iron:router';

import {updateUserLocationAndAffordances} from '../../api/locations/methods.js';
import { onLocationUpdate } from "../../api/locations/methods";
import {serverLog} from "../../api/logs";
import {Meteor} from "meteor/meteor";


Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({extended: false}));

Router.route('/api/geolocation', {where: 'server'})
  .get(function () {
    this.response.end('ok');
  })

  /**
   * curl -i -X POST \
   -H 'Content-Type: application/json' \
   -d '{"userId": "dsfasdfas", "location": {"coords": {"latitude": 42.056838, "longitude": -87.675940}}}' \
   https://ce-platform.herokuapp.com/api/geolocation
   */
  .post(function () {
    serverLog.call({message: `POST to api/geolocation: ${ JSON.stringify(this.request.body) }`});

    const uid = this.request.body.userId;
    const location = this.request.body.location;
    // const activity = this.request.body.activity;

    // only do a location update if valid uid
    if (uid !== null) {
      onLocationUpdate(uid, location.coords.latitude, location.coords.longitude, function (uid) {
        serverLog.call({message: "triggering internal location update for: " + uid});
      });
    } else {
      serverLog.call({ message: 'location update not triggered since user was null.' });
    }

    this.response.writeHead(200, {'Content-Type': 'application/json'});
    this.response.end('ok');
  })
  .put(function () {
    this.response.writeHead(200, {'Content-Type': 'application/json'});
    this.response.end('ok');
  });

