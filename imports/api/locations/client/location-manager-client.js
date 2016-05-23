import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

import { Locations } from '../locations.js';
import { updateLocation } from '../methods.js';

LocationManagerClient = class LocationManagerClient {
  constructor() {
    this._current = {};
    this._others = {};
    this._locationId = null;
  }

  trackUpdates(tracker, addTransform, changeCallback) {
    tracker.autorun(() => {
      let uid = Meteor.userId(),
        latLng = Geolocation.latLng();

      this.updateUserLocation(latLng);
      if (Object.keys(this._current).length === 0) {
        this._current.struct = addTransform(latLng);
      }
      changeCallback(this._current.struct, latLng);
    });
  }

  trackOthersUpdates(query, addTransform, changeCallback, removeCallback) {
    this.othersLocations(query).forEach((location) => {
      this._others[location._id] = addTransform(location);
      changeCallback(this._others[location._id], location);
    });
    Locations.find(query).observeChanges({
      changed: (id, fields) => {
        if (id in this._others) {
          removeCallback(this._others[id]);
          changeCallback(this._others[id], fields);
        }
      },
      removed: (id) => {
        if (id in this._others) {
          removeCallback(this._others[id]);
          delete this._others[id];
        }
      },
    });
  }

  currentLocation() {
    const lastPosition = navigator.geolocation.lastPosition &&
      navigator.geolocation.lastPosition.coords;
    const location = Geolocation.latLng() ||
      { lat: lastPosition.latitude, lng: lastPosition.longitude } ||
      { lat: 0, lng: 0 };
    return location;
  }

  othersLocations(query = {}) {
    if (Meteor.userId()) {
      query.uid = { $ne: Meteor.userId() };
    }
    return Locations.find(query, { fields: { uid: 0 } }).fetch();
  }

  updateUserLocation(location) {
    if (Meteor.userId() && location) {
      updateLocation.call({
        uid: Meteor.userId(),
        lat: location.lat,
        lng: location.lng
      });
    }
  }
};

export const LocationManager = new LocationManagerClient();
