import { Router } from 'meteor/iron:router';

import { updateLocation } from '../../api/locations/methods.js';
import { log } from '../../api/logs.js';


Router.onBeforeAction(Iron.Router.bodyParser.urlencoded( {extended : false} ));

Router.route('/api/geolocation', { where: 'server' })
  .get(function() {
    this.response.end('ok');
  })
/*
Example location object:
  { 
	location: { 
	  speed: -1,
	  longitude: -87.67827425878073,
	  latitude: 42.04908624208284,
	  accuracy: 65,
	  heading: -1,
	  altitude: 183.9451293945312,
	  altitudeAccuracy: 10
	}
  }
*/
  .post(function() {
    const userId = this.request.body.userId;
    const location = this.request.body.location;
    log.debug(`Got update from ${ userId }`);
    log.debug(location)
    updateLocation.call({
      uid: userId,
      lat: location.latitude,
      lng: location.longitude
    });
    this.response.writeHead(200, {'Content-Type': 'application/json'});
    this.response.end('ok');
  })
  .put(function() {
    console.log(this.request.body);
    this.response.writeHead(200, {'Content-Type': 'application/json'});
    this.response.end('ok');
  });
