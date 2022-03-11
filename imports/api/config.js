import { ValidatedMethod } from "meteor/mdg:validated-method";
import { SimpleSchema } from "meteor/aldeed:simple-schema";

export const CONFIG = {
  MODE: process.env.MODE || "local",
  DEBUG: (process.env.DEBUG !== undefined) ? JSON.parse(process.env.DEBUG) : true,
  BUNDLE_IDENTIFIER: 'edu.northwestern.delta.D',
  CONTEXT_POLL_INTERVAL: (process.env.CONTEXT_POLL_INTERVAL !== undefined) ? parseInt(process.env.CONTEXT_POLL_INTERVAL) : 1, // min
  NOTIFIED_TOO_RECENTLY: (process.env.NOTIFIED_TOO_RECENTLY !== undefined) ? parseInt(process.env.NOTIFIED_TOO_RECENTLY) : 10, // min
  PARTICIPATED_TOO_RECENTLY: (process.env.PARTICIPATED_TOO_RECENTLY !== undefined) ? parseInt(process.env.PARTICIPATED_TOO_RECENTLY) : 1, // min
};

const _throw  = (msg) => { throw new Meteor.Error(msg); };
export const AUTH = {
  oauth_consumer_key: "-_zoLpC8DASmu7ql13IQIw",
  oauth_consumer_secret: "2t9PyZDkOvykIWYvwWCy0uWoTug",
  oauth_token: "kkU3B_Abdf30sx5tVB2fkFVbr3gzxMZO",
  accessTokenSecret: "GGs0J7wWWshnazwoOHB01j3A2sM",
  oauth_signature_method: "HMAC-SHA1",
  S3_ENDPOINT: process.env.S3_ENDPOINT || _throw("S3_ENDPOINT not set"),
  S3_BUCKET: process.env.S3_BUCKET || _throw("S3_BUCKET not set"),
  S3_PREFIX: process.env.S3_PREFIX || _throw("S3_PREFIX not set"),
  S3_CDN: process.env.S3_CDN || _throw("S3_CDN not set"),
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || _throw("AWS_ACCESS_KEY_ID not set"),
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || _throw("AWS_SECRET_ACCESS_KEY not set"),
};

export const getConfig = new ValidatedMethod({
  name: "config.get",
  validate: null,
  run() {
    return CONFIG;
  }
});
