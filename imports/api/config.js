import { ValidatedMethod } from "meteor/mdg:validated-method";
import { SimpleSchema } from "meteor/aldeed:simple-schema";

export const CONFIG = {
  MODE: process.env.MODE || "local",
  DEBUG: process.env.DEBUG || true,
  BUNDLE_IDENTIFIER: 'edu.northwestern.delta.D',
  CONTEXT_POLL_INTERVAL: process.env.CONTEXT_POLL_INTERVAL || 1, // min
  NOTIFIED_TOO_RECENTLY: process.env.NOTIFIED_TOO_RECENTLY || 10, // min
  PARTICIPATED_TOO_RECENTLY: process.env.PARTICIPATED_TOO_RECENTLY || 10, // min
};

export const AUTH = {
  oauth_consumer_key: "-_zoLpC8DASmu7ql13IQIw",
  oauth_consumer_secret: "2t9PyZDkOvykIWYvwWCy0uWoTug",
  oauth_token: "kkU3B_Abdf30sx5tVB2fkFVbr3gzxMZO",
  accessTokenSecret: "GGs0J7wWWshnazwoOHB01j3A2sM",
  oauth_signature_method: "HMAC-SHA1",
  S3_ENDPOINT: process.env.S3_ENDPOINT,
  S3_BUCKET: process.env.S3_BUCKET,
  S3_PREFIX: process.env.S3_PREFIX,
  S3_CDN: process.env.S3_CDN,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
};

export const getConfig = new ValidatedMethod({
  name: "config.get",
  validate: null,
  run() {
    return CONFIG;
  }
});
