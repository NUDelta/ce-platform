import { ValidatedMethod } from "meteor/mdg:validated-method";
import { SimpleSchema } from "meteor/aldeed:simple-schema";

export const CONFIG = {
  MODE: process.env.MODE || "local",
  DEBUG: true
};

export const AUTH = {
  oauth_consumer_key: "-_zoLpC8DASmu7ql13IQIw",
  oauth_consumer_secret: "2t9PyZDkOvykIWYvwWCy0uWoTug",
  oauth_token: "kkU3B_Abdf30sx5tVB2fkFVbr3gzxMZO",
  accessTokenSecret: "GGs0J7wWWshnazwoOHB01j3A2sM",
  oauth_signature_method: "HMAC-SHA1"
};

export const getConfig = new ValidatedMethod({
  name: "config.get",
  validate: null,
  run() {
    return CONFIG;
  }
});
