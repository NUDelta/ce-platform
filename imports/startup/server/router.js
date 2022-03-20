import { WebApp } from "meteor/webapp"
import bodyParser from "body-parser"

import { onLocationUpdate } from "../../api/UserMonitor/locations/methods";
import { serverLog } from "../../api/logs";


WebApp.connectHandlers.use('/', bodyParser.json());

WebApp.connectHandlers.use("/api/geolocation", (req, res, next) => {
  // serverLog.call({message: `POST to api/geolocation: ${ JSON.stringify(req.body) }`});

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