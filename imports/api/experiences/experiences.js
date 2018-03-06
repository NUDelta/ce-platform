import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Incidents } from '../incidents/incidents.js';
import { Schema } from '../schema.js';

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
});
export const NeedType = new Mongo.Collection('needtype');
NeedType.attachSchema(Schema.NeedType);


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
  participateTemplate: {
    type: String,
  },
  resultsTemplate: {
    type: String,
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
