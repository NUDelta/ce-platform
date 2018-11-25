import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Schema } from '../../schema.js';

/**
 * Callback schema.
 */
Schema.Callback = new SimpleSchema({
  trigger: {
    type: String
  },
  function: {
    type: String
  }
});

export const Callback = new Mongo.Collection('callback');
Callback.attachSchema(Schema.Callback);

/**
 * SituationDescription schema.
 */
Schema.SituationDescription = new SimpleSchema({
  detector: {
    type: String
  },
  number: {
    type: Number,
  }
});

export const SituationDescription = new Mongo.Collection('situationdescription');
SituationDescription.attachSchema(Schema.SituationDescription);

Schema.NeedType = new SimpleSchema({
  needName: {
    type: String
  },
  situation: {
    type: Schema.SituationDescription
  },
  toPass: {
    type: Object,
    optional: true,
    blackbox: true
  },
  numberNeeded: {
    type: Number,
  },
  notificationDelay: {
    type: Number,
    optional: true,
    defaultValue: 0 // notify immediately for need if no value is specified
  },
  allowRepeatContributions: {
    type: Boolean,
    optional: true,
    defaultValue: false
  }
});

export const NeedType = new Mongo.Collection('needtype');
NeedType.attachSchema(Schema.NeedType);

/**
 * Experience schema.
 */
// TODO: cascade delete incidents and remove from active, etc.
class ExperiencesCollection extends Mongo.Collection {
  remove(selector, callback) {
    Experiences.find(selector).forEach((experience) => {
      Incidents.remove({ experience: experience._id });
      Meteor.users.update({}, {
        $pull: {
          'profile.activeExperiences': experience._id
        }
      });
    });
    return super.remove(selector, callback);
  }
}

export const Experiences = new ExperiencesCollection('experiences');
Schema.Experience = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  name: {
    type: String,
    label: 'Experience name',
  },
  timeToExpire: { //developer input of expiration time
    type: Number, //Microsecond
    optional: true,
  },
  participateTemplate: {
    type: String,
  },
  resultsTemplate: {
    type: String,
  },
  detectors: { //Customize list of detectors
    type: [String],
    optional: true
  },
  contributionTypes: {
    type: [Schema.NeedType],
  },
  callbacks: {
    type: [Schema.Callback],
    optional: true
  },
  description: {
    type: String,
    label: 'Experience description',
    optional: true
  },
  notificationText: {
    type: String,
    optional: true
  },
  image: {
    type: String,
    label: 'Experience image url',
    optional: true
  },
});

Experiences.attachSchema(Schema.Experience);


/**
 * Incident schema.
 */
export const Incidents = new Mongo.Collection('incidents');
Schema.Incident = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  eid: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  timeToExpire: { //developer input of expiration time
    type: Number, //Microsecond
    optional: true,
  },
  firstSubmissions: {
    type: Date,
    defaultValue: null,
    optional: true
  },
  detectors: { //Customize list of detectors
    type: [String],
    optional: true
  },
  contributionTypes: {
    type: [Schema.NeedType],
    blackbox: true
  },
  callbacks: {
    type: [Schema.Callback],
    optional: true,
    blackbox: true
    //TODO: i think somehow its not finding the schema bc in experiences where its define no problem, but here need blackbox true
  },
});

Incidents.attachSchema(Schema.Incident);