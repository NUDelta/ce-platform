import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {Schema} from '../schema.js';

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

Schema.NotificationLog = new SimpleSchema({
    uid: {
        type: String
    },
    lat: {
        type: Number,
        decimal: true,
        min: -90,
        max: 90
    },
    lng: {
        type: Number,
        decimal: true,
        min: -180,
        max: 180
    },
    need: {
        type: String
    },
    iid: {
        type: String
    },
    timestamp: {
        type: Date
    },
});
export const NotificationLog = new Mongo.Collection('notificationlog');
NotificationLog.attachSchema(Schema.NotificationLog);
