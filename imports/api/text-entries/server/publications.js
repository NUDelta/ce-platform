import { Meteor } from 'meteor/meteor';
import { TextEntries } from '../text-entries.js';

Meteor.publish('text_entries', function() {
  return TextEntries.find();
});
