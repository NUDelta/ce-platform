//launch experience methods
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { SyncedCron } from 'meteor/percolate:synced-cron';

import { Cerebro } from '../cerebro/server/cerebro-server.js';
import { Experiences } from '../experiences/experiences.js';
import { Schema } from '../schema.js';

import { removeFromAllActiveExperiences } from '../users/methods.js';
import { Locations } from '../locations/locations.js';
import { Submissions } from '../submissions/submissions.js';

import { Users } from '../users/users.js';
import { _ } from 'meteor/underscore';

import { Incidents } from '../incidents/incidents.js';

import { WIPQueue } from '../../startup/server/WIPQueue.js'
import { NotificationLog } from '../cerebro/cerebro-core.js'


// METHODS FOR NOTIFICATION STRATEGIES
var notifyOneUser = function (potentialUsers, situationalNeeds) {
  var usersToNotify = {};
  var alreadyNotified = [];
  var ogKeys = Object.keys(potentialUsers)
  for (var i = 0; i < ogKeys.length; i++) {
    var numAlreadyNotified = situationalNeeds.filter(function (s) {
      return s.name == ogKeys[i];
    })[0].notifiedUsers.length;
    if (numAlreadyNotified > 0) {
      delete potentialUsers[ogKeys[i]]
    }
  }
  while (Object.keys(potentialUsers).length > 0) {
    var keys = Object.keys(potentialUsers);
    keys.sort(function (a, b) {
      return potentialUsers[a].length - potentialUsers[b].length;
    })

    var theKey = keys[0];
    var user = potentialUsers[theKey].pop();

    if (alreadyNotified.includes(user)) {
      continue;
    }
    if (user == null) {
      delete potentialUsers[theKey]
    }
    else {
      usersToNotify[theKey] = [user];
      delete potentialUsers[theKey];
      alreadyNotified.push(user);
    }
  }
  return usersToNotify;
}

var greedyOrganization = function (potentialUsers) {
  var usersToNotify = {};
  var alreadyNotified = [];

  while (Object.keys(potentialUsers).length > 0) {
    var keys = Object.keys(potentialUsers);
    keys.sort(function (a, b) {
      return potentialUsers[a].length - potentialUsers[b].length;
    })
    var theKey = keys[0];
    var user = potentialUsers[theKey].pop();
    if (alreadyNotified.includes(user)) {
      continue;
    }
    if (user == null) {
      delete potentialUsers[theKey]
    }
    else {
      if (theKey in usersToNotify) {
        usersToNotify[theKey].push(user);
        alreadyNotified.push(user);
      }
      else {
        usersToNotify[theKey] = [user];
        alreadyNotified.push(user);
      }
    }
  }
  return usersToNotify;
}

var notificationFunctions = {"greedyOrganization": greedyOrganization, "notifyOneUser": notifyOneUser};

// METHODS FOR CALLBACKS
var globalCallbacks = {}

export const registerCallback = function(experienceId, templateName, callback){
  if (experienceId in globalCallbacks){
    globalCallbacks[experienceId][templateName]= callback;
  }
  else {
    globalCallbacks[experienceId]= {};
    globalCallbacks[experienceId][templateName] = callback;
  }
}

// METHODS FOR UPDATING USERS
function clearUsersFromNeed(situationNeed, experienceId, incidentId){
  removeSpecificUsersFromNeed(situationNeed.notifiedUsers, situationNeed, experienceId, incidentId);
}

function removeSpecificUsersFromNeed(users, situationNeed, experienceId, incidentId){
  Cerebro.removeAllOldActiveExperiences(users, experienceId);
  Incidents.update({_id: incidentId, 'situationNeeds.name': situationNeed.name},
   {$pull :
        { 'situationNeeds.$.notifiedUsers':  { $in: users }}
    });
}

function removeUsersWhoMovedFromNeed(allUsersWithAffordance, situationNeed, experienceId, incidentId) {
  var usersToRemove = _.difference(situationNeed.notifiedUsers, allUsersWithAffordance);
  var wait = 2*60*1000 //WAIT LAG FOR AFTER A USER LEAVES A SITUATION
  Meteor.setTimeout(function(){
    removeSpecificUsersFromNeed(usersToRemove, situationNeed, experienceId, incidentId)
  }, wait)
}

function removeUsersWhoHaveNotParticipated(allUsersWithAffordance, situationNeed, experienceId, incidentId) {

  var now = Date.parse(new Date());
  var locationsNotParticipatedForAwhile = Locations.find({lastNotification: { $lt: now - 10*60000}}).fetch(); //in minutes

  var usersNotParticipatedForAwhile = locationsNotParticipatedForAwhile.map(function(l){
    return l.uid;
  })

  var usersToRemove = _.intersection(usersNotParticipatedForAwhile, allUsersWithAffordance)
  removeSpecificUsersFromNeed(usersToRemove, situationNeed, experienceId, incidentId)
}


function removeUsersWhoParticpatedFromNeed(allUsersWithAffordance, situationNeed, experienceId, incidentId) {
  var now = Date.parse(new Date());
  var timeCutoff = now - 1*60000 //in minutes

  var submissions = Submissions.find({incidentId: {$eq: incidentId}, timestamp: {$gt: timeCutoff }}).fetch();
  var users = submissions.map(function(x){
    return x.submitter
  });

  var unique_users = _.uniq(users)

  removeSpecificUsersFromNeed(unique_users, situationNeed, experienceId, incidentId)
}

// METHODS FOR CHECKING NEED & CONTRIBUTION FULFILLMENT
export const setNeedAsDone = new ValidatedMethod({
  name: 'api.setNeedAsDone',
  validate: new SimpleSchema({
    incidentId:{
      type: String
    },
    situationNeed:{
      type: Schema.SituationNeed
    },
    contributionTemplate:{
      type: Schema.SituationalNeedTemplate
    }
  }).validator(),
  run({incidentId, situationNeed, contributionTemplate}){
    var experienceId = Incidents.findOne({_id: incidentId}).experienceId;
    clearUsersFromNeed(situationNeed, experienceId, incidentId);
    var test = Incidents.update({_id: incidentId, 'situationNeeds.name': situationNeed.name},
      {$set :
        { 'situationNeeds.$.done':  true }
    });
    var experience = Experiences.findOne({_id: experienceId})

    var callbackPair = experience.callbackPair;

    var callback = callbackPair.filter(function(n){
        return n.templateName == situationNeed.contributionTemplate;
      });
    if(callback.length > 0){
      fun = callback[0]["callback"];
      var mostRecent = Submissions.findOne({incidentId:incidentId}, {sort:{$natural:-1}})
      return eval("(" + fun + "(" + JSON.stringify(mostRecent) + "))")
    }
  }
});

function checkIfSituationNeedFinished(results, situationNeed, contributionTemplate){
  var soft_stopping_criteria = situationNeed.softStoppingCriteria;
  if(results.length == 0){
    return false;
  }
  var incidentId = results[0].incidentId;
  if(situationNeed.done == true){
    return true;
  }
  if("total" in soft_stopping_criteria){
    var numFinished = results.filter(function(n){
        return situationNeed.name === n.situationNeed;
      }).length;
    if (situationNeed.done == false && numFinished >= soft_stopping_criteria["total"]){
        var res = Meteor.call("api.setNeedAsDone", {incidentId: incidentId, situationNeed: situationNeed, contributionTemplate: contributionTemplate})
        return true;
    }
  }
  return false;
}

function checkIfContributionFinished(incident, results, contributionTemplate){
  var numDone = results.filter(function(r){
    return r.contributionTemplate == contributionTemplate.name
  }).length;
  var notFinished = [];
  var situationNeeds = incident.situationNeeds.filter(function(x){
    return x.contributionTemplate == contributionTemplate.name});
  situationNeeds.forEach((need)=>{
    if(!checkIfSituationNeedFinished(results, need, contributionTemplate)){
      notFinished.push(need)
    }
  });
  return {numFinished: numDone, notFinished: notFinished};
}

function checkIfGroupFinished(incident, results, group){
  var notFinished = []
  var numFinished = 0;

  group.contributionTemplates.forEach((contributionTemplate)=>{
    var info = checkIfContributionFinished(incident, results, contributionTemplate);
    numFinished += info.numFinished;
    notFinished = notFinished.concat(info.notFinished);
  });

  if(numFinished >= group.stoppingCriteria.total){
    return []
  }
  else {
    if (notFinished.length == 0) {

      var updatedIncident = Incidents.findOne({_id: incident._id})
      var notDone = updatedIncident.situationNeeds.filter(function(x){
        return x.done == false;
      })
      console.log("All situation needs are done but the group isn't ahhh what to do here!?");
      console.log(notDone);
      return notDone;
    }
    return notFinished;
  }
}

function getUnfinishedNeeds(incident, results, experience){
  var unfinished = [];
  experience.contributionGroups.forEach((group)=>{
    unfinished = unfinished.concat(checkIfGroupFinished(incident, results, group));
  });
  return unfinished;
}

function getSitutationNeedByName(sitatuionNeeds, name){
  return sitatuionNeeds.filter(function(n){
    return n.name == name;
  })[0];
}

// METHODS FOR AFFORDANCE & USER SEARCH
function queryFor(search_aff){
  var locs = Locations.find().fetch();
  var filtered = locs.filter(function(x){
    if(x.affordances == null){
      return false;
    }
    return (containsAffordance(x.affordances, search_aff));
  });
  var mapped = filtered.map(function(x){
    return x.uid;
  });
  return mapped;
}

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

export const usersNotNotified = function(possibleUserIds){
  userIdsAvalibleNow = []

  for(let i in possibleUserIds){
    var userId = possibleUserIds[i]
    var user = Meteor.users.findOne({_id: userId});
    let lastParticipated = user.profile.lastParticipated;
    let user_location = Locations.findOne({uid: userId});

    if(user_location == null){
      continue;
    }
    var now = Date.parse(new Date());
    var waitTimeAfterNotification = .5*60*60000 //first number is the number of hours
    var waitTimeAfterParticipating = 2*60*60000

    if((user_location.lastNotification == null ||
      (now - user_location.lastNotification) > waitTimeAfterNotification) && ((now - lastParticipated) > waitTimeAfterParticipating || lastParticipated== null)){

      //they are avalible
      userIdsAvalibleNow.push(userId);
    }
  }
  return userIdsAvalibleNow;
}

export const prepareToNotifyUsers = function(userIds, experience, activeIncident){
  var now = Date.parse(new Date());

  if(userIds.length > 0){
    Cerebro.setActiveExperiences(userIds, experience._id);
    Cerebro.addIncidents(userIds, activeIncident);
    userIds.map( userId => {
      Locations.update({uid: userId}, { $set: {
        lastNotification : now
      }}, (err, docs) => {
        if (err) { console.log(err); }
        else {  }
      });
    });
  }
}

// NOTIFY USERS
export const notify = new ValidatedMethod({
  name: 'notify',
  validate: new SimpleSchema({
    usersToNotify: {
      type: Object,
      blackbox: true
    },
    experience: {
      type: Schema.Experience
    },
    incidentId:{
      type: String
    }
  }).validator(),
  run({usersToNotify, experience, incidentId}){
    var situationNeeds = Incidents.findOne({_id: incidentId}).situationNeeds;
    Object.keys(usersToNotify).forEach((key)=>{
      var newUsers = usersToNotify[key]
      newUsers.forEach((u)=>{
        var sitNeed = getSitutationNeedByName(situationNeeds, key)
        if(!sitNeed.notifiedUsers.includes(u)){
          sitNeed.notifiedUsers.push(u);
        }
      });
    });
    Incidents.update({_id: incidentId}, {$set: {"situationNeeds": situationNeeds}}, (err, docs) => {
      if (err) { console.log(err); }
    });

    Object.keys(usersToNotify).forEach((key) =>{
      prepareToNotifyUsers(usersToNotify[key], experience, incidentId);
      usersToNotify[key].forEach((user)=>{
        var location = Locations.findOne({uid: user})
        NotificationLog.insert({userId: user, task: key, lat: location.lat, lng: location.lng, experienceId: experience._id, incidentId: incidentId}, (err, docs) => {
          if (err) { console.log(err); }
        });
      })

      Cerebro.notify({
        userIds: usersToNotify[key],
        experienceId: experience._id,
        subject: "Event " + experience.name + " is starting for " + key,
        text: experience.notificationText,
        route: "apiCustom"
      });
    })
  }
});

// START EXPERIENCE
export const leggo = new ValidatedMethod({
  name: 'api.leggo',
  validate: new SimpleSchema({
    incidentId:{
      type: String
    },
  }).validator(),
  run({incidentId}){
    console.log("starting experience with incident ", incidentId)

    if( WIPQueue.findOne({incidentId:incidentId}) == null){
      WIPQueue.insert({incidentId: incidentId});
    }

    interval =  Meteor.setInterval(function(){
      var incident = Incidents.findOne({_id: incidentId});
      var results = Submissions.find({incidentId: incidentId}).fetch();
      var experienceId = incident.experienceId;
      var experience = Experiences.findOne({_id:experienceId});
      var wipInstanceNeeds = getUnfinishedNeeds(incident, results, experience);
      if(wipInstanceNeeds.length == 0){
        console.log("DONE WE FINISHED!")
        Meteor.call("api.stop", {experienceId: experienceId})
        return true;
      }

      var potentialUsersToNotify = {};

      wipInstanceNeeds.forEach((need)=>{
        var allUsersWithAffordance = queryFor(need.affordance);
        removeUsersWhoMovedFromNeed(allUsersWithAffordance, need, experienceId, incidentId);
        removeUsersWhoParticpatedFromNeed(allUsersWithAffordance, need, experienceId, incidentId);
        removeUsersWhoHaveNotParticipated(allUsersWithAffordance, need, experienceId, incidentId);
        var possible_users = usersNotNotified(allUsersWithAffordance); //possible_users haven't been notified
        potentialUsersToNotify[need.name] = possible_users;
        console.log("available users", potentialUsersToNotify)
      });

      var assignWhoToNotify = notificationFunctions[experience.notificationStrategy]
      var usersToNotify = assignWhoToNotify(potentialUsersToNotify, wipInstanceNeeds);
      console.log('usersToNotify: ', usersToNotify);
      Meteor.call('notify', {usersToNotify, experience, incidentId});
    }, 10000, true)
  }
});

// STOP EXPERIENCE
var interval;
export const stop = new ValidatedMethod({
  name: 'api.stop',
  validate: new SimpleSchema({
    experienceId:{
      type: String
    }
  }).validator(),
  run({experienceId}){
    var experience = Experiences.findOne({_id: experienceId})

    WIPQueue.remove({incidentId: {$eq: experience.activeIncident} });

    Meteor.clearInterval(interval);
    removeFromAllActiveExperiences.call({ experienceId: experienceId });
    Experiences.update({
      _id: experienceId
    }, {
      $unset: { 'activeIncident': 0 }
    });
  }
});
