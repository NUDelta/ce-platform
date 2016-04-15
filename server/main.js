import '/imports/startup/server';

if (Meteor.isDevelopment) {
  Schema = require('../imports/api/schema.js').Schema;
  Experiences = require('../imports/api/experiences/experiences.js').Experiences;
  Images = require('../imports/api/images/images.js').Images;
  Incidents = require('../imports/api/incidents/incidents.js').Incidents;
  Locations = require('../imports/api/locations/locations.js').Locations;
  TextEntries = require('../imports/api/text-entries/text-entries.js').TextEntries;
}
