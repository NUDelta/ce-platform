import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';



export const startRunningIncident = function(iid){

}

export const createIncidentFromExperience = function(eid){

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

