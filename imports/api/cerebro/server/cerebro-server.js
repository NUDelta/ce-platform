import { Meteor } from 'meteor/meteor';
import { Push } from 'meteor/raix:push';
import { CerebroCore } from '../cerebro-core.js';
import { log } from '../../logs.js';
import { CONFIG, AUTH } from '../../config.js';
import { Incidents } from '../../incidents/incidents.js';
import { Experiences } from "../../experiences/experiences";

CerebroServer = class CerebroServer extends CerebroCore {
  constructor() {
    super();
  }
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
  notify(uids, iid, subject, text, route) {
    //i think that route shouldn't just be "apicustom", but "apicustom/incidentId/need"
    // so the notification links directly to the experience
    switch (CONFIG.NOTIFY_METHOD) {
      case CerebroCore.PUSH:
        this._sendPush(uids, subject, text, route, iid);
        break;
      default:
        log.warn('Invalid notification method set');
        break;
    }
  }


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
   * @private
   */
  _sendPush(uids, subject, text, route, iid) {
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

    Push.send({
      from: 'push',
      title: subject,
      text: text,
      badge: 1,
      sound: 'airhorn.caf',
      payload: payload,
      query: {
        userId: {$in: pushUsers}
      }
    });
  }


  /**
   * removeAllOldActiveExperiences - THIS SHOULD NOT BE USED, THE FUNCTION
   *    BELOW SHOULD BE USED INSTEAD! This just removes the given experience
   *    from the activeExperiences array for all the given users
   *
   * @param  {array} userIds      array of _ids for users
   * @param  {_id}   experienceId _id for an experience
   */
  /**
   * // TODO: fill out removeAllOldActiveExperiences documentation
   * @param userIds
   * @param experienceId
   */
  removeAllOldActiveExperiences(userIds, experienceId) {
    console.log("removeAllOldActiveExperiences", userIds);
    Meteor.users.update({
      _id: {$in: userIds}
    }, {
      $pull: {
        'profile.activeExperiences': experienceId
      }
    }, {
      multi: true
    });
  }


  /**
   * removeActiveExperiences - remove an experience from the the
   *    activeExperiences array for all given users, additionally removes all
   *    given users from the incident's dictionary of situation needs for the experience
   *
   * @param  {array} userIds      array of _ids for users
   * @param  {_id}   experienceId _id for an experience
   */
  /**
   * // TODO: fill out removeActiveExperiences documentation
   * @param userIds
   * @param experienceId
   */
  removeActiveExperiences(userIds, experienceId) {
    console.log("in remove active inc, ", userIds, experienceId);
    const incidentId = Experiences.findOne({ _id: experienceId }).activeIncident;
    console.log("in inc id, ", incidentId);

    const situationNeeds = Incidents.findOne({ _id: incidentId }).situationNeeds;
    console.log("in inc usermappings, ", situationNeeds);

    _.forEach(userIds, (id) => {
      _.forEach(situationNeeds, (situationNeed, index) => {
        if (situationNeed.notifiedUsers.indexOf(id) > -1) {
          console.log('found the user Id', id);

          const i = situationNeed.notifiedUsers.indexOf(id);
          console.log('userId index', i);

          situationNeed.availableUsers.splice(i, 1);
          console.log("we hve updadate an index", userMappings[index])
        }
      });
    });

    console.log("userMappings is now", userMappings);
    Incidents.update({
      _id: incidentId
    }, {
      $set: {
        'situationNeeds': situationNeeds
      }
    }, (err) => {
      if (err) {
        console.log(err);
      } else {
      }
    });

    Meteor.users.update({
      _id: {$in: userIds}
    }, {
      $pull: {
        'profile.activeExperiences': experienceId
      }
    }, {
      multi: true
    });
  }


  /**
   * addIncidents - adds an incident id to the array of past incidents for
   *                the given user
   *
   * @param  {_id} userId     _id for a user
   * @param  {_id} incidentId _id for an incident
   */
  /**
   * // TODO: fill out addIncidents documentation
   * @param userId
   * @param incidentId
   */
  addIncidents(userId, incidentId) {
    Meteor.users.update({
      _id: userId
    }, {
      $addToSet: {
        'profile.pastIncidents': incidentId
      }
    });
  }
};

export const Cerebro = new CerebroServer();

Cerebro.PUSH = CerebroCore.PUSH;
Cerebro.EMAIL = CerebroCore.EMAIL;
