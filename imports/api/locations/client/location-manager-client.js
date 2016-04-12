import { Meteor } from 'meteor/meteor';
import { Geolocation } from 'meteor/mdg:geolocation';

import { Locations } from '../locations.js';

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
    return Geolocation.latLng();
  }

  othersLocations(query = {}) {
    if (Meteor.userId()) {
      query.uid = { $ne: Meteor.userId() };
    }
    return Locations.find(query, { fields: { uid: 0 } }).fetch();
  }

  updateUserLocation(location) {
    if (Meteor.userId() && location) {
      if (this._locationId) {
        Locations.update(this._locationId, { $set: { lat: location.lat, lng: location.lng }});
      } else {
        const entry = Locations.findOne({ uid: Meteor.userId() });
        if (entry) {
          this._locationId = entry._id;
          Locations.update(this._locationId, { $set: { lat: location.lat, lng: location.lng}});
        } else {
          this._locationId = Locations.insert({ lat: location.lat, lng: location.lng, uid: Meteor.userId() });
        }
      }
    }
  }
};

export const LocationManager = new LocationManagerClient();

