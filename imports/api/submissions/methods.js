import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { _ } from 'meteor/underscore';
import { Schema } from '../schema.js';

import { Cerebro } from '../cerebro/server/cerebro-server.js';
import { Experiences } from '../experiences/experiences.js';
import { Incidents } from '../incidents/incidents.js';
import { Locations } from '../locations/locations.js';
import { Submissions } from '../submissions/submissions.js';
import { WIPQueue } from '../../startup/server/WIPQueue.js'
import { NotificationLog } from '../cerebro/cerebro-core.js'
import { Users } from '../users/users.js';

const submissionsCursor = Submissions.find();
const submissionsHandle = submissionsCursor.observe({
  changed(submission){
    //when a user participates add it to their past experiences
    Cerebro.addIncidents(submission.submitter, submission.incidentId);

    //see if there is a callback
    var callbackPairs = experience.callbackPair;

    var callback = callbackPairs.filter(function(cp){
        return cp.templateName == submission.templateName;
      });

    if(callback.length > 1){
      log.error("submissions/methods found more than one callback for the templateName " + submission.templateName + " but there should only be one. Not calling any callbacks");
    }else if(callback.length === 1){
      var callbackFunction = callback[0]["callback"];
      return eval("(" + callbackFunction + "(" + JSON.stringify(submission) + "))")
    }

    //check if the situationNeed is FINISHED
    var incident = Incidents.findOne({_id: submission.incidentId});

    var situationNeed = incident.situationNeeds.filter(
      function(sn){
        return sn.name == submission.situationNeed
      })[0];

    var numberSubmissionsFound = Submissions.find({
      incidentId: submission.incidentId,
      situationNeed: submission.situationNeed
    }).count();

    var numberSubmissionsRequired =situationNeed.softStoppingCriteria;

    if(numberSubmissionsRequired =< numberSubmissionsFound){
      Incidents.update({_id: submission.incidentId, 'situationNeeds.name': submission.situationNeed},
        {$set :
          { 'situationNeeds.$.done':  true }
      });
    }

    //check if the experience is done
    var isIncidentFinished = Incidents.count({_id: submission.incidentId, "situationNeeds.done": false });
    console.log(isIncidentFinished)
    if(isIncidentFinished == 0){
      log.cerebro("Experience " + submission.experienceId + " is finished!")
      Experiences.update({_id: submission.experienceId},
        { $unset: { 'activeIncident': 0 }
      });
    }
  }
});
