import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { _ } from 'meteor/underscore';

import { Cerebro } from '../cerebro/server/cerebro-server.js';
import { Experiences } from '../experiences/experiences.js';
import { Incidents } from '../incidents/incidents.js';
import { Locations } from '../locations/locations.js';
import { Submissions } from '../submissions/submissions.js';
import { NotificationLog } from '../cerebro/cerebro-core.js';

import { Users } from '../users/users.js';
import { _addActiveIncidentToUsers, _removeActiveIncidentFromUsers } from '../users/methods';
import { Assignments } from './assignments';
import { Availability } from './availability';
import { doesUserMatchNeed } from '../experiences/methods';
import { getNeedFromIncidentId } from '../incidents/methods';


/**
 * Runs the coordinator after a location update has occured.
 *
 * @param uid {string} user whose location just updated
 * @param availabilityDictionary {object} current availabilities as {iid: [need, need], iid: [need]}
 */
export const runCoordinatorAfterUserLocationChange = (uid, availabilityDictionary) => {
  // update availabilities of users and check if any experience incidents can be run
  let updatedAvailability = updateAvailability(uid, availabilityDictionary);
  console.log('updatedAvailability', updatedAvailability[0].needUserMaps);

  let incidentsWithUsersToRun = checkIfThreshold(updatedAvailability);
  console.log('incidentsWithUsersToRun', incidentsWithUsersToRun);

  // add users to incidents to be run
  runNeedsWithThresholdMet(incidentsWithUsersToRun);
};

/**
 * Sends notifications to the users, adds to the user's active experience list,
 *  marks in assignment DB 2b
 * @param incidentsWithUsersToRun {object} needs to run in format of
 *  { iid: { need: [uid, uid], need:[uid] }
 */
const runNeedsWithThresholdMet = (incidentsWithUsersToRun) => {
  _.forEach(incidentsWithUsersToRun, (needUserMapping, iid) => {
    console.log('needUserMapping', needUserMapping);
    console.log('iid', iid);

    let incident = Incidents.findOne(iid);
    let experience = Experiences.findOne(incident.eid);
    console.log('incidents', incident);

    _.forEach(needUserMapping, (uids, needName) => {
      //administrative updates
      adminUpdatesForAddingUsersToIncident(uids, iid, needName);

      let route = 'apiCustom/' + iid + '/' + needName;
      Cerebro.notify(uids, iid, 'Event ' + experience.name + ' is starting!',
                      experience.notificationText, route);
    });
  });
};

/**
 * Given a set of users, it chooses a subset of the given number
 *  based on how many other experiences users are available for.
 *
 * @param uids {[string]} uids available for the incident
 * @param numberPeopleNeeded {int} number of users we need to choose for the incident
 * @returns {[string]} uids chosen for the incident
 */
const chooseUsers = (uids, numberPeopleNeeded) => {
  let userPopularityMap = {};
  _.forEach(uids, (uid) => {
    userPopularityMap[uid] = Availability.find({
      'needUserMaps': {
        '$elemMatch': {
          'uids': uid
        }
      }
    }).count();

  });

  uids.sort(function (a, b) {
    return userPopularityMap[a] > userPopularityMap[b];
  });

  return uids.slice(0, numberPeopleNeeded);
};

/**
 * Check if an experience need can run e.g. it has the required number of people.
 * This may call other functions that, for example, check for relationship, co-located, etc.
 *
 * @param updatedIncidentsAndNeeds {[object]} array of object from Availability DB
 *  [{iid: string, needs: [{needName: string, users: [uid]}]] TODO: update this description
 * @returns {{ iid: {need: [uid, uid], need: [uid] } } }
 */
const checkIfThreshold = (updatedIncidentsAndNeeds) => {
  //these are not needUsermaps
  console.log('updatedIncidentsAndNeeds', updatedIncidentsAndNeeds[0]);

  let incidentsWithUsersToRun = {};
  _.forEach(updatedIncidentsAndNeeds, (incidentMapping) => {
    incidentsWithUsersToRun[incidentMapping.iid] = {};

    _.forEach(incidentMapping.needUserMaps, (needUserMap) => {
      // get need object for current iid/current need and number of people
      console.log('needUserMap', incidentMapping.needUserMaps);

      let needObject = getNeedFromIncidentId(incidentMapping.iid, needUserMap.needName);
      let numberPeopleNeeded = needObject.situation.number;
      console.log('needObject', needObject);

      console.log('numbers', needUserMap.uids.length, numberPeopleNeeded);
      if (needUserMap.uids.length >= numberPeopleNeeded) {
        incidentsWithUsersToRun[incidentMapping.iid][needUserMap.needName] =
          chooseUsers(needUserMap.uids, numberPeopleNeeded);
      }
    });
  });

  console.log('incidentsWithUsersToRun', incidentsWithUsersToRun);

  return incidentsWithUsersToRun; //{iid: {need: [uid, uid], need: [uid]}}
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
  console.log('updateAvailability', uid, availabilityDictionary);
  let updatedEntries = [];

  //remove user from all entries
  let availability = Availability.find().fetch();
  // TODO: refactor with _.forEach
  for (let i in availability) {
    let av = availability[i];
    console.log(av._id);

    let iid = av._id;
    if (!(iid in availabilityDictionary)) {
      continue;
    }

    let updatedNeeds = { iid: iid, 'needUserMaps': [] };

    // TODO: refactor with _.forEach
    for (let j in av.needUserMaps) {
      console.log(av.needUserMaps[j]);
      let needName = av.needUserMaps[j].needName;

      if (availabilityDictionary[iid].indexOf(needName) !== -1) {
        Availability.update({
          _id: iid,
          'needUserMaps.needName': needName
        }, {
          $addToSet: {'needUserMaps.$.uids': uid}
        }, (err, docs) => {
          if (err) {
            console.log('error,', err);
          } else {
            console.log('add worked', docs, needName);

          }
        });

        let newusers = av.needUserMaps[j].uids;
        newusers.push(uid);

        updatedNeeds.needUserMaps.push({needName: needName, uids:newusers});

      } else {
        Availability.update({
          _id: iid,
          'needUserMaps.needName': needName
        }, {
          $pull: {'needUserMaps.$.uids': uid}
        }, (err) => {
          if (err) {
            console.log('error,', err);
          } else {
          }
        });
      }

    }
    console.log('updatedNeeds', updatedNeeds);
    updatedEntries.push(updatedNeeds);

  }
  console.log('updatedEntries', updatedEntries);
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
 * @param lat {float} latitude of user's new location
 * @param lng {float} longitude of user's new location
 */
export const updateAssignmentDbdAfterUserLocationChange = (uid, lat, lng) => {
  let currentAssignments = Assignments.find({
    'needUserMaps': {
      '$elemMatch': {
        'uids': uid
      }
    }
  }).fetch();

  _.forEach(currentAssignments, (assignment) => {
    _.forEach(assignment.needUserMaps, (needUserMap) => {
      let matchPredicate = doesUserMatchNeed(uid, lat, lng, assignment._id, needUserMap.needName);

      if (!matchPredicate) {
        adminUpdatesForRemovingUsersToIncident([uid], assignment._id, needUserMap.needName);
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
const adminUpdatesForAddingUsersToIncident = (uids, iid, needName) => {
  _addUsersToAssignmentDb(uids, iid, needName);
  _addActiveIncidentToUsers(uids, iid);
};

/**
 *
 * @param uids {[string]} users to remove
 * @param iid {string} incident to remove users from
 * @param needName {string} name of need to remove users from
 */
const adminUpdatesForRemovingUsersToIncident = (uids, iid, needName) => {
  _removeUsersFromAssignmentDb(uids, iid, needName);
  _removeActiveIncidentFromUsers(uids, iid);
};

/**
 * Adds all users in the array to the assignmentDB for the specified need.
 *
 * @param uids {[string]} array of users to remove
 * @param iid {string} incident to add to
 * @param needName {string} need to add user to
 */
const _addUsersToAssignmentDb = (uids, iid, needName) => {
  Assignments.update({
    _id: iid,
    'needUserMaps.needName': needName
  }, {
    $push: { 'needUserMaps.$.uids': { $each: uids } }
  });
};

/**
 * Removes user from assignmentDB for the specified need.
 *
 * @param uids {[string]} array of users to remove
 * @param iid {string} incident to remove from
 * @param needName {string} need that user is assigned to
 */
const _removeUsersFromAssignmentDb = (uids, iid, needName) => {
  Assignments.update({
    _id: iid,
    'needUserMaps.needName': needName
  }, {
    $pull: { 'needUserMaps.$.uids': { $each: uids } }
  });
};

const locationCursor = Locations.find();

/**
 * a DB listener that responds when a user's location field changes, this includes
 *    lat/long and the affordance array
 */
const locationHandle = locationCursor.observeChanges({
  changed(id, fields) {
    console.log('the location field changed', fields);

    if ('lastNotification' in fields) {
      return;
    }

    //check if now that they've moved they...
    const location = Locations.findOne({ _id: id });
    const uid = location.uid;

    //need to be removed from an experience they're currently in
    const user = Meteor.users.findOne({ _id: uid });
    const usersExperiences = user.profile.activeExperiences;
    if (usersExperiences) {
      usersExperiences.forEach((experienceId) => {
        removeUserFromExperienceAfterTheyMoved(uid, experienceId)
      })
    }

    if ('affordances' in fields) {
      AvailabilityLog.insert({
        uid: uid,
        lastParticipated: user.profile.lastParticipated,
        lastNotified: location.lastNotification,
        affordances: location.affordances,
        lat: location.lat,
        lng: location.lng,
        now: Date.now()
      });
    }

    //check if user to available to participate right now
    if (!userIsAvailableToParticipate(user, location)) {
      console.log('user participated too recently');
      return;
    }

    //can be added to a new experience
    const allExperiences = Experiences.find({ activeIncident: { $exists: true } }).fetch();

    //could randomize the order of experiences
    console.log('at the top of the for loops');
    const shuffledExperiences = _.shuffle(allExperiences);

    for (let i in shuffledExperiences) {
      const experience = shuffledExperiences[i];
      const result = attemptToAddUserToIncident(uid, experience.activeIncident);
      console.log('result', result);
      if (result) {
        console.log('We found an experience for the user and now are stopping');
        break;
      }
    }
  }
});


/**
 * userIsAvailableToParticipate - checks if a user can participate or if they not
 *    available to participate because they were notified too recently
 *
 * @param  user {User} user document
 * @param  location {Location} location location document for that user
 * @return {boolean} true if a user can participate
 */
const userIsAvailableToParticipate = (user, location) => {
  const waitTimeAfterNotification = 30 * 60000; //first number is the number of minutes
  const waitTimeAfterParticipating = 60 * 60000;//first number is the number of minutes

  const lastParticipated = user.profile.lastParticipated;
  const lastNotified = location.lastNotification;

  const now = Date.now();

  let userNotYetNotified = lastParticipated === null;
  const userNotifiedTooRecently = (now - lastNotified) < waitTimeAfterNotification;

  let userNotYetParticipated = lastNotified === null;
  const userParticipatedTooRecently = (now - lastParticipated) < waitTimeAfterParticipating;

  return !((!userNotYetNotified && userNotifiedTooRecently) ||
            (!userNotYetParticipated && userParticipatedTooRecently));
};

const attemptToAddUserToIncident = (uid, incidentId) => {
  const incident = Incidents.findOne({ _id: incidentId });
  const userAffordances = Locations.findOne({ uid: uid }).affordances;
  const minParticipation = Math.min(); //this is infinity
  let minSituationNeed = null;

  incident.situationNeeds.forEach((sn) => {
    if (sn.done === false && containsAffordance(userAffordances, sn.affordance)) {
      //need has a user, but lets see if time to kick them out
      if (sn.notifiedUsers.length > 0) {
        const lastNotified = Locations.findOne({ uid: sn.notifiedUsers[0] }).lastNotifiedl;
        const timeSinceUserLastNotified = Date.now() - lastNotified;

        // time in minutes since they were asked to participate in any experience
        if (timeSinceUserLastNotified > 30 * 60000) {
          removeUserFromExperience(sn.notifiedUsers[0], incident.experienceId, 2)
        } else {
          //we have a user already for this need, skip and see if the next one is open
          return false;
        }
      }
      const numberDone = Submissions.find({
        incidentId: incident._id,
        situationNeed: sn.name
      }).count();

      if (numberDone < minParticipation) {
        minSituationNeed = sn.name;
      }
    }
  });

  if (minSituationNeed != null) {
    addUserToSituationNeed(uid, incidentId, minSituationNeed);
    return true;
  }

  return false;
};

const addUserToSituationNeed = (uid, incidentId, situationNeedName) => {
  const experience = Experiences.findOne({ activeIncident: incidentId });
  const experienceId = experience._id;

  //add active experience to the user
  Cerebro.setActiveExperiences(uid, experienceId);

  //add user to the incident
  Incidents.update(
    {_id: incidentId, 'situationNeeds.name': situationNeedName},
    {
      $push:
        {'situationNeeds.$.notifiedUsers': uid}
    }
  );

  //notify the user & mark as notified
  Locations.update({uid: uid}, {$set: {'lastNotification': Date.parse(new Date())}});

  //add notification to notification log
  const userLocation = Locations.findOne({ uid: uid });
  NotificationLog.insert({
    userId: uid,
    task: situationNeedName,
    lat: userLocation.lat,
    lng: userLocation.lng,
    experienceId: experienceId,
    incidentId: incidentId
  });

  //send notification
  Cerebro.notify({
    userId: uid,
    experienceId: experienceId,
    subject: 'Event ' + experience.name + ' is starting!',
    text: experience.notificationText,
    route: 'apiCustom'
  });
};

const removeUserFromExperience = (uid, experienceId, incidentId, situationNeedName) => {
  //remove the user from the incident
  console.log('removeing the user');

  Incidents.update({_id: incidentId, 'situationNeeds.name': situationNeedName},
    {
      $pull:
        {'situationNeeds.$.notifiedUsers': uid}
    });

  //remove the experience from the user
  Meteor.users.update({_id: uid},
    {
      $pull:
        {'profile.activeExperiences': experienceId}
    }
  );
};

export const removeUserAfterTheyParticipated = (uid, experienceId) => {
  const incident = Incidents.findOne({ experienceId: experienceId });

  for (let i in incident.situationNeeds) {
    const sn = incident.situationNeeds[i];
    console.log(sn.name);
    if (_.contains(sn.notifiedUsers, uid)) {
      removeUserFromExperience(uid, experienceId, incident._id, sn.name);
      break;
    }
  }
};

const removeUserFromExperienceAfterTheyMoved = (uid, experienceId) => {
  const userAffordances = Locations.findOne({ uid: uid }).affordances;
  const incident = Incidents.findOne({ experienceId: experienceId });
  const wait = 5 * 60 * 1000; //WAIT LAG (in minutes) FOR AFTER A USER LEAVES A SITUATION

  Meteor.setTimeout(() => {
    console.log('removing users');

    // TODO: refactor with _.forEach
    for (let i in incident.situationNeeds) {
      const sn = incident.situationNeeds[i];

      if (_.contains(sn.notifiedUsers, uid)) {
        if (!containsAffordance(userAffordances, sn.affordance)) {
          console.log('found the one to remove from!');
          removeUserFromExperience(uid, experienceId, incident._id, sn.name);

          //a user will only be in one situation need, so we can break
          break;
        }
      }
    }
  }, wait)
};


// METHODS FOR AFFORDANCE SEARCH
const containsAffordance = (userAffordances, searchAffordances) => {
  // && affordances
  if (searchAffordances.search(' and ') > 0) {
    return andAffordances(userAffordances, searchAffordances);
  }
  // || affordances
  else if (searchAffordances.search(' or ') > 0) {
    return orAffordances(userAffordances, searchAffordances);
  }
  // single affordance
  else {
    return (_.contains(userAffordances, searchAffordances));
  }
};

const andAffordances = (userAffordances, searchAffordances) => {
  let affordances = searchAffordances.split(' and ');
  let differences = _.difference(affordances, userAffordances);

  return differences.length === 0;
};

const orAffordances = (userAffordances, searchAffordances) => {
  let affordances = searchAffordances.split(' or ');
  let contains = false;

  for (i = 0; i < affordances.length; i++) {
    let currAffordance = affordances[i];

    if (_.contains(userAffordances, currAffordance)) {
      contains = true;
      break;
    }
  }

  return contains;
};
