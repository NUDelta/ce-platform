import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { Push } from 'meteor/raix:push';

import { LocationManager } from '../../locations/server/location-manager-server.js';
import { CerebroCore } from '../cerebro-core.js';

let auth = {
  oauth_consumer_key: "-_zoLpC8DASmu7ql13IQIw",
  oauth_consumer_secret: "2t9PyZDkOvykIWYvwWCy0uWoTug",
  oauth_token: "kkU3B_Abdf30sx5tVB2fkFVbr3gzxMZO",
  accessTokenSecret: "GGs0J7wWWshnazwoOHB01j3A2sM",
  oauth_signature_method: "HMAC-SHA1"
}, yelpEndpoint = 'http://api.yelp.com/v2/search';

CerebroServer = class CerebroServer extends CerebroCore {
  constructor() {
    super();
    this.DEBUG_PUSH = false;
    this.DEBUG_USERS = [];
  }

  notify(users, server, subject, text, experienceId) {
    // this needs refactoring into cerebro base
    switch(this.NOTIFY_METHOD) {
      case CerebroCore.EMAIL:
        this._sendEmails(users, server, subject, text);
        break;
      case CerebroCore.PUSH:
        this._sendPush(users, server, subject, text, experienceId);
        break;
      default:
        console.log('[CEREBRO-SERVER] Invalid notification method was set.');
        break;
    }
  }

  _sendEmails(users, server, subject, text) {
    console.log('[CEREBRO-SERVER] Sending emails.');
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

  _sendPush(users, server, subject, text, experienceId) {
    console.log('[CEREBRO-SERVER] Sending push notifications.');
    let userIds = _.map(users, user => user._id);
    if (this.DEBUG_PUSH) {
      userIds = this.DEBUG_USERS;
    }
    Push.send({
      from: 'push',
      title: subject,
      text: text,
      badge: 1, // TODO: not sure what this is
      sound: 'airhorn.caf',
      payload: {
        title: subject,
        text: text,
        historyId: 'result'
      },
      query: {
        userId: { $in: userIds }
      }
    });

    userIds.forEach((userId) => {
      this._addActiveExperience(userId, experienceId);
    })
  }

  _broadcastPush(subject, text) {
    Push.send({
      from: 'push',
      title: subject,
      text: text,
      badge: 1,
      sound: 'airhorn.caf',
      payload: {
        title: subject,
        text: text,
        historyId: 'result'
      },
      query: {
        // this sends to all users
      }
    });
  }

  _addActiveExperience(userId, experienceId) {
    Meteor.users.update({_id: userId}, {$push: {'profile.activeExperiences': experienceId}}, {multi: true});
  }

  liveQuery(locationType, options = {}) {
    options.location = options.location || 'Evanston+IL';
    options.radius = options.radius || 200;
    options.limit = options.limit || 20;

    let locations = _.map(this._yelpQuery(locationType, options.location, options.radius, options.limit),
      business => business.location.coordinate);
    locations = _.map(locations, (location) => {
      return { lat: location.latitude, lng: location.longitude }
    });
    return LocationManager.findUsersNearLocations(locations);
  }

  pointsQuery(locations, options = {}) {
    options.radius = options.radius || 200;
    return LocationManager.findUsersNearLocations(locations);
  }

  _yelpQuery(locationType, location='Evanston+IL', radius=200, limit=5) {
    // TODO: refactor this
    // TODO: add support for *any* location
    // TODO: might want to unblock this
    let params = _.clone(auth);
    params.category_filter = locationType;

    if (location.lat && location.lng) {
      params.ll = `${location.lat},${location.lng}`;
    } else {
      params.location = location;
    }

    params.limit = limit;
    params.radius = radius;

    let config = {
      consumerKey: auth.oauth_consumer_key,
      secret: auth.oauth_consumer_secret
    }, urls = {
      requestToken: yelpEndpoint,
      accessToken: auth.oauth_token
    }, oauthBinding = new OAuth1Binding(config, urls);
    oauthBinding.accessTokenSecret = auth.accessTokenSecret;
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
