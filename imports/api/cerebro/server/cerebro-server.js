import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { Push } from 'meteor/raix:push';

import { LocationManager } from '../../locations/server/location-manager-server.js';
import { CerebroCore } from '../cerebro-core.js';
import { log } from '../../logs.js';
import { CONFIG, AUTH } from '../../config.js';

import { Incidents } from '../../incidents/incidents.js';


const yelpEndpoint = 'http://api.yelp.com/v2/search';

CerebroServer = class CerebroServer extends CerebroCore {
  constructor() {
    super();
  }

  // experienceId could be experience OR incident id
  notify({ userIds, experienceId, subject, text, route }) {

    switch(CONFIG.NOTIFY_METHOD) {
      // @Deprecated
      // case CerebroCore.EMAIL:
      //   this._sendEmails(users, server, subject, text);
      //   break;
      case CerebroCore.PUSH:
        console.log("notify called with uerIds", userIds)
        if(userIds.length > 0){
          this._sendPush(userIds, subject, text, route, experienceId);
        }
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

    log.cerebro('Sending push notifications to ' + userIds);
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
      $addToSet: {
        'profile.activeExperiences': experienceId
      }
    }, {
      multi: true
    });
  }

  removeAllOldActiveExperiences(userIds, experienceId){
    Meteor.users.update({
      _id: { $nin: userIds }
    }, {
      $pull: {
        'profile.activeExperiences': experienceId
      }
    }, {
      multi: true
    });

  }


  removeActiveExperiences(userIds, experienceId) {
    console.log("in remove active inc, ", userIds, experienceId )
    var incidentId = Experiences.findOne({_id:experienceId}).activeIncident;
    console.log("in inc id, ",incidentId )

    var situationNeeds = Incidents.findOne({_id:incidentId}).situationNeeds;
    console.log("in inc usermappings, ", situationNeeds )

    userIds.forEach((id)=>{
      for(index in situationNeeds){
        if(situationNeeds[index].availableUsers.indexOf(id) > -1){
          console.log("found the user Id", id)
          var i = situationNeeds[index].availableUsers.indexOf(id);
          console.log(i)
          situationNeeds[index].availableUsers.splice(i, 1)
        }
      }
    })
    Incidents.update({
      _id: incidentId
    }, {
      $set: {
        'situationNeeds': situationNeeds
      }
    }, (err, docs) => {
      if (err) { console.log(err); }else{ console.log("worked", docs)}
    });


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
      $addToSet: {
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
    // TODO: paginate
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

  getSubmissionLocation(latStr, lngStr) {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    if (lat <= 42.062833 && lat > 42.055657 && lng >= -87.679559 && lng < -87.669491) {
      return "NU North Campus";
    } else if (lat <= 42.055657 && lat > 42.048593 && lng >= -87.679559 && lng < -87.669491) {
      return "NU South Campus";
    } else if (lat <= 42.078932 && lat > 42.019184 && lng >= -87.711036 && lng < -87.669491) {
      return "Off-campus Evanston";
    } else if (lat <= 42.1796 && lat > 41.683914 && lng >= -87.940299 && lng < -87.669491) {
      return "Greater Chicago, IL Area";
    } else if (lat <= 43.153463 && lat > 42.696882 && lng >= -79.038439 && lng < -78.656952) {
      return "Greater Buffalo, NY Area";
    } else if (lat <= 40.882255 && lat > 40.540665 && lng >= -74.203905 && lng < -73.756606) {
      return "Greater New York, NY Area";
    } else if (lat <= 38.721315 && lat > 38.564493 && lng >= -90.370798 && lng < -90.152168) {
      return "Greater St. Louis, MO Area";
    } else {
      return "(" + lat + ", " + lng + ")";
    }
  }
};

export const Cerebro = new CerebroServer();

Cerebro.PUSH = CerebroCore.PUSH;
Cerebro.EMAIL = CerebroCore.EMAIL;
