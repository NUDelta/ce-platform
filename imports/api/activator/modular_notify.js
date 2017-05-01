import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { SyncedCron } from 'meteor/percolate:synced-cron';

import { Cerebro } from '../cerebro/server/cerebro-server.js';
import { notifyOnAffordances } from '../cerebro/server/methods.js';
import { Experiences } from '../experiences/experiences.js';
import { Schema } from '../schema.js';
import { log } from '../logs.js';
import { CONFIG } from '../config.js';

import { activateNewIncident } from '../incidents/methods.js';
import { removeFromAllActiveExperiences } from '../users/methods.js';
import { Locations } from '../locations/locations.js';
import { Users } from '../users/users.js';

import './methods.js'

//
// export const runExperience = new ValidatedMethod({
//   name: 'api.runExperience',
//   validate: new SimpleSchema({
//     experience: {
//       Schema.Experience
//     }
//   }).validator(),
//   run({experience}){
//     console.log(experience);
//     Meteor.call('api.createIncident', experience, this.userId)
//
//   }
// });
//
//
// export const createIncident = new ValidatedMethod({
//   name: 'api.createIncident',
//   validate: new SimpleSchema({
//     experience: {
//       type: Schema.Experience
//     },
//     launcher_id: {
//       type: String
//     }
//   }).validator(),
//     run({experience, launcher_id}) {
//       const incidentId = Incidents.insert({
//         date: Date.parse(new Date()),
//         data: {},
//         name: name,
//         experienceId: experienceId,
//         launcher: launcher
//       });
//       Experiences.update(experienceId, { $set: { activeIncident: incidentId } });
//       return incidentId;
//     }
//   });
