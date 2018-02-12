import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { _ } from 'meteor/underscore';
import { Schema } from '../schema.js';
import { log } from '../logs.js';

import { Cerebro } from '../cerebro/server/cerebro-server.js';
import { Experiences } from '../experiences/experiences.js';
import { Incidents } from '../incidents/incidents.js';
import { Locations } from '../locations/locations.js';
import { Submissions } from './submissions.js';
import { NotificationLog } from '../cerebro/cerebro-core.js'
import { Users } from '../users/users.js';

import { removeUserAfterTheyParticipated } from  '../coordinator/methods.js'

//gets all unique unfilled entries from the submission DB
export const getUnfinishedNeeds = function(){
    return {eid:need, eid:need}
}

