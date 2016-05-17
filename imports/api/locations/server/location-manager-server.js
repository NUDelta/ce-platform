import { Locations } from '../locations.js';

const earthRadius = 6371000;

LocationManagerServer = class LocationManagerServer {
  constructor() {
    this._debug = false;
  }

  findUsersNearLocation(location, range) {
    // TODO: refactor this into a single query
    const bounds = this.computeBoundsAround(location, range);
    let users = [];
    Locations.find().forEach((userLocation) => {
      if (this._isWithinBounds(userLocation, bounds)) {
        users.push(userLocation.uid);
      }
    });
    return users;
  }

  findUsersNearLocations(locations, range) {
    // TODO: refactor this too
    let users = [];
    locations.forEach((location) => {
      users = _.union(users, this.findUsersNearLocation(location, range));
    });
    return users;
  }

  _isWithinBounds(location, bounds) {
    // edge cases, cross date line
    let fitsLongitudeBox;
    if (bounds.lng[1] > bounds.lng[0] || Math.abs(bounds.lng[1]) > Math.abs(bounds.lng[0])) {
      // normal
      fitsLongitudeBox = this._isBetween(location.lng, bounds.lng[0], bounds.lng[1]);
    } else {
      fitsLongitudeBox = location.lng >= bounds.lng[0] || location.lng <= bounds.lng[1];
    }
    return this._isBetween(location.lat, bounds.lat[0], bounds.lat[1]) &&
      fitsLongitudeBox;
  }

  _isBetween(target, lim1, lim2) {
    return target >= lim1 && target <= lim2 ||
      target <= lim1 && target >= lim2;
  }

  computeDistance(location1, location2) {
    // https://en.wikipedia.org/wiki/Haversine_formula
    // TODO: check this for accuracy + understand this
    // maximum error should be 0.5%
    const dLat = this._degreeToRadian(location1.lat - location2.lat);
    const dLng = this._degreeToRadian(location1.lng - location2.lng);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this._degreeToRadian(location1.lat)) * Math.cos(this._degreeToRadian(location2.lat)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const b = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return earthRadius * b;
  }

  _degreeToRadian(degree) {
    return degree * Math.PI / 180;
  }

  computeBoundsAround(location, radius) {
    const bounds = {};
    bounds.lat = this._computeLatBounds(location.lat, radius);
    bounds.lng = this._computeLngBounds(location, radius);
    return bounds;
  }

  _computeLatBounds(latitude, distance) {
    // TODO: deal with poles
    /*
     using:
     circumference = 2 * pi * earthR
     circ * x / 360 = distance, solve for x
     */
    const degreeDiff = 360 / (2 * Math.PI * earthRadius / distance);
    let bounds = [];
    bounds.push(this._incLatitude(latitude, -degreeDiff));
    bounds.push(this._incLatitude(latitude, degreeDiff));
    return bounds;
  }

  _incLatitude(latitude, difference) {
    return Math.max(Math.min(latitude + difference, 90), -90);
  }

  _computeLngBounds(location, distance) {
    /*
     similar algorithm as _complteLatBounds, but adjusts the radius
     to account for various size circles on differents lines of latitude
     */
    const latCircleRadius = earthRadius * Math.cos(location.lat);

    const degreeDiff = 360 / (2 * Math.PI * latCircleRadius / distance),
      bounds = [];
    bounds.push(this._incLatitude(location.lng, -degreeDiff));
    bounds.push(this._incLatitude(location.lng, degreeDiff));
    return bounds;
  }

  _incLongitude(longitude, difference) {
    let partial = (longitude + 180 + difference) % 360 - 180;
    if (partial < -180) {
      partial = 180 - Math.abs(180 + partial);
    }
    return partial;
  }
};

export const LocationManager = new LocationManagerServer();
