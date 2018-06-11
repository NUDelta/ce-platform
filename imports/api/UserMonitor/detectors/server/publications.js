import { Meteor } from 'meteor/meteor';
import { MongoInternals } from 'meteor/mongo';
import { Detectors } from '../detectors.js';

Meteor.publish('detectors', function () {
  return Detectors.find();
});

Meteor.publish('detectors.byId', function (detectorId) {
  return Detectors.find({ _id: detectorId });
});
