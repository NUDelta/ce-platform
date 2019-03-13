import {Meteor} from "meteor/meteor";
import { Locations } from "../../UserMonitor/locations/locations";
import {Groundtruth_log} from "./groundtruth_log";


Meteor.methods({
  insertGroundTruthLog({uid, label}) {
    // new SimpleSchema({
    //   uid: { type: String },
    //   label: { type: String }
    // }).validate({uid, label});
    //
    let currentLoc = Locations.findOne({uid: uid});

    Groundtruth_log.insert({
      uid: uid,
      timestamp: Date.now(),
      label: label,
      lat: currentLoc.lat,
      lng: currentLoc.lng,
      affordances: currentLoc.affordances
    }, (err) => {
      if (err) {
        console.log('Groundtruth Log upload error,', err);
      } else {
      }
    });
  }
});
