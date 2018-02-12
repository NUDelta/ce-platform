import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {log} from '../logs.js';
import {Locations} from './locations.js';

import { findMatchesForUser } from 'imports/api/experiences/methods.js'
import { runCoordinatorAfterUserLocationChange } from 'imports/api/coordinator/methods.js'

function onLocationUpdate(uid, lat, lng){
    updateLocationInDb(uid, lat, lng);
    sendToMatcher(uid, lat, lng)
}
//after a user's location changes, calls findMatchesFunction in User::Experience Matcher
function sendToMatcher(uid, lat, lng) {
    var availabilityDictionary = findMatchesForUser(uid, lat, lng);
    runCoordinatorAfterUserLocationChange(uid, availabilityDictionary)

}

//checks if a user can participate or if they've participated too recently because we don't want to spam them
//should have a test flag option here
function userIsAvailableToParticipate(uid) {

    return bool;

}


//updates the location for a user
function updateLocationInDb(uid, lat, lng) {
    const entry = Locations.findOne({uid: uid});
    if (entry) {
        Locations.update(entry._id, {
            $set: {
                lat: lat,
                lng: lng,
                timestamp: Date.parse(new Date()),
            }
        }, (err, docs) => {
            if (err) {
                log.error("Locations/methods, can't update a location", err);
            }
        });
    } else {
        Locations.insert({
            uid: uid,
            lat: lat,
            lng: lng,
            timestamp: Date.parse(new Date()),
        }, (err, docs) => {
            if (err) {
                log.error("Locations/methods, can't add a new location", err);
            }
        });
    }
}
