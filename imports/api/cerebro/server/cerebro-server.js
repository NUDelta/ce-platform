import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { Push } from 'meteor/raix:push';

import { LocationManager } from '../../locations/server/location-manager-server.js';
import { CerebroCore } from '../cerebro-core.js';
import { log } from '../../logs.js';
import { CONFIG, AUTH } from '../../config.js';

const yelpEndpoint = 'http://api.yelp.com/v2/search';

CerebroServer = class CerebroServer extends CerebroCore {
  constructor() {
    super();
  }

  notify({ userIds, experienceId, subject, text, route }) {
    switch(CONFIG.NOTIFY_METHOD) {
      // @Deprecated
      // case CerebroCore.EMAIL:
      //   this._sendEmails(users, server, subject, text);
      //   break;
      case CerebroCore.PUSH:
        this._sendPush(userIds, subject, text, route, experienceId);
        break;
      default:
        log.warn('Invalid notification method set');
        break;
    }
  }

  // @Deprecated
  _sendEmails(users, server, subject, text) {
    log.cerebro('Sending emails.');
    server.unblock();
    users.forEach((user) => {
      this._addActiveExperience(user._id, experienceId);
      Email.send({
        to: user.emails[0].address,
        from: 'shannonnachreiner2012@u.northwestern.edu',
        subject: subject,
        html: text
      });
    });
  }

  _sendPush(userIds, subject, text, route, experienceId) {
    const payload = {
      title: subject,
      text: text,
      experienceId: experienceId,
      route: route
    };

    log.cerebro('Sending push notifications');
    log.cerebro(payload);

    let pushUsers = [];
    if (CONFIG.DEBUG_PUSH) {
      log.info(`Debug push enabled. Sending to debug set.`);
      pushUsers = CONFIG.DEBUG_USERS;
    } else {
      pushUsers = userIds
    }

    Push.send({
      from: 'push',
      title: subject,
      text: text,
      badge: 1,
      sound: 'airhorn.caf',
      payload: payload,
      query: {
        userId: { $in: pushUsers }
      }
    });
  }

  //@Unused
  _broadcastPush(subject, text) {
    log.cerebro('Broadcasting push notifications');
    Push.send({
      from: 'push',
      title: subject,
      text: text,
      badge: 1,
      sound: 'airhorn.caf',
      payload: {
        title: subject,
        text: text,
      },
      query: {
        // this sends to all users
      }
    });
  }

  setActiveExperiences(userIds, experienceId) {
    Meteor.users.update({
      _id: { $in: userIds }
    }, {
      $push: {
        'profile.activeExperiences': experienceId
      }
    }, {
      multi: true
    });
  }

  removeActiveExperiences(userIds, experienceId) {
    Meteor.users.update({
      _id: { $in: userIds }
    }, {
      $pull: {
        'profile.activeExperiences': experienceId
      }
    }, {
      multi: true
    });
  }

  addIncidents(userIds, incidentId) {
    Meteor.users.update({
      _id: { $in: userIds }
    }, {
      $push: {
        'profile.pastIncidents': incidentId
      }
    }, {
      multi: true
    });
  }

  liveQuery(locationType, options = {}) {
    options.location = options.location || 'Evanston+IL';
    options.locationRadius = options.locationRadius || 200;
    options.radius = options.radius || 20;
    options.limit = options.limit || 20;

    const locations = _.map(
      this._yelpQuery(locationType, options.location, options.locationRadius, options.limit),
      (business) => {
        return {
          lat: business.location.coordinate.latitude,
          lng: business.location.coordinate.longitude
        }
      });
    return LocationManager.findUsersNearLocations(locations, options.radius);
  }

  pointsQuery(locations, options = {}) {
    options.radius = options.radius || 200;
    return LocationManager.findUsersNearLocations(locations);
  }

  _yelpQuery(locationType, location, radius, limit) {
    // TODO: refactor this
    // TODO: add support for *any* location
    // TODO: might want to unblock this
    let params = _.clone(AUTH);
    params.category_filter = locationType;

    if (location.lat && location.lng) {
      params.ll = `${location.lat},${location.lng}`;
    } else {
      params.location = location;
    }

    params.limit = limit;
    params.radius = radius;

    let config = {
      consumerKey: AUTH.oauth_consumer_key,
      secret: AUTH.oauth_consumer_secret
    }, urls = {
      requestToken: yelpEndpoint,
      accessToken: AUTH.oauth_token
    }, oauthBinding = new OAuth1Binding(config, urls);
    oauthBinding.accessTokenSecret = AUTH.accessTokenSecret;
    let headers = oauthBinding._buildHeader();

    // TODO: check if this is blocking -- fix up if it is
    return oauthBinding._call('GET', yelpEndpoint, headers, params).data.businesses;
  }

  query(userQuery) {
    let result = {};
    result.$or = this._queryTransform(userQuery.$any);
    result.$and = this._queryTransform(userQuery.$and);
    return Meteor.users.find(_.pick(result, arr => arr.length > 0));
  }

  _queryTransform(query) {
    let output = [];
    for(let attribute in query) {
      let pair = {},
        attributeVal = query[attribute],
        key = `profile.qualifications.${attribute}`,
        value = (attributeVal.constructor === Array) ? { $in: attributeVal } : attributeVal;
      pair[key] = value;
      output.push(pair);
    }
    return output;
  }

};

export const Cerebro = new CerebroServer();

Cerebro.PUSH = CerebroCore.PUSH;
Cerebro.EMAIL = CerebroCore.EMAIL;
