import { WebApp } from "meteor/webapp"
import bodyParser from "body-parser"
import { onLocationUpdate } from "../../api/UserMonitor/locations/methods";
import { serverLog } from "../../api/logs";


// WebApp.connectHandlers.use(bodyParser.urlencoded({ extended: false }));
WebApp.connectHandlers.use('/', bodyParser.json());

WebApp.connectHandlers.use("/api/geolocation", (req, res, next) => {
  serverLog.call({message: `in SERVER/ROUTER.JS: POST to api/geolocation: ${ JSON.stringify(req.body) }`});

  const uid = req.body.userId;
  const location = req.body.location;

  // only do a location update if valid uid
  if (uid !== null) {
    onLocationUpdate(uid, location, function (uid) {
      serverLog.call({message: "triggering internal location update for: " + uid});
    });
    res.writeHead(200);
    res.end(`POST to api/geolocation: ${ JSON.stringify(req.body) }`)
  } else {
    serverLog.call({ message: 'location update not triggered since user was null'});
    next();
  }
});


//Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({extended: false}));

  /**
   * Test this route with simple request data
   * curl -i -X POST \
   -H 'Content-Type: application/json' \
   -d '{"userId": "dsfasdfas", "location": {"coords": {"latitude": 42.056838, "longitude": -87.675940}}}' \
   https://ce-platform.herokuapp.com/api/geolocation
   *
   * Example Full POST Request Body
    {
      "location":{
        "coords":{
          "speed":-1,
          "longitude":-87.67433452864508,
          "floor":null,
          "latitude":42.05843773426963,
          "accuracy":65,
          "altitude_accuracy":10,
          "altitude":180.5,
          "heading":-1
        },
        "extras":{},
        "is_moving":false,
        "event":"motionchange",
        "odometer":16261620.7,
        "uuid":"F1C637DD-B504-4C4B-A54F-A51244A1B1A7",
        "activity":{
          "type":"still",
          "confidence":100
        },
        "battery":{
          "level":0.5699999928474426,
          "is_charging":true
        },
        "timestamp":"2019-03-12T19:40:55.710Z"
      },
      "userId":"NeSSaaGC9nNgo9RZY"
    }
   */
/*
Router.route('/api/geolocation', {where: 'server'})
  .get(function () {
    this.response.end('ok');
  })
  .post(function () {
    serverLog.call({message: `POST to api/geolocation: ${ JSON.stringify(this.request.body) }`});

    const uid = this.request.body.userId;
    const location = this.request.body.location;

    // only do a location update if valid uid
    if (uid !== null) {
      onLocationUpdate(uid, location, function (uid) {
        serverLog.call({message: "triggering internal location update for: " + uid});
      });
    } else {
      serverLog.call({ message: 'location update not triggered since user was null'});
    }

    this.response.writeHead(200, {'Content-Type': 'application/json'});
    this.response.end('ok');
  })
  .put(function () {
    this.response.writeHead(200, {'Content-Type': 'application/json'});
    this.response.end('ok');
  });
*/
