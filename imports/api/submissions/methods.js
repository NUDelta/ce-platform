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

var totalNumber = Submissions.find().count();
const submissionsCursor = Submissions.find();
const submissionsHandle = submissionsCursor.observe({
  //TODO: make it so we can check the submission when through completely first?
  //e.g. if a photo upload fails this will still run not matter what
  added(submission){
    if(totalNumber == Submissions.find().count()){
      console.log("not running received submission")
      return;
    }

    console.log("received a submission")
    console.log(submission)
    //when a user participates add it to their past experiences
    Cerebro.addIncidents(submission.submitter, submission.incidentId);

    //mark that they submitted
    Meteor.users.update({_id: submission.submitter}, {
      $set: {"profile.lastParticipated": Date.parse(new Date()) }
    })

    //remove user/experience from each other
    removeUserAfterTheyParticipated(submission.submitter, submission.experienceId)

    //see if there is a callback
    var callbackPairs = Experiences.findOne({_id: submission.experienceId}).callbackPair;
    console.log(callbackPairs)
    var callback = callbackPairs.filter(function(cp){
        return cp.templateName == submission.contributionTemplate;
      });

    if(callback.length > 1){
      log.error("submissions/methods found more than one callback for the templateName " + submission.templateName + " but there should only be one. Not calling any callbacks");
    }else if(callback.length === 1){
      console.log("we found a callback!")
      var callbackFunction = callback[0]["callback"];
      eval("(" + callbackFunction + "(" + JSON.stringify(submission) + "))")
    }

    //check if the situationNeed is FINISHED
    var incident = Incidents.findOne({_id: submission.incidentId});
    console.log("in submissions for incidnet ", incident._id)
    var situationNeed = incident.situationNeeds.filter(
      function(sn){
        return sn.name == submission.situationNeed
      })[0];
    console.log("found the sit need",situationNeed )
    var numberSubmissionsFound = Submissions.find({
      incidentId: submission.incidentId,
      situationNeed: submission.situationNeed
    }).count();
    console.log("looked for all of them ", numberSubmissionsFound)
    var numberSubmissionsRequired =situationNeed.softStoppingCriteria;
    console.log("num we need is ", numberSubmissionsRequired)

    if(numberSubmissionsRequired <= numberSubmissionsFound){
      Incidents.update({_id: submission.incidentId, 'situationNeeds.name': submission.situationNeed},
        {$set :
          { 'situationNeeds.$.done':  true }
      });
    }

    //check if the experience is done
    var isIncidentFinished = Incidents.find({_id: submission.incidentId, "situationNeeds.done": false }).count();
    console.log(isIncidentFinished)
    if(isIncidentFinished == 0){
      log.cerebro("Experience " + submission.experienceId + " is finished!")
      Experiences.update({_id: submission.experienceId},
        { $unset: { 'activeIncident': 0 }
      });
    }
  }
});
