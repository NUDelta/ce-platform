import '/imports/startup/server';

Schema = require('../imports/api/schema.js').Schema;
Messages = require('../imports/api/messages/messages.js').Messages;
Experiences = require('../imports/api/OCEManager/OCEs/experiences.js').Experiences;
Images = require('../imports/api/ImageUpload/images.js').Images;
Avatars = require('../imports/api/ImageUpload/images.js').Avatars;
Incidents = require('../imports/api/OCEManager/OCEs/experiences.js').Incidents;
Locations = require('../imports/api/UserMonitor/locations/locations.js').Locations;
Detectors = require('../imports/api/UserMonitor/detectors/detectors.js').Detectors;
Submissions = require('../imports/api/OCEManager/currentNeeds.js').Submissions;
