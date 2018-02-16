import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// @Deprecated
const Notification = {
  PUSH: 'PUSH',
  EMAIL: 'EMAIL'
};

export const CONFIG = {
  CLEAR_DB: 0,
  CLEAR_USERS: 0,
  CLEAR_ACTIVE: 0,
  CLEAR_LOCATIONS: 0,
  CLEAR_SUBMISSIONS: 0,
  CLEANUP: 0,

  NOTIFY_ALL: 1,
  NOTIFY_METHOD: Notification.PUSH,
  DEBUG_PUSH: 0,
  DEBUG_USERS: ['pTeAq958AvmvMvF7e', 'mr9qe4nRHQn8KufLX', 'BvYfcgvJ7yDETLjME']
};

export const AUTH = {
  oauth_consumer_key: "-_zoLpC8DASmu7ql13IQIw",
  oauth_consumer_secret: "2t9PyZDkOvykIWYvwWCy0uWoTug",
  oauth_token: "kkU3B_Abdf30sx5tVB2fkFVbr3gzxMZO",
  accessTokenSecret: "GGs0J7wWWshnazwoOHB01j3A2sM",
  oauth_signature_method: "HMAC-SHA1"
};

export const getConfig = new ValidatedMethod({
  name: 'config.get',
  validate: null,
  run() {
    return CONFIG;
  }
});

export const toggleDebugPush = new ValidatedMethod({
  name: 'config.togglePush',
  validate: new SimpleSchema({
    on: { type: Boolean }
  }).validator(),
  run({ on }) {
    CONFIG.DEBUG_PUSH = on;
    return CONFIG.DEBUG_PUSH;
  }
});
