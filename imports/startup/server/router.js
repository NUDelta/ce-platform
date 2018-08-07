import { Router } from 'meteor/iron:router';
import { onLocationUpdate } from "../../api/UserMonitor/locations/methods";
import { serverLog } from "../../api/logs";


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

    // FIXME(rlouie): Separate concerns to Affinder/Detectors to handle the logic for using activity info
    let not_traveling_on_bicycle_or_vehicle;
    if ('activity' in location) {
      not_traveling_on_bicycle_or_vehicle = !((location.activity.type === "in_vehicle") || (location.activity.type === "on_bicycle"));
    } else {
      serverLog.call({message: `no activity data for ${uid}. defaulting to a value that allows location update`});
      not_traveling_on_bicycle_or_vehicle = true;
    }

    // only do a location update if valid uid
    // and if we are not traveling on a bicycle or in a vehicle
    if ((uid !== null) && (not_traveling_on_bicycle_or_vehicle)) {
      onLocationUpdate(uid, location.coords.latitude, location.coords.longitude, function (uid) {
        serverLog.call({message: "triggering internal location update for: " + uid});
      });
    } else {
      serverLog.call({ message: 'location update not triggered since user was null or user was on transit'});
    }

    this.response.writeHead(200, {'Content-Type': 'application/json'});
    this.response.end('ok');
  })
  .put(function () {
    this.response.writeHead(200, {'Content-Type': 'application/json'});
    this.response.end('ok');
  });

