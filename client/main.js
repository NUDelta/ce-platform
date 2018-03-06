import '/imports/startup/client';

//TODO: what's all this? Do we need to add availabliity?
if (Meteor.isDevelopment) {
  Schema = require('../imports/api/schema.js').Schema;
  Experiences = require('../imports/api/experiences/experiences.js').Experiences;
  Images = require('../imports/api/images/images.js').Images;
  Incidents = require('../imports/api/incidents/incidents.js').Incidents;
  Locations = require('../imports/api/locations/locations.js').Locations;
  Detectors = require('../imports/api/detectors/detectors.js').Detectors;
  TextEntries = require('../imports/api/text-entries/text-entries.js').TextEntries;
  Submissions = require('../imports/api/submissions/submissions.js').Submissions;
}
