import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import {Incidents} from './incidents';
import {Availability} from '../coordinator/availability';
import {Assignments} from '../coordinator/assignments';
import {Submissions} from '../submissions/submissions';
import {Experiences} from "../experiences/experiences";


Meteor.methods({
  createAndstartIncident(eid) {
    let experience = Experiences.findOne(eid);
    startRunningIncident(createIncidentFromExperience(experience));
  }
});

export const addContribution = (iid, contribution) =>{
  console.log("adding contribution", iid, contribution);
  Incidents.update({
    _id: iid,
  }, {
    $push: {contributionTypes: contribution}
  });
  addEmptySubmissionsForNeed(iid, Incidents.findOne(iid).eid, contribution);

  Availability.update({
    _id: iid
  },{
    $push: {needUserMaps: {needName: contribution.needName, uids: []}}
  });

  Assignments.update({
    _id: iid
  },{
    $push: {needUserMaps: {needName: contribution.needName, uids: []}}
  });
};

const addEmptySubmissionsForNeed = (iid, eid, need) => {
  let i = 0;
  while (i < need.numberNeeded) {
    i++;

    Submissions.insert({
      eid: eid,
      iid: iid,
      needName: need.needName,
    });
  }
};

export const startRunningIncident = (incident) => {
  console.log('incident in start', incident);
  let needUserMaps = [];

  _.forEach(incident.contributionTypes, (need) => {
    console.log("when starting incident a need is:", need);
    needUserMaps.push({needName: need.needName, uids: []});

    addEmptySubmissionsForNeed(incident._id, incident.eid, need);

  });

  console.log("needUserMaps", needUserMaps);
  Availability.insert({
    _id: incident._id,
    needUserMaps: needUserMaps
  });

  Assignments.insert({
    _id: incident._id,
    needUserMaps: needUserMaps
  });
};


/**
 * Given an experience object, creates an incident
 * @param experience {object} of the created incident
 */
export const createIncidentFromExperience = (experience) => {
  let incident = {
    eid: experience._id,
    callbacks: experience.callbacks,
    contributionTypes: experience.contributionTypes,
  };

  Incidents.insert(incident, (err) => {
    if (err) {
      console.log('error,', err);
    } else {
      console.log('iid created')
    }
  });


  console.log("incident after created", incident)
  return incident;
};

/**
 * Finds the need dictionary in an incident given the need's name
 *
 * @param iid {string} incident id we are looking up a need in
 * @param needName {string} name of the need we are looking up
 */
export const getNeedFromIncidentId = (iid, needName) => {
  let incident = Incidents.findOne(iid);

  console.log("incident", incident);

  let output = undefined;
  console.log('getNeedFromIncidentId', iid, needName);

  _.forEach(incident.contributionTypes, (need) => {
    if (need.needName === needName) {
      output = need;
      return false;
    }

    // check if found
    if (typeof output === 'undefined') {
      return false;
    }
  });

  return output;
};

//
// export const createIncident = new ValidatedMethod({
//   name: 'api.createIncident',
//   validate: new SimpleSchema({
//     experienceId: {
//       type: String
//     }
//   }).validator(),
//   run({experienceId}) {
//     //TODO: sometimes this runs too quickly after the experience was created
//     //we should be able to fix this
//     var experience = Experiences.findOne({_id:experienceId});
//     const incidentId = Incidents.insert({
//       date: Date.parse(new Date()),
//       name: experience.name,
//       experienceId: experience._id
//     }
//     );
//     Experiences.update( experience._id, { $set: { activeIncident: incidentId } });
//     return incidentId;
//   }
// });
//
// export const addSituationNeeds = new ValidatedMethod({
//   name: 'api.addSituationNeeds',
//   validate: new SimpleSchema({
//     incidentId:{
//       type: String
//     },
//     need:{
//       type: Schema.SituationNeed
//     }
//   }).validator(),
//   run({incidentId, need}){
//     var res = Incidents.update({_id: incidentId},
//       {$push: { situationNeeds: {
//         name:need.name,
//         affordance: need.affordance,
//         contributionTemplate:need.contributionTemplate,
//         softStoppingCriteria:need.softStoppingCriteria,
//         notifiedUsers: [],
//         done: false
//         }
//       }
//     });
//     return res;
//   }
// });
//

