import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {_} from 'meteor/underscore';
import {Incidents} from "./incidents";
import {Availability} from "../coordinator/availability";
import {Assignments} from "../coordinator/assignments";
import {Submissions} from "../submissions/submissions";


export const startRunningIncident = function (iid) {
  let incident = Incidents.findOne(iid);
  let needUserMaps = [];

  _.forEach(incident.contributionTypes, (contribution) => {

    let templateName = contribution.templateName;

    _.forEach(contribution.needs, (need) => {

      needUserMaps.push({needName: need.needName})
      Submissions.insert({
        eid: incident.eid,
        iid: iid,
        needName: need.needName,
        templateName: templateName,
      }, (err, docs) => {
        if (err) {
          console.log(err);
        } else {
          console.log("worked", docs)
        }
      });
    });
  });

  Availability.insert({
    _id: iid,
    needUserMaps: needUserMaps
  })

  Assignments.insert({
    _id: iid,
    needUserMaps: needUserMaps
  })

}

/**
 * Given an experience object, creates an incident
 * @param {string} iid of the created incident
 */
export const createIncidentFromExperience = function (experience) {
  return Incidents.insert({
    eid: experience._id,
    contributionTypes: experience.contributionTypes,
    callbacks: experience.callbacks,
  });
}

/**
 * Finds the need dictionary in an incident given the need's name
 *
 * @param iid {string} incident id we are looking up a need in
 * @param needName {string} name of the need we are looking up
 */
export const getNeedFromIncidentId = (iid, needName) => {
  let incident = Incidents.findOne(iid);

  _.forEach(incident.contributionTypes, (contribution) => {
    _.forEach(contribution.needs, (need) => {
      if (need.needName === needName) {
        return need;
      }
    });
  });
}

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

