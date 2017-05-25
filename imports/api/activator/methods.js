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
import { Images } from '../images/images.js';

import { Random } from 'meteor/random'

var notifyOneUser = function (potentialUsers, situationalNeeds) {
  var usersToNotify = {};
  var alreadyNotified = [];

  var ogKeys = Object.keys(potentialUsers)

  //remove the potentialUsers for situationalNeeds that already have a users who have been notified
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

      } else {
        usersToNotify[theKey] = [user];
        alreadyNotified.push(user);
      }
    }
  }
  return usersToNotify;
}

var notificationFunctions = {"greedyOrganization": greedyOrganization, "notifyOneUser": notifyOneUser};

export const leggo = new ValidatedMethod({
  name: 'api.leggo',
  validate: new SimpleSchema({
    incidentId:{
      type: String
    },
    notificationStrategy: {
      type:String
    },
  }).validator(),
  run({incidentId, notificationStrategy}){
    console.log("starting experience with incident ", incidentId)
    interval =  Meteor.setInterval(function(){
      var incident = Incidents.findOne({_id: incidentId});

      var results = Submissions.find({incidentId: incidentId}).fetch();
      var experienceId = incident.experienceId;
      var experience = Experiences.findOne({_id:experienceId});

      var wipInstanceNeeds = getUnfinishedNeeds(incident, results, experience);
      if(wipInstanceNeeds.length == 0){
        console.log("DONE WE FINISHED!")
        Meteor.call("stop", {experienceId: experienceId})
        return true;
      }
      console.log("unmet needs", wipInstanceNeeds);

      var potentialUsersToNotify = {};

      wipInstanceNeeds.forEach((need)=>{
        var allUsersWithAffordance = queryFor([need.affordance]);
        removeUsersWhoMovedFromNeed(allUsersWithAffordance, need, experienceId, incidentId);
        var possible_users = usersNotNotified(allUsersWithAffordance); //possible_users haven't been notified
        potentialUsersToNotify[need.name] = possible_users;
        console.log("available users", potentialUsersToNotify)
      });


      var assignWhoToNotify = notificationFunctions[notificationStrategy]
      var usersToNotify = assignWhoToNotify(potentialUsersToNotify, wipInstanceNeeds);
      console.log('usersToNotify: ', usersToNotify);

      Meteor.call('notify', {usersToNotify, experience, incidentId});
    }, 10000, true)
  }
});

var globalCallbacks = {}

function registerCallback(experienceId, templateName, callback){
  if(experienceId in globalCallbacks){
    globalCallbacks[experienceId][templateName]= callback;
  }
  else{
    globalCallbacks[experienceId]= {};
    globalCallbacks[experienceId][templateName] = callback;
  }
}

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
      // }, (err, docs) => {
      //   if (err) { console.log(err); } else{
      //     console.log("docs", docs);
      //   }
    });

    var callback = null;
    if(experienceId in globalCallbacks){
      console.log("we are looking for", situationNeed.contributionTemplate, "inside ", globalCallbacks[experienceId])
      if(situationNeed.contributionTemplate in globalCallbacks[experienceId]){
        callback = globalCallbacks[experienceId][situationNeed.contributionTemplate]
        var mostRecent = Submissions.findOne({incidentId:incidentId}, {sort:{$natural:-1}})
        console.log("ABOUT TO CALL THE CALLBACK");
        console.log("most recent: ", mostRecent);
        return callback(mostRecent);
      }
    }
  }
});

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
  var wait = 5*60*100
  Meteor.setTimeout(function(){
    removeSpecificUsersFromNeed(usersToRemove, situationNeed, experienceId, incidentId)
  }, wait)
} 

function checkIfSituationNeedFinished(results, situationNeed, contributionTemplate){
  var soft_stopping_criteria = situationNeed.softStoppingCriteria;
  if(results.length == 0){
    return false;
  }
  var incidentId = results[0].incidentId;
  if(situationNeed.done == true){
    console.log("our situation need is done so not calling a callback", situationNeed)
    return true;
  }
  if("total" in soft_stopping_criteria){
    var numFinished = results.filter(function(n){
      console.log("compare", situationNeed.name , n.situationNeed)
        return situationNeed.name === n.situationNeed;
      }).length;
      console.log("numFinished", numFinished)
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
    console.log('number done for ', contributionTemplate.name,  numDone);

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
    console.log("we have enough group results so we are done!")
    return []
  }
  else {
    if(notFinished.length == 0) {
      var updatedIncident = Incidents.findOne({_id: incident._id})
      var notDone = updatedIncident.situationNeeds.filter(function(x){
        return x.done == false;
      })
      console.log("All situation needs are done but the group isn't ahhh what to do here!?");
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

export const makeIncident = new ValidatedMethod({
  name: 'api.makeIncident',
  validate: new SimpleSchema({
    experienceId:{
      type: String
    }
  }).validator(),
  run({experienceId}){
    var experience = Experiences.findOne(experienceId);
    const incident = {
      experienceId: experienceId,
      name: experience.name,
      date: Date.parse(new Date()),
      users_need_mapping: [],
    }
    var incidentId = Incidents.insert(incident);
    Experiences.update(experienceId, {
      $set: {activeIncident: incidentId}
    });
    return incidentId;
  }
});

var interval;
export const stop = new ValidatedMethod({
  name: 'stop',
  validate: new SimpleSchema({
    experienceId:{
      type: String
    }
  }).validator(),
  run({experienceId}){
    console.log("STOPPING");
    //TODO: also remove the experience for the users
    Meteor.clearInterval(interval);
    removeFromAllActiveExperiences.call({ experienceId: experienceId });
    Experiences.update({
      _id: experienceId
    }, {
      $unset: { 'activeIncident': 0 }
    });
  }
});

export const storyBook = new ValidatedMethod({
  name: 'api.storyBook',
  validate: null,
  run(){
    var createNewPageNeed = function(mostRecentSubmission) {
      var textId = mostRecentSubmission.content.nextAffordance;
      var nextAffordance = TextEntries.findOne({_id: textId}).text;
      Meteor.call("api.addSituationNeeds", {
        incidentId: incidentId,
        need: {
          "name": "nextScene"+ nextAffordance + Random.id(3),
          "contributionTemplate" : "scene",
          "affordance": nextAffordance,
          "softStoppingCriteria": {"total": 1}
        }
      });
    }
    var storyPageTemplate = {
      "name" : "scene",
      "contributions" : {"illustration": "Image", 
                        "nextSentence": "String",  
                        "nextAffordance": ["Dropdown", ["daytime", "clouds", "hackerspace", "end_of_f_wing", "atrium", "k_wing", "l_wing", "starbucks", "coffee", "donuts", "collegeuniv", "sushi"]] }
    };
    const experienceId = Meteor.call("api.createExperience", {
      name: "Storytime",
      description: "Write a story",
      participateTemplate: "storyPage", 
      resultsTemplate: "storyPageResults",
      notificationText: "blah",
      contributionGroups: [{contributionTemplates: [storyPageTemplate], stoppingCriteria: {"total": 10}}]
    });

    registerCallback(experienceId, "scene", createNewPageNeed);

    const incidentId = Meteor.call("api.createIncident", {
      experienceId: experienceId
    });
    Meteor.call("api.addSituationNeeds", {
      incidentId: incidentId,
      need: {
        "name": "page0",
        "contributionTemplate" : "scene",
        "affordance": "clouds",
        "softStoppingCriteria": {"total": 1}
      }
    });
    Meteor.call("api.leggo", {incidentId: incidentId, notificationStrategy: "notifyOneUser"});
  }
})

export const americanFlag = new ValidatedMethod({
  name: 'api.americanFlag',
  validate: null,
  run(){
    var redTemplate = {
      "name" : "red",
      "contributions" : {"red": "Image"},
    };
    var whiteTemplate = {
     "name" : "white",
     "contributions" : {"white": "Image"},
    };
    var blueTemplate = {
      "name" : "blue",
      "contributions" : {"blue": "Image"},
    };
    const experienceId = Meteor.call("api.createExperience", {
      name: "FLAGTEST",
      description: "Build a flag",
      participateTemplate: "americanFlag",
      resultsTemplate: "americanFlagResults",
      notificationText: "blah",
      contributionGroups: [{contributionTemplates: [redTemplate], stoppingCriteria: {"total": 1}},
                          {contributionTemplates: [blueTemplate], stoppingCriteria: {"total": 1}},
                          {contributionTemplates: [whiteTemplate], stoppingCriteria: {"total": 1}}]
    });
    console.log(experienceId)
    const incidentId = Meteor.call("api.createIncident", {
      experienceId: experienceId
    });

    Meteor.call("api.addSituationNeeds", {
      incidentId: incidentId,
      need: {
        "name": "whiteNeed",
        "contributionTemplate" : "white",
        "affordance": "clouds",
        "softStoppingCriteria": {"total": 1} //if finished but experience isn't then ignore
      }
    });
    Meteor.call("api.addSituationNeeds", {
      incidentId: incidentId,
      need: {
          "name": "redNeed",
          "contributionTemplate" : "red",
          "affordance": "grocery",
          "softStoppingCriteria": {"total": 1} //if finished but experience isn't then ignore
        }
    });
    Meteor.call("api.addSituationNeeds", {
      incidentId: incidentId,
      need: {
        "name": "california",
        "contributionTemplate" : "blue",
        "affordance": "beaches",
        "softStoppingCriteria": {"total": 1} //if finished but experience isn't then ignore
      }
    });
    Meteor.call("api.leggo", {incidentId: incidentId, notificationStrategy: "greedyOrganization"});
  }
});

function getSitutationNeedByName(sitatuionNeeds, name){
  return sitatuionNeeds.filter(function(n){
    return n.name == name;
  })[0];
}

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
      prepareToNofityUsers(usersToNotify[key], experience, incidentId);
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

function getP(parts, tag){
  var filtered = parts.filter(function(x){
    return (x.name == tag);
  });
  return filtered[0];
}

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
  search_affordance = search_affordance;
  search_affordance = search_affordance.filter(function(x){return x != null;});
  var intersect = _.intersection(user_affordances, search_affordance)
  return intersect.length == search_affordance.length;
}

function getResultsByTag(results, tag){
  if(results.length == 0){
    return [];
  }
  var filtered = results.filter(function(x){
    return x.details == tag;
  })
  return filtered;
}

export const runExperience = new ValidatedMethod({
  name: 'api.runExperience',
  validate: new SimpleSchema({
    experienceId: {
      type: String
    }
  }).validator(),
  run({experienceId}){
  }
});

function notifyUsersEvenly(available_users){
  usersToNotify = [];
  for(var j = 0; j< available_users.length; j++){
    usersToNotify.push({"name": available_users[j].name, "users":[]})
  }
  while(available_users.length > 0){
    available_users.sort(function(a,b){
      return a.users.length - b.users.length;
    });
    var user = available_users[0].users.pop();

    if(user == null){
      available_users = available_users.slice(1);
    }
    else{
      var filtered = usersToNotify.filter(function(x){
        return x.name == available_users[0].name;});

      var alreadyAdded = usersToNotify.map(function(x){
        return x.users.includes(user)
      });

      if(!(alreadyAdded.includes(true))){
        filtered[0].users.push(user);
      }
    }
  }
  return usersToNotify;
}

WAIT_TIME = 180000;

export const usersNotNotified = function(possibleUserIds){
  console.log("calling users avalible now")
  userIdsAvalibleNow = []

  for(let i in possibleUserIds){
    userId = possibleUserIds[i]
    let user_location = Locations.findOne({uid: userId});
    if(user_location == null){
      continue;
    }
    now = Date.parse(new Date());
    if(user_location.lastNotification == null || (now - user_location.lastNotification) > (7*60000)){
      //they are avalible
      console.log(now - user_location.lastNotification)
      userIdsAvalibleNow.push(userId);
    }
  }
  console.log("returing users avalible now", userIdsAvalibleNow)
  return userIdsAvalibleNow;
}

export const prepareToNofityUsers = function(userIds, experience, activeIncident){
  console.log(userIds)
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
