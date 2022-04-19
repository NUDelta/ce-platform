import { Meteor } from 'meteor/meteor';
import { Push } from 'meteor/nudelta2015:push';
import { log } from '../../logs.js';
import { CONFIG } from '../../config.js';
import {Submissions} from "../../OCEManager/currentNeeds";

/**
 * _sendPush - sends a notification to the given user
 *
 * @param  {_id}    userIds      user _id
 * @param  {string} subject      title for the notification
 * @param  {string} text         body for the notification
 * @param  {string} route        the base route the notification should link
 *                                  to, currently our base route is "apiCustom", see imports/startup/client/router.js
 * @param  {_id}    experienceId _id for the experience so it can be added to
 *                                  the end of the route so the notification links to the correct page
 */
/**
 * // TODO: fill out notify documentation
 * @param uids
 * @param iid
 * @param subject
 * @param text
 * @param route
 */
export const notifyForParticipating = function (uids, iid, subject, text, route, notificationID) {
  //TODO: i think that route shouldn't just be "apicustom", but "apicustom/incidentId/need"
  // so the notification links directly to the experience
  const lastNotifiedKey = `profile.lastNotified.${notificationID}`;

  if(uids.length !== 0){
    Meteor.users.update({
      _id: { $in: uids }
    }, {
      $set: {
        [lastNotifiedKey]: Date.now()
      }
    }, {
      multi: true
    });

    _sendPush(uids, subject, text, route, iid, true);
  }
};

/**
 * Sends an additional notification in the chance that the person was available, but lost the opportunity
 * to participate.
 * TODO(rlouie): For transparency, send users to a route that explains what the situation that they missed was.
 *
 * @param uids
 */
export const notifyForMissingParticipation = function(uids) {
  // Don't set users profile lastNotified, because this parameter means lastNotified TO participate,
  // where as this notification is an apology

  _sendPush(uids, "Your situation changed!", "You missed a chance to participate.", "/", null, true);
};

export const notify = function (uids, iid, subject, text, route) {
  //TODO: i think that route shouldn't just be "apicustom", but "apicustom/incidentId/need"
  // so the notification links directly to the experience
    _sendPush(uids, subject, text, route, iid, true);
};

/**
 * Used as submission callback, it will notify all users who have submitted to the incident
 *
 * @param subject [String]
 * @param text [String]
 * @return [Function]
 */
export const notifyUsersInIncident = function(subject, text) {
  const functionTemplate = function (sub) {
    let uids = Submissions.find({iid: sub.iid}).fetch().map(function (x) {
      return x.uid;
    });

    notify(uids, sub.iid, '${subject}', '${text}', '/apicustomresults/' + sub.iid + '/' + sub.eid);
  };
  return eval('`'+functionTemplate.toString()+'`');
};

/**
 * Used as submission callback, it will notify all users who have submitted to the Need in the incident
 *
 * @param subject [String]
 * @param text [String]
 * @return [Function]
 */
export const notifyUsersInNeed = function(subject, text) {
  const functionTemplate = function(sub) {
    let uids = Submissions.find({iid: sub.iid, needName: sub.needName}).fetch().map((x) => {
      return x.uid;
    });
    notify(uids, sub.iid, '${subject}', '${text}', '/apicustomresults/' + sub.iid + '/' + sub.eid);
  };
  return eval('`'+functionTemplate.toString()+'`');
};

// Meteor.call('sendNotification', ['6enTAPJMPSH9X4ya6'], 'Are you awake?', 'If you are, open the app to participate.', '/')
Meteor.methods({
  sendNotification(uids, subject, text, route) {
    log.cerebro('Sending manual push notifications to ' + uids);

    _sendPush(uids, subject, text, route, null, false);
  }
});

/**
 * _sendPush - see above!
 *
 * @param  {type} userIds      description
 * @param  {type} subject      description
 * @param  {type} text         description
 * @param  {type} route        description
 * @param  {type} experienceId description
 * @return {type}              description
 */
/**
 * // TODO: fill out _sendPush documentation
 * @param uids
 * @param subject
 * @param text
 * @param route
 * @param iid
 * @param soundP
 * @private
 */
function _sendPush(uids, subject, text, route, iid, soundP) {
  const payload = {
    title: subject,
    text: text,
    iid: iid,
    route: route
  };

  log.cerebro('Sending push notifications to ' + uids);
  log.cerebro(payload);

  let pushUsers = [];
  if (CONFIG.DEBUG_PUSH) {
    log.info(`Debug push enabled. Sending to debug set.`);
    pushUsers = _.intersection(userIds, CONFIG.DEBUG_USERS);
  } else {
    pushUsers = uids
  }

  let notification = {
    from: CONFIG.BUNDLE_IDENTIFIER,
    title: subject,
    text: text,
    badge: 0,
    payload: payload,
    query: {
      userId: { $in: pushUsers }
    }
  };

  if(soundP){
    notification["sound"] = 'airhorn.caf';
    notification["badge"] = 1;

  }

  // attempt to send a push notification
  try {
    Push.send(notification);
    console.log(`Push notification sent successfully`);
  } catch (error) {
    console.error(error);
  }
}

//
// /**
//  * removeAllOldActiveExperiences - THIS SHOULD NOT BE USED, THE FUNCTION
//  *    BELOW SHOULD BE USED INSTEAD! This just removes the given experience
//  *    from the activeExperiences array for all the given users
//  *
//  * @param  {array} userIds      array of _ids for users
//  * @param  {_id}   experienceId _id for an experience
//  */
// /**
//  * // TODO: fill out removeAllOldActiveExperiences documentation
//  * @param userIds
//  * @param experienceId
//  */
// removeAllOldActiveExperiences(userIds, experienceId) {
//   console.log("removeAllOldActiveExperiences", userIds);
//   Meteor.users.update({
//     _id: { $in: userIds }
//   }, {
//     $pull: {
//       'profile.activeExperiences': experienceId
//     }
//   }, {
//     multi: true
//   });
// }
//
//
// /**
//  * removeActiveExperiences - remove an experience from the the
//  *    activeExperiences array for all given users, additionally removes all
//  *    given users from the incident's dictionary of situation needs for the experience
//  *
//  * @param  {array} userIds      array of _ids for users
//  * @param  {_id}   experienceId _id for an experience
//  */
// /**
//  * // TODO: fill out removeActiveExperiences documentation
//  * @param userIds
//  * @param experienceId
//  */
// removeActiveExperiences(userIds, experienceId) {
//   console.log("in remove active inc, ", userIds, experienceId);
//   const incidentId = Experiences.findOne({ _id: experienceId }).activeIncident;
//   console.log("in inc id, ", incidentId);
//
//   const situationNeeds = Incidents.findOne({ _id: incidentId }).situationNeeds;
//   console.log("in inc usermappings, ", situationNeeds);
//
//   _.forEach(userIds, (id) => {
//     _.forEach(situationNeeds, (situationNeed, index) => {
//       if (situationNeed.notifiedUsers.indexOf(id) > -1) {
//         console.log('found the user Id', id);
//
//         const i = situationNeed.notifiedUsers.indexOf(id);
//         console.log('userId index', i);
//
//         situationNeed.availableUsers.splice(i, 1);
//         console.log("we hve updadate an index", userMappings[index])
//       }
//     });
//   });
//
//   console.log("userMappings is now", userMappings);
//   Incidents.update({
//     _id: incidentId
//   }, {
//     $set: {
//       'situationNeeds': situationNeeds
//     }
//   }, (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//     }
//   });
//
//   Meteor.users.update({
//     _id: { $in: userIds }
//   }, {
//     $pull: {
//       'profile.activeExperiences': experienceId
//     }
//   }, {
//     multi: true
//   });
// }
//
//
// /**
//  * addIncidents - adds an incident id to the array of past incidents for
//  *                the given user
//  *
//  * @param  {_id} userId     _id for a user
//  * @param  {_id} incidentId _id for an incident
//  */
// /**
//  * // TODO: fill out addIncidents documentation
//  * @param userId
//  * @param incidentId
//  */
// addIncidents(userId, incidentId) {
//   Meteor.users.update({
//     _id: userId
//   }, {
//     $addToSet: {
//       'profile.pastIncidents': incidentId
//     }
//   });
// }
