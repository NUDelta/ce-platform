import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {log} from '../logs.js';
import {Locations} from './locations.js';
import { findMatchesForUser } from 'imports/api/experiences/methods.js'
import { runCoordinatorAfterUserLocationChange } from 'imports/api/coordinator/methods.js'

function onLocationUpdate(uid, lat, lng){
    //update location in the db
    sendToMatcher(uid, lat, lng)
}
//after a user's location changes, calls findMatchesFunction in User::Experience Matcher
function sendToMatcher(uid, lat, lng) {
    var availabilityDictionary = findMatchesForUser(uid, lat, lng);
    runCoordinatorAfterUserLocationChange(uid, availabilityDictionary)

}

//checks if a user can participate or if they've participated too recently because we don't want to spam them
function userIsAvailableToParticipate(uid) {

    return bool;

}


//updates the location for a user
function updateLocation(uid, lat, lng, givenAffordances) {
    const entry = Locations.findOne({uid: uid});
    console.log("our affs are", givenAffordances)
    if (entry) {
        Locations.update(entry._id, {
            $set: {
                lat: lat,
                lng: lng,
                affordances: givenAffordances
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
            affordances: givenAffordances,
            lastNotification: null,
        }, (err, docs) => {
            if (err) {
                log.error("Locations/methods, can't add a new location", err);
            }
        });
    }
}
