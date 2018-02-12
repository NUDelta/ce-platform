import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { _ } from 'meteor/underscore';
import { Schema } from '../schema.js';

import { Cerebro } from '../cerebro/server/cerebro-server.js';
import { Experiences } from '../experiences/experiences.js';
import { Incidents } from '../incidents/incidents.js';
import { Locations } from '../locations/locations.js';
import { Submissions } from '../submissions/submissions.js';
import { NotificationLog } from '../cerebro/cerebro-core.js'
import { AvailabilityLog } from './availabilitylog.js'

import { Users } from '../users/users.js';
import {addActiveIncidentToUser} from "../users/methods";

const locationCursor = Locations.find();

//availabilityDictionary = {eid:[need, need], eid:need}
export const runCoordinatorAfterUserLocationChange = function(uid, availabilityDictionary){
    var updatedExperiencesAndNeeds = updateAvalibility(uid, availabilityDictionary);
    updateAssignedAfterUserLocationChange(uid);
    var incidentsWithUsersToRun = checkIfThreshold(updatedIncidentsAndNeeds);
    addUsersToIncidents(incidentsWithUsersToRun)
}

//availabilityDictionary = {eid:[need, need], eid:need}
//updates the database with the avaiablilty of the new user 2
function updateAvalibility(user, {eid:[need, need], eid:need}){

}

//sends notifications to the users, adds to the user's active experience list, marks in assignment DB 2b
function addUsersToIncidents(incidentsWithUsersToRun){ //{iid: {need: [uid, uid], need:[uid]}
    //administrative updates
    addActiveIncidentToUser(uid, iid);

    //send notifications
    incidentsWithUsersToRun.forEach((iid)=>{
        var incident = Incidents.findOne(iid);
        var experience = Experiences.findOne(incident.eid)
        var needUserMapping = incidentNeedUserMapping[iid];
        needUserMapping.forEach((needName)=>{
            var uids = needUserMapping[needName];
            addUsersToAssignment(uids, iid, needName);
            
            var route = "apiCustom/" + iid + "/" + needName;
            notify(uids, iid, "Event " + experience.name + " is starting!", experience.notificationText, route)
        });
    });
}


//if a user's location changed and they no longer match an experience they were assigned to, OR they're taking too long and someone else is waiting to be assigned. Removes active experience from user 2c
function updateAssignedAfterUserLocationChange(uid){

}

function removeUserFromAssigned(uid, eid, needName){

}
//check if an experience need can run e.g. it has the required number of people. This may call other functions that, for example, check for relationship, colocated, etc.
function checkIfThreshold(updatedExperiencesAndNeeds){
  return {eid: {need: [uid, uid], need:[uid]}}
}


function addUsersToAssignment(uids, iid, needName){
    //ahh not quite sure how to do this database push
    Assignment.update({
        iid: iid,
    }, {
        $push: { //needs.needname.users

        }
    });
}


/**
 * a DB listener that responds when a user's location field changes, this includes
 *    lat/long and the affordance array
 */
const locationHandle = locationCursor.observeChanges({
  changed(id, fields){
    console.log("the location field changed", fields)

    if("lastNotification" in fields){
      return;
    }

    //check if now that they've moved they...
    var location = Locations.findOne({_id: id});
    var uid = location.uid;

    //need to be removed from an experience they're currently in
    var user = Meteor.users.findOne({_id: uid})
    var usersExperiences = user.profile.activeExperiences
    if(usersExperiences){
      usersExperiences.forEach((experienceId)=>{
        removeUserFromExperienceAfterTheyMoved(uid, experienceId)
      })
    }

    if("affordances" in fields){
      AvailabilityLog.insert({
        uid: uid,
        lastParticipated: user.profile.lastParticipated,
        lastNotified: location.lastNotification,
        affordances: location.affordances,
        lat: location.lat,
        lng: location.lng,
        now: Date.parse(new Date()),
      });
    }

    //check if user to available to participate right now
    if(!userIsAvailableToParticipate(user, location)){
      console.log("user participated too recently")
      return;
    }

    //can be added to a new experience
    var allExperiences = Experiences.find({activeIncident: {$exists: true}}).fetch()

    //could randomize the order of experiences
    console.log("at the top of the for loops")
    var shuffledExperiences = _.shuffle(allExperiences)
    for(var i in shuffledExperiences){
      var experience = shuffledExperiences[i];
      var result = attemptToAddUserToIncident(uid, experience.activeIncident);
      console.log("result", result)
      if (result){
        console.log("We found an experience for the user and now are stopping")
        break;
      }
    }
  }
});


/**
 * userIsAvailableToParticipate - checks if a user can participate or if they not
 *    available to participate because they were notified too recently
 *
 * @param  {user document} user     user document
 * @param  {location document} location location document for that user
 * @return {bool}          true if a user can participate
 */
function userIsAvailableToParticipate(user, location){
  var waitTimeAfterNotification = 30*60000; //first number is the number of minutes
  var waitTimeAfterParticipating = 60*60000;//first number is the number of minutes

  var lastParticipated = user.profile.lastParticipated;
  var lastNotified = location.lastNotification;

  var now = Date.parse(new Date());

  var userNotYetNotified = lastParticipated === null
  var userNotifiedTooRecently = (now - lastNotified) < waitTimeAfterNotification
  var userNotYetParticipated = lastNotified === null
  var userParticipatedTooRecently = (now - lastParticipated) < waitTimeAfterParticipating

  if((!userNotYetNotified && userNotifiedTooRecently) || (!userNotYetParticipated && userParticipatedTooRecently)){
    return false;
  }
  else{
    return true;
  }
}

function attemptToAddUserToIncident(uid, incidentId){
  var incident = Incidents.findOne({_id: incidentId});
  var userAffordances = Locations.findOne({uid:uid}).affordances
  var minParticipation = Math.min(); //this is infinity
  var minSituationNeed = null;

  incident.situationNeeds.forEach((sn)=>{
    if(sn.done === false && containsAffordance(userAffordances, sn.affordance)){
      //need has a user, but lets see if time to kick them out
      if(sn.notifiedUsers.length > 0){
        var timeSinceUserLastNotified = Date.parse(new Date()) - Locations.findOne({uid: sn.notifiedUsers[0]}).lastNotified
        if(timeSinceUserLastNotified  > 30*60000){ //time in minutes since they were asked to participate in any experience
          removeUserFromExperience(sn.notifiedUsers[0], incident.experienceId, 2)
        }else{
          //we have a user already for this need, skip and see if the next one is open
          return false;
        }
      }
      var numberDone = Submissions.find({incidentId:incident._id, situationNeed:sn.name}).count()
      if(numberDone < minParticipation){
        minSituationNeed = sn.name;
      }
    }
  });
  if(minSituationNeed != null){
    addUserToSituationNeed(uid, incidentId, minSituationNeed)
    return true;
  }
  return false;
}

function addUserToSituationNeed(uid, incidentId, situationNeedName){
  var experience = Experiences.findOne({activeIncident: incidentId});
  var experienceId = experience._id;

  //add active experience to the user
  Cerebro.setActiveExperiences(uid, experienceId);

  //add user to the incident
  Incidents.update(
    {_id: incidentId, 'situationNeeds.name': situationNeedName},
    {$push :
      { 'situationNeeds.$.notifiedUsers':  uid }
    }
  );
  //notify the user & mark as notified
  Locations.update({uid:uid},  {$set: {"lastNotification": Date.parse(new Date()) }});

  //add notification to notification log
  var userLocation = Locations.findOne({uid: uid})
  NotificationLog.insert({userId: uid,
    task: situationNeedName,
    lat: userLocation.lat,
    lng: userLocation.lng,
    experienceId: experienceId,
    incidentId: incidentId
  });

  //send notification
  Cerebro.notify({
    userId: uid,
    experienceId: experienceId,
    subject: "Event " + experience.name + " is starting!",
    text: experience.notificationText,
    route: "apiCustom"
  });
}

function removeUserFromExperience(uid, experienceId, incidentId, situationNeedName){
  //remove the user from the incident
  console.log("removeing the user")
  Incidents.update({_id: incidentId, 'situationNeeds.name': situationNeedName},
  {$pull :
    { 'situationNeeds.$.notifiedUsers':  uid }
  });

  //remove the experience from the user
  Meteor.users.update({_id: uid},
    {$pull :
      { 'profile.activeExperiences':  experienceId }
    }
  );
}

export const  removeUserAfterTheyParticipated = function(uid, experienceId){
  var userAffordances = Locations.findOne({uid: uid}).affordances
  var incident = Incidents.findOne({experienceId: experienceId});

  for(var i in incident.situationNeeds){
    var sn = incident.situationNeeds[i]
    console.log(sn.name)
    if(_.contains(sn.notifiedUsers, uid)){
      removeUserFromExperience(uid, experienceId, incident._id, sn.name)
      break;
    }
  };
}

function removeUserFromExperienceAfterTheyMoved(uid, experienceId) {
  var userAffordances = Locations.findOne({uid: uid}).affordances
  var incident = Incidents.findOne({experienceId: experienceId});
  var wait = 5*60*1000; //WAIT LAG (in minutes) FOR AFTER A USER LEAVES A SITUATION

  Meteor.setTimeout(function(){
    console.log("we're removing the userrzz")
    for(var i in incident.situationNeeds){
      var sn = incident.situationNeeds[i]
      if(_.contains(sn.notifiedUsers, uid)){
        if(! containsAffordance(userAffordances, sn.affordance)){
          console.log("found the one to remove from!")
          removeUserFromExperience(uid, experienceId, incident._id, sn.name)
          //a user will only be in one situation need, so we can break
          break;
        }
      }
    };
  }, wait)
}


// METHODS FOR AFFORDANCE SEARCH
function containsAffordance(user_affordances, search_affordance){
  // && affordances
  if (search_affordance.search(" and ") > 0) {
    return andAffordances(user_affordances, search_affordance);
  }
  // || affordances
  else if (search_affordance.search(" or ") > 0) {
    return orAffordances(user_affordances, search_affordance);
  }
  // single affordance
  else {
    return (_.contains(user_affordances, search_affordance));
  }
}

function andAffordances(user_affordances, search_affordance){
  let affordances = [];
  let str = search_affordance;
  affordances = search_affordance.split(" and ");
  differences =  _.difference(affordances, user_affordances)
  return differences.length == 0
}

function orAffordances(user_affordances, search_affordance){
  let affordances = [];
  let contains = false;
  affordances = search_affordance.split(" or ");
  for (i = 0; i < affordances.length; i++){
    anAffordance = affordances[i];
    if (_.contains(user_affordances, anAffordance)){
      contains = true;
      break;
    }
  }
  return contains;
}
