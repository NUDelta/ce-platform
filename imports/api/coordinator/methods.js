import { ValidatedMethod } from "meteor/mdg:validated-method";
import { SimpleSchema } from "meteor/aldeed:simple-schema";

import { Assignments } from "./assignments";
import { Availability } from "./availability";
import { Experiences } from "../experiences/experiences.js";
import { Incidents } from "../incidents/incidents.js";
import { Locations } from "../locations/locations.js";
import { Submissions } from "../submissions/submissions.js";
import { Users } from "../users/users.js";
import { numUnfinishedNeeds } from "../submissions/methods";
import { addEmptySubmissionsForNeed } from "../incidents/methods";

import {
  _addActiveIncidentToUsers,
  _removeActiveIncidentFromUsers,
  _removeIncidentFromUsersEntirely
} from "../users/methods";
import { doesUserMatchNeed } from "../experiences/methods";
import { CONFIG } from "../config";

export const getNeedObject = (iid, needName) => {
  let incident = Incidents.findOne(iid);
  if (incident) {
    let currentNeed = incident.contributionTypes.find(function(x) {
      return x.needName === needName;
    });
    return currentNeed;
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
 * @param availabilityDictionary {object} current availabilities as {iid: [need, need], iid: [need]}
 * @return {[object]} array of object from Availability DB
 *  [{iid: string, needs: [{needName: string, users: [uid]}]]
 */
export const updateAvailability = (uid, availabilityDictionary) => {
  let updatedEntries = [];

  let availability = Availability.find().fetch();
  _.forEach(availability, av => {
    let iid = av._id;
    if (!(iid in availabilityDictionary)) {
      return;
      //TODO: does this return actuall prevent it from going into this loop?
    }

    let updatedNeeds = { iid: iid, needUserMaps: [] };

    _.forEach(av.needUserMaps, needUserMap => {
      let needName = needUserMap.needName;

      if (availabilityDictionary[iid].includes(needName)) {
        Availability.update(
          {
            _id: iid,
            "needUserMaps.needName": needName
          },
          {
            $addToSet: { "needUserMaps.$.uids": uid }
          },
          (err, docs) => {
            if (err) {
              console.log("error,", err);
            }
          }
        );

        let newusers = new Set(needUserMap.uids);
        newusers.add(uid);
        updatedNeeds.needUserMaps.push({
          needName: needName,
          uids: [...newusers]
        });
      }
    });

    //console.log('updatedNeeds', updatedNeeds);
    updatedEntries.push(updatedNeeds);
  });

  //console.log('updatedEntries', updatedEntries);
  return updatedEntries;
};

/**
 * ASSIGNMENT DB FUNCTIONS
 */

/**
 * Un-assigns a user to an incident if their location no longer matches
 * Also removes the active experience from the user
 *
 * @param uid {string} user to update assignment for
 * @param affordances {[string]} list of user's affordances as an array of key/values
 */
export const updateAssignmentDbdAfterUserLocationChange = (
  uid,
  affordances
) => {
  let currentAssignments = Assignments.find({
    needUserMaps: {
      $elemMatch: {
        uids: uid
      }
    }
  }).fetch();

  _.forEach(currentAssignments, assignment => {
    _.forEach(assignment.needUserMaps, needUserMap => {
      let matchPredicate = doesUserMatchNeed(
        uid,
        affordances,
        assignment._id,
        needUserMap.needName
      );

      if (!matchPredicate && needUserMap.uids.includes(uid)) {
        let delay = 15;
        if (CONFIG.MODE === "PROD" || CONFIG.MODE === "DEV") {
          delay = 15;
        }

        Meteor.setTimeout(function() {
          adminUpdatesForRemovingUsersToIncidentEntirely(
            [uid],
            assignment._id,
            needUserMap.needName
          );
        }, delay * 60000);
      }
    });
  });
};

/**
 *
 * @param uids {[string]} users to add
 * @param iid {string} incident to add users to
 * @param needName {string} name of need to add users to
 */
export const adminUpdatesForAddingUsersToIncident = (uids, iid, needName) => {
  //TODO: make this function take a single user not an array

  //console.log("adminUpdatesForAddingUsersToIncident", uids, iid, needName);
  _addUsersToAssignmentDb(uids, iid, needName);
  _addActiveIncidentToUsers(uids, iid);
};

/**
 *
 * @param uids {[string]} users to remove
 * @param iid {string} incident to remove users from
 * @param needName {string} name of need to remove users from
 */
// user participated so need to remove from active incidents and add to past incidents
export const adminUpdatesForRemovingUsersToIncident = (uids, iid, needName) => {
  //TODO: make this function take a single user not an array

  _removeUsersFromAssignmentDb(uids, iid, needName);
  _removeActiveIncidentFromUsers(uids, iid);
};

/**
 *
 * @param uids {[string]} users to remove
 * @param iid {string} incident to remove users from
 * @param needName {string} name of need to remove users from
 */
// user location moved but did not participate. remove incident entirely from user
export const adminUpdatesForRemovingUsersToIncidentEntirely = (
  uids,
  iid,
  needName
) => {
  //TODO: make this function take a single user not an array
  _removeUsersFromAssignmentDb(uids, iid, needName);
  _removeIncidentFromUsersEntirely(uids, iid);
};

/**
 * Adds all users in the array to the assignmentDB for the specified need.
 *
 * @param uids {[string]} array of users to remove
 * @param iid {string} incident to add to
 * @param needName {string} need to add user to
 */
const _addUsersToAssignmentDb = (uids, iid, needName) => {
  //TODO: mongo so old can't use each, but maybe better way
  _.forEach(uids, uid => {
    Assignments.update(
      {
        _id: iid,
        "needUserMaps.needName": needName
      },
      {
        $addToSet: { "needUserMaps.$.uids": uid }
      }
    );
  });
};

/**
* Checking if a need fails. If so, mark submissions as failures
* and create fresh submissions to re-try
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

    let incident = Incidents.find({ _id: iid });
    let need = incident.contributionTypes.find(x => {
      x.needName === needName;
    });

    addEmptySubmissionsForNeed(iid, incident.eid, need);
  }
};

/**
 * Removes user from assignmentDB for the specified need.
 *
 * @param uids {[string]} array of users to remove
 * @param iid {string} incident to remove from
 * @param needName {string} need that user is assigned to
 */
const _removeUsersFromAssignmentDb = (uids, iid, needName) => {
  if (uids.length() === 0) {
    return;
  }

  _.forEach(uids, uid => {
    Assignments.update(
      {
        _id: iid,
        "needUserMaps.needName": needName
      },
      {
        $pull: { "needUserMaps.$.uids": uid }
      }
    );
  });

  let assignment = Assignments.find({
    _id: iid,
    "needUserMaps.needName": needName
  });

  let needUserMap = assignment.needUserMaps.find(x => {
    return x.needName === needName;
  });

  if (needUserMap.uids.length() === 0) {
    checkIfNeedFailed(iid, needName);
  }
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
