import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Schema } from '../schema.js';

export const CerebroCore = class CerebroCore {
  constructor() {
    this.NOTIFY_ALL = false;
    this.NOTIFY_METHOD = CerebroCore.PUSH;
  }

  static get EMAIL() {
    return 'EMAIL';
  }

  static get PUSH() {
    return 'PUSH';
  }
};

Schema.NotificationOptions = new SimpleSchema({
  subject: {
    // TODO: max size of push notification
    type: String
  },
  text: {
    type: String
  },
  route: {
    type: String,
    optional: true
  }
});

Schema.NotificationLog = new SimpleSchema({
  userId: {
    type: String
  },
  task: {
    type: String
  },
  experienceId: {
    type: String
  },
  incidentId: {
    type: String
  },

});
export const NotificationLog = new Mongo.Collection('notificationlog');
NotificationLog.attachSchema(Schema.NotificationLog);
