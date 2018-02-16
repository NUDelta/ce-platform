import { Meteor } from 'meteor/meteor';
import { TextEntries } from '../text-entries.js';

Meteor.publish('textEntries.byIncident', function (incidentId) {
  return TextEntries.find({ incidentId: incidentId });
});
