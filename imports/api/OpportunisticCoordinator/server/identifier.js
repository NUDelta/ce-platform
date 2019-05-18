import {ValidatedMethod} from "meteor/mdg:validated-method";
import {SimpleSchema} from "meteor/aldeed:simple-schema";

import {Assignments, Availability, ParticipatingNow} from "../databaseHelpers";
import {Incidents} from "../../OCEManager/OCEs/experiences.js";
import {Submissions} from "../../OCEManager/currentNeeds.js";
import {Locations} from "../../UserMonitor/locations/locations";
import {numUnfinishedNeeds} from "../../OCEManager/progressor";
import {addEmptySubmissionsForNeed} from "../../OCEManager/OCEs/methods.js";

import {_removeActiveIncidentFromUser} from "../../UserMonitor/users/methods";
import {doesUserMatchNeed, getNeedDelay} from "../../OCEManager/OCEs/methods";
import {log, serverLog} from "../../logs";
import {flattenAffordanceDict} from "../../UserMonitor/detectors/methods";
import {Decommission_log} from "../../Logging/decommission_log";
import {AddedToIncident_log} from "../../Logging/added_to_incident_log";


export const getNeedObject = (iid, needName) => {
  let incident = Incidents.findOne(iid);
  if (incident) {
    return incident.contributionTypes.find(function(x) {
      return x.needName === needName;
    });
  } else {
    return null;
  }
};

/**
 * AVAILABILITY DB FUNCTIONS
 */

/**
 * Updates the database with the availabilities of a user.
 *
 * @param uid {string}
 * @param availabilityDictionary {object} current availabilities as
 *  {iid: [[place, need, distance], [place, need, distance]], iid: [[place, need, distance]]}
 * @return {[object]} array of object from Availability DB
 *  [{iid: string, needs: [{needName: string, users: [uid]}]]
 */
export const updateAvailability = (uid, availabilityDictionary) => {
  let incidentsUpdated = [];

  // iterate over cursor
  let availability = Availability.find();
  availability.forEach(av => {
    let iid = av._id;
    if (!(iid in availabilityDictionary)) {
      return; // continue forEach
    }
    incidentsUpdated.push(iid);

    _.forEach(av.needUserMaps, needUserMap => {
      let needName = needUserMap.needName;

      let matchingPlaceNeedDistance = availabilityDictionary[iid].find(
        place_need_distance => place_need_distance[1] === needName);

      // add user to availability if they can fulfill needName
      if (matchingPlaceNeedDistance) {
        // pull any old instances of the user object with {uid: <some_uid>}
        pullUserFromAvailabilityNeedUserMaps(iid, needName, uid);

        // push an updated instance of this user object
        pushUserIntoAvailabilityNeedUserMaps(iid, needName, uid, matchingPlaceNeedDistance[0], matchingPlaceNeedDistance[2])

      }
      // try to remove user from needs they are not currently available for
      // NOTE: potentially redundant, clearAvailabilitiesForUser might have been already called
      else {
        pullUserFromAvailabilityNeedUserMaps(iid, needName, uid);
      }
    });
  });

  return Availability.find({_id: {$in: incidentsUpdated}}).fetch();
};

export const pullUserFromAvailabilityNeedUserMaps = (iid, needName, uid) => {
  Availability.update(
    {
      _id: iid,
      "needUserMaps.needName": needName
    },
    {
      $pull: { "needUserMaps.$.users": {"uid" : uid } }
    }
  );
};

export const pushUserIntoAvailabilityNeedUserMaps = (iid, needName, uid, place, distance) => {
  Availability.update(
    {
      _id: iid,
      "needUserMaps.needName": needName
    },
    {
      $push: {
        "needUserMaps.$.users": {
          "uid": uid,
          "place": place,
          "distance": distance
        }
      }
    }
  );
};

/**
 * ASSIGNMENT DB FUNCTIONS
 */

export const pullUserFromAssignmentsNeedUserMaps = (iid, needName, uid) => {
  Assignments.update(
    {
      _id: iid,
      "needUserMaps.needName": needName
    },
    {
      $pull: { "needUserMaps.$.users": {"uid" : uid } }
    }
  );
};

export const pushUserIntoAssignmentsNeedUserMaps = (iid, needName, uid, place, distance) => {
  Assignments.update(
    {
      _id: iid,
      "needUserMaps.needName": needName
    },
    {
      $push: {
        "needUserMaps.$.users": {
          "uid": uid,
          "place": place,
          "distance": distance
        }
      }
    }
  );
};

/**
 * Clears current availabilities for a user given a uid.
 * @param uid {string} user to clear data for
 */
export const clearAvailabilitiesForUser = (uid) => {
  let availabilityObjects = Availability.find().fetch();
  _.forEach(availabilityObjects, (av) => {
    // remove user for each need in each
    _.forEach(av.needUserMaps, (needEntry) => {
      // was a
      pullUserFromAvailabilityNeedUserMaps(av._id, needEntry.needName, uid);
    });
  });
};

/**
 * Un-assigns a user to an incident if their location no longer matches
 * Also removes the active experience from the user
 *
 * @param uid {string} user to update assignment for
 * @param affordances {[string]} list of user's affordances as an array of key/values
 */
export const decomissionFromAssignmentsIfAppropriate = (uid, affordances) => {
  let currentAssignments = Assignments.find({
    "needUserMaps.users": {
      $elemMatch: {
        uid: uid
      }
    }
  });

  let flatAffordances = flattenAffordanceDict(affordances);

  // iterate over cursor
  currentAssignments.forEach(assignment => {
    _.forEach(assignment.needUserMaps, needUserMap => {

      let matchPredicate = doesUserMatchNeed(
        uid,
        flatAffordances,
        assignment._id,
        needUserMap.needName
      );

      if (!matchPredicate && needUserMap.users.find(user => user.uid === uid)) {
        // note: decommissionDelay == notificationDelay
        let delay = getNeedDelay(assignment._id, needUserMap.needName);

        Meteor.setTimeout(
          decommissionIfSustained.bind(null, uid, assignment._id, needUserMap.needName, delay),
          delay * 1000);
      }
    });
  });
};

/**
 * Called after some decommissionDelay setTimeout, with parameters binded to this callback function
 * @param userId
 * @param incidentId
 * @param needName
 */
let decommissionIfSustained = (userId, incidentId, needName, decommissionDelay) => {
  let user = Meteor.users.findOne({_id: userId});
  if (!user) {
    log.warning(`No user exists for uid = ${userId}`);
    return;
  }
  let activeIncidents = user.activeIncidents();
  if (!activeIncidents.includes(incidentId)) {
    log.info(`No need to decommission { uid: ${userId} } from { iid: ${incidentId} }`);
    return;
  }
  let lastLocation = Locations.findOne({uid: userId});
  let nestedAffAfterDelay = lastLocation.affordances;
  let flatAffAfterDelay = flattenAffordanceDict(nestedAffAfterDelay);

  let matchPredicateAfterDelay = doesUserMatchNeed(userId, flatAffAfterDelay, incidentId, needName);

  // Only remove after they do not match again after some decommission delay
  if (!matchPredicateAfterDelay) {
    log.cerebro(`Removing user ${userId} from [${incidentId},${needName}] after ${decommissionDelay} sec`);

    Decommission_log.insert({
      iid: incidentId,
      uid: userId,
      needName: needName,
      lat: lastLocation.lat,
      lng: lastLocation.lng,
      timestamp: Date.now(),
      affordances: nestedAffAfterDelay,
      decommissionDelay: decommissionDelay
    }, (err) => {
      if (err) {
        log.error(`Failed to insert to decommission_log: ${err}`);
      }
    });

    adminUpdatesForRemovingUserToIncidentEntirely(userId, incidentId, needName);
  }

  // FIXME(rlouie): If people qualify for multiple needs, and then disqualify shortly after...
  // they get continuously spammed with notifications. A way better UI would be to remove the notification
  // entirely.
  // TODO(rlouie): replace this call for notifyForMissingParticipation with a retract notification method
  // notifyForMissingParticipation([uid]);
};

/**
 *
 * @param uid {string} user to add
 * @param iid {string} incident to add user to
 * @param needName {string} name of need to add user to
 */
export const adminUpdatesForAddingUserToIncident = (uid, iid, needName) => {
  _addUserToAssignmentDb(uid, iid, needName);
  // TODO(rlouie): add extra incident/need/place/distance info
  // _addActiveIncidentNeedPlaceDistanceToUsers(uid, incidentNeedPlaceDistance);

  log.cerebro(`Assigning [${iid}, ${needName}] to users ` + JSON.stringify(uid));
  AddedToIncident_log.insert({
    uid: uid,
    timestamp: Date.now(),
    iid: iid,
    needName: needName
  }, (err) => {
    if (err) {
      log.error(`Failed to insert to added_to_incident_log: ${err}`);
    }
  });

};

/**
 *
 * @param uid {string} users to remove
 * @param iid {string} incident to remove users from
 * @param needName {string} name of need to remove users from
 */
// user participated so need to remove from active incidents and add to past incidents
export const adminUpdatesForRemovingUserToIncident = (uid, iid, needName) => {
  _removeUserFromAssignmentDb(uid, iid, needName);
  _removeActiveIncidentFromUser(uid, iid);
};

/**
 *
 * @param uid {string} user to remove
 * @param iid {string} incident to remove user from
 * @param needName {string} name of need to remove user from
 */
// user location moved but did not participate. remove incident entirely from user
export const adminUpdatesForRemovingUserToIncidentEntirely = (uid, iid, needName) => {
  //TODO: make this function take a single user not an array
  _removeUserFromAssignmentDb(uid, iid, needName);
};

/**
 * Adds all users in the array to the assignmentDB for the specified need.
 *
 * @param uid {string} array of users to remove
 * @param iid {string} incident to add to
 * @param needName {string} need to add user to
 */
const _addUserToAssignmentDb = (uid, iid, needName) => {
  // addToSet by pulling the old users and pushing the new users
  pullUserFromAssignmentsNeedUserMaps(iid, needName, uid);
  pushUserIntoAssignmentsNeedUserMaps(iid, needName, uid)
};

/**
 * Checking if a need fails. We define failure in the case when
 * situation.number !== number of completed submissions for a need.
 * This might happen in a synchronous OCE like bumped, where two people are required in the situation,
 * yet one person did submit, and the other person did not.  This is a failure, since both submissions
 * were neccessary to complete a need.
 * If so, mark OCEManager as failures
 * and create fresh OCEManager to re-try
 *
 * @param iid {string} incident with failed need
 * @param needName {string} need that failed
 *
 **/
const checkIfNeedFailed = (iid, needName) => {
  if (numUnfinishedNeeds(iid, needName) > 0) {

    Submissions.update(
      { iid: iid, needName: needName },
      { $set: { failed: true } },
      { multi: true }
    );

    Submissions.remove({ iid: iid, uid: null, needName: needName });

    let incident = Incidents.findOne({ _id: iid });

    let need = incident.contributionTypes.find(x => {
      return x.needName === needName;
    });

    addEmptySubmissionsForNeed(iid, incident.eid, need);
  }
};

/**
 * Removes user from assignmentDB for the specified need.
 *
 * @param uid {string} user to remove
 * @param iid {string} incident to remove from
 * @param needName {string} need that user is assigned to
 */
const _removeUserFromAssignmentDb = (uid, iid, needName) => {
  Assignments.update(
    {
      _id: iid,
      "needUserMaps.needName": needName
    },
    {
      $pull: { "needUserMaps.$.users": {uid: uid} }
    }
  );
  /*
  const needUserMap = getNeedUserMapForNeed(iid, needName);

  if (needUserMap.uids.length === 0) {
    // FIXME(rlouie): Fix and then uncomment so that needs that fail (during a synchronous OCE) are handled properly
    checkIfNeedFailed(iid, needName);
  }
  */
};

export const getNeedUserMapForNeed = (iid, needName) => {
  let assignment = Assignments.findOne({
    _id: iid,
    "needUserMaps.needName": needName
  });

  if (assignment) {
    serverLog.call({message: `assignment obj: ${Object.keys(assignment)}`});
    serverLog.call({message: `needUserMaps: ${Object.keys(assignment.needUserMaps)}`});
    let needUserMap = assignment.needUserMaps.find(x => {
      return x.needName === needName;
    });

    return needUserMap;
  }
};


Meteor.methods({
  pushUserIntoParticipatingNow({iid, needName, uid}) {
    new SimpleSchema({
      iid: { type: String },
      needName: { type: String },
      uid: { type: String }
    }).validate({iid, needName, uid});

    pushUserIntoParticipatingNow(iid, needName, uid);
  },
  pullUserFromParticipatingNow({iid, needName, uid}) {
    new SimpleSchema({
      iid: { type: String },
      needName: { type: String },
      uid: { type: String }
    }).validate({iid, needName, uid});

    pullUserFromParticipatingNow(iid, needName, uid);
  },
});

/**
 * pushUserIntoParticipatingNow
 *
 * The list of users in each needUserMap is a counter for who has the participate route open
 * This function increments this "semaphore" like counter, or adds users
 * @param iid
 * @param needName
 * @param uid
 * @param place
 * @param distance
 */
export const pushUserIntoParticipatingNow = (iid, needName, uid) => {
  ParticipatingNow.update(
    {
      _id: iid,
      "needUserMaps.needName": needName
    },
    {
      $push: {
        // note: this object is different than {"uid": uid, "place": place, "distance": distance}
        "needUserMaps.$.users": {
          "uid": uid
        }
      }
    }
  );
};


/**
 * pullUserFromParticipatingNow
 *
 * The list of users in each needUserMap is a counter for who has the participate route open
 * This function decrements this "semaphore" like counter, or removes users
 * @param iid
 * @param needName
 * @param uid
 */
export const pullUserFromParticipatingNow = (iid, needName, uid) => {
  ParticipatingNow.update(
    {
      _id: iid,
      "needUserMaps.needName": needName
    },
    {
      $pull: { "needUserMaps.$.users": {"uid" : uid } }
    }
  );
};


// const locationCursor = Locations.find();
//
// /**
//  * a DB listener that responds when a user's location field changes, this includes
//  *    lat/long and the affordance array
//  */
// const locationHandle = locationCursor.observeChanges({
//   changed(id, fields) {
//     console.log('the location field changed', fields);
//
//     if ('lastNotification' in fields) {
//       return;
//     }
//
//     //check if now that they've moved they...
//     const location = Locations.findOne({ _id: id });
//     const uid = location.uid;
//
//     //need to be removed from an experience they're currently in
//     const user = Meteor.users.findOne({ _id: uid });
//     const usersExperiences = user.profile.activeExperiences;
//     if (usersExperiences) {
//       usersExperiences.forEach((experienceId) => {
//         removeUserFromExperienceAfterTheyMoved(uid, experienceId)
//       })
//     }
//
//     if ('affordances' in fields) {
//       AvailabilityLog.insert({
//         uid: uid,
//         lastParticipated: user.profile.lastParticipated,
//         lastNotified: location.lastNotification,
//         affordances: location.affordances,
//         lat: location.lat,
//         lng: location.lng,
//         now: Date.now()
//       });
//     }
//
//     //check if user to available to participate right now
//     if (!userIsAvailableToParticipate(user, location)) {
//       console.log('user participated too recently');
//       return;
//     }
//
//     //can be added to a new experience
//     const allExperiences = Experiences.find({ activeIncident: { $exists: true } }).fetch();
//
//     //could randomize the order of experiences
//     console.log('at the top of the for loops');
//     const shuffledExperiences = _.shuffle(allExperiences);
//
//     for (let i in shuffledExperiences) {
//       const experience = shuffledExperiences[i];
//       const result = attemptToAddUserToIncident(uid, experience.activeIncident);
//       console.log('result', result);
//       if (result) {
//         console.log('We found an experience for the user and now are stopping');
//         break;
//       }
//     }
//   }
// });
//
//
// /**
//  * userIsAvailableToParticipate - checks if a user can participate or if they not
//  *    available to participate because they were notified too recently
//  *
//  * @param  user {User} user document
//  * @param  location {Location} location location document for that user
//  * @return {boolean} true if a user can participate
//  */
// const userIsAvailableToParticipate = (user, location) => {
//   const waitTimeAfterNotification = 30 * 60000; //first number is the number of minutes
//   const waitTimeAfterParticipating = 60 * 60000;//first number is the number of minutes
//
//   const lastParticipated = user.profile.lastParticipated;
//   const lastNotified = location.lastNotification;
//
//   const now = Date.now();
//
//   let userNotYetNotified = lastParticipated === null;
//   const userNotifiedTooRecently = (now - lastNotified) < waitTimeAfterNotification;
//
//   let userNotYetParticipated = lastNotified === null;
//   const userParticipatedTooRecently = (now - lastParticipated) < waitTimeAfterParticipating;
//
//   return !((!userNotYetNotified && userNotifiedTooRecently) ||
//     (!userNotYetParticipated && userParticipatedTooRecently));
// };
//
// const attemptToAddUserToIncident = (uid, incidentId) => {
//   const incident = Incidents.findOne({ _id: incidentId });
//   const userAffordances = Locations.findOne({ uid: uid }).affordances;
//   const minParticipation = Math.min(); //this is infinity
//   let minSituationNeed = null;
//
//   incident.situationNeeds.forEach((sn) => {
//     if (sn.done === false && containsAffordance(userAffordances, sn.affordance)) {
//       //need has a user, but lets see if time to kick them out
//       if (sn.notifiedUsers.length > 0) {
//         const lastNotified = Locations.findOne({ uid: sn.notifiedUsers[0] }).lastNotifiedl;
//         const timeSinceUserLastNotified = Date.now() - lastNotified;
//
//         // time in minutes since they were asked to participate in any experience
//         if (timeSinceUserLastNotified > 30 * 60000) {
//           removeUserFromExperience(sn.notifiedUsers[0], incident.experienceId, 2)
//         } else {
//           //we have a user already for this need, skip and see if the next one is open
//           return false;
//         }
//       }
//       const numberDone = Submissions.find({
//         incidentId: incident._id,
//         situationNeed: sn.name
//       }).count();
//
//       if (numberDone < minParticipation) {
//         minSituationNeed = sn.name;
//       }
//     }
//   });
//
//   if (minSituationNeed != null) {
//     addUserToSituationNeed(uid, incidentId, minSituationNeed);
//     return true;
//   }
//
//   return false;
// };
//
// const addUserToSituationNeed = (uid, incidentId, situationNeedName) => {
//   const experience = Experiences.findOne({ activeIncident: incidentId });
//   const experienceId = experience._id;
//
//   //add active experience to the user
//   Cerebro.setActiveExperiences(uid, experienceId);
//
//   //add user to the incident
//   Incidents.update(
//     { _id: incidentId, 'situationNeeds.name': situationNeedName },
//     {
//       $push:
//         { 'situationNeeds.$.notifiedUsers': uid }
//     }
//   );
//
//   //notify the user & mark as notified
//   Locations.update({ uid: uid }, { $set: { 'lastNotification': Date.now() } });
//
//   //add notification to notification log
//   const userLocation = Locations.findOne({ uid: uid });
//   NotificationLog.insert({
//     userId: uid,
//     task: situationNeedName,
//     lat: userLocation.lat,
//     lng: userLocation.lng,
//     experienceId: experienceId,
//     incidentId: incidentId
//   });
//
//   //send notification
//   Cerebro.notify({
//     userId: uid,
//     experienceId: experienceId,
//     subject: 'Event ' + experience.name + ' is starting!',
//     text: experience.notificationText,
//     route: 'apiCustom'
//   });
// };
//
// const removeUserFromExperience = (uid, experienceId, incidentId, situationNeedName) => {
//   //remove the user from the incident
//   console.log('removeing the user');
//
//   Incidents.update({ _id: incidentId, 'situationNeeds.name': situationNeedName },
//     {
//       $pull:
//         { 'situationNeeds.$.notifiedUsers': uid }
//     });
//
//   //remove the experience from the user
//   Meteor.users.update({ _id: uid },
//     {
//       $pull:
//         { 'profile.activeExperiences': experienceId }
//     }
//   );
// };
//
// export const removeUserAfterTheyParticipated = (uid, experienceId) => {
//   const incident = Incidents.findOne({ experienceId: experienceId });
//
//   _.forEach(incident.situationNeeds, (sn) => {
//     console.log(sn.name);
//     if (_.contains(sn.notifiedUsers, uid)) {
//       removeUserFromExperience(uid, experienceId, incident._id, sn.name);
//       return false;
//     }
//   });
// };
//
// const removeUserFromExperienceAfterTheyMoved = (uid, experienceId) => {
//   const userAffordances = Locations.findOne({ uid: uid }).affordances;
//   const incident = Incidents.findOne({ experienceId: experienceId });
//   const wait = 5 * 60 * 1000; //WAIT LAG (in minutes) FOR AFTER A USER LEAVES A SITUATION
//
//   Meteor.setTimeout(() => {
//     console.log('removing users');
//
//     _.forEach(incident.situationNeeds, (sn) => {
//       if (_.contains(sn.notifiedUsers, uid)) {
//         if (!containsAffordance(userAffordances, sn.affordance)) {
//           console.log('found the one to remove from!');
//           removeUserFromExperience(uid, experienceId, incident._id, sn.name);
//
//           // a user will only be in one situation need, so we can break from the loop
//           return false;
//         }
//       }
//     });
//   }, wait)
// };
//
//
// // METHODS FOR AFFORDANCE SEARCH
// const containsAffordance = (userAffordances, searchAffordances) => {
//   // && affordances
//   if (searchAffordances.search(' and ') > 0) {
//     return andAffordances(userAffordances, searchAffordances);
//   }
//   // || affordances
//   else if (searchAffordances.search(' or ') > 0) {
//     return orAffordances(userAffordances, searchAffordances);
//   }
//   // single affordance
//   else {
//     return (_.contains(userAffordances, searchAffordances));
//   }
// };
//
// const andAffordances = (userAffordances, searchAffordances) => {
//   let affordances = searchAffordances.split(' and ');
//   let differences = _.difference(affordances, userAffordances);
//
//   return differences.length === 0;
// };
//
// const orAffordances = (userAffordances, searchAffordances) => {
//   let affordances = searchAffordances.split(' or ');
//   let contains = false;
//
//   _.forEach(affordances, (currAffordance) => {
//     if (_.contains(userAffordances, currAffordance)) {
//       contains = true;
//       return false;
//     }
//   });
//
//   return contains;
// };
