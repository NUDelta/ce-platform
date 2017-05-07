//launch experience methods
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
import { _ } from 'meteor/underscore';

import { Incidents } from '../incidents/incidents.js';
import { Images } from '../images/images.js';

import { Random } from 'meteor/random'

import './custom_options.js'

export const leggo = new ValidatedMethod({
  name: 'api.leggo',
  validate: new SimpleSchema({
    experienceId:{
      type: String
    }
  }).validator(),
  run({experienceId}){
    var incidentId = Meteor.call('api.makeIncident', {experienceId: experienceId});
    Meteor.call('api.addNeedInstances', {incidentId: incidentId});

    console.log("starting experience with new incident ", incidentId)

    interval =  Meteor.setInterval(function(){
      var results = Images.find({incidentId: incidentId}).fetch();
      var experience = Experiences.findOne({_id:experienceId});
      var incident = Incidents.findOne({_id: incidentId});

      var wipInstanceNeeds = getUnfinsihedNeeds(results, experience, incident);

      if(wipInstanceNeeds.length == 0){
        console.log("DONE WE FINISHED!")
        Meteor.call("stop", {experienceId: experienceId})
        return true;
      }

      console.log("we have not met main goal so lets go!");

      var available_users = {};
      wipInstanceNeeds.forEach((need)=>{
        //removeOldUsers()
          //have to first get into situtaional groups, make this a seperate function
        var situtationAffordance;
        experience.situation_groups.forEach((group)=>{
          var situation = group.filter(function(s){
            return s.name ==  need.situational_need_name })[0];
          if(situation){
            situtationAffordance = situation.affordance;
          }
        });
        var possible_users = queryFor([situtationAffordance, need.affordance]);
        if(available_users[need.situational_need_name]== null){
          available_users[need.situational_need_name] = possible_users;
        }else{
          available_users[need.situational_need_name] = available_users[need.situational_need_name].concat(possible_users)
        }
        console.log(available_users)
      });

      var reFormatted = [];
      Object.keys(available_users).forEach((key)=>{
        console.log(key);
        reFormatted.push({"name": key, "users": available_users[key]})
      });
      console.log(reFormatted)
      var userMappings = greedyOrganization(reFormatted);
      console.log("userMappings: ", userMappings)
      //
      // Meteor.call("notify", {userMappings, experience, incidentId});

    }, 10000, true)
  }
});

function greedyOrganization(available_users){
  console.log("in greedy organization", available_users)
  usersToNotify = [];
  for(var j = 0; j< available_users.length; j++){
    usersToNotify.push({"name": available_users[j].name, "users":[]})
  }
  console.log("usersToNotify", usersToNotify)
  while(available_users.length > 0){
    available_users.sort(function(a,b){
      return a.users.length - b.users.length;
    });

    var user = available_users[0].users.pop();
    console.log("user", user)
    if(user == null){
      available_users = available_users.slice(1);
    }else{
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

function getUnfinsihedNeeds(results, experience, incident){
  var unfinished = [];
  experience.situation_groups.forEach((group)=>{
    group.forEach((sitNeed)=>{
      var stopping_criteria = sitNeed.stopping_criteria;
      if("total" in stopping_criteria){
        var total = results.filter(function(x){ x.name == sitNeed.name}).length;
        if(total < stopping_criteria.total){
          var matchingInstances = incident.users_need_mapping.filter(function(x){
            return x.situational_need_name == sitNeed.name});
          matchingInstances.forEach((instance)=>{
            if(instance.stopping_criteria == null){
              unfinished.push(instance)
            }
            else if("total" in instance.stopping_criteria){
              var total = results.filter(function(x){ return x.id == instance.id}).length;
              if(total < instance.stopping_criteria.total){
                unfinished.push(instance)
              }
            }
          });
        }
      }
    });
  });
  console.log(unfinished)
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
    console.log("making an indcidnet for ", experienceId)
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
    console.log("Incident added!", incidentId);
    return incidentId;
  }
});

export const addNeedInstances = new ValidatedMethod({
  name: 'api.addNeedInstances',
  validate: new SimpleSchema({
    incidentId:{
      type: String
    }
  }).validator(),
  run({incidentId}){
    var incident = Incidents.findOne(incidentId);
    const needInstance =

    Incidents.update({_id: incidentId},
      {$push: {users_need_mapping:
        {$each:
          [{situational_need_name: "red", id: Random.id(), affordance: null, stopping_criteria: null, users:[]},
          {situational_need_name: "blue", id: Random.id(), affordance: null, stopping_criteria: null, users:[]},
          {situational_need_name: "white", id: Random.id(), affordance: null, stopping_criteria: null, users:[]}]
        }
      }
      },(err, docs) => {
      if (err) {
        console.log(err);
      }else{
        console.log(docs);
      }
    });
    console.log("needs added!");

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



function notifyUsersIfTwoFree(available_users){
  console.log("calling notifyUsersIfTwoFree", available_users)
  usersToNotify = [];
  for(var j = 0; j< available_users.length; j++){
    usersToNotify.push({"name": available_users[j].name, "users":[]})
  }
  var all_users = _.union(available_users[0].users, available_users[1].users)

  if(all_users.length > 1){
    usersToNotify[0].users.push(all_users.pop())
    usersToNotify[1].users.push(all_users.pop())

  }
  console.log("returning notifyUsersIfTwoFree", usersToNotify)

  return usersToNotify;

}

export const test = new ValidatedMethod({
  name: 'api.test',
  validate: new SimpleSchema({
    experienceId:{
      type: String
    }
  }).validator(),
  run({experienceId}){
    console.log("Hiellllloooo test tes tes");

  }
});

export const americanFlag = new ValidatedMethod({
  name: 'api.americanFlag',
  validate: null,
  run(){
    var redTemplate = {
      "name" : "red",
      "contributions" : ["photo"],
    };
    var whiteTemplate = {
     "name" : "white",
     "contributions" : ["photo"],
    };
    var blueTemplate = {
      "name" : "blue",
      "contributions" : ["photo"],
    };
    const experienceId = Meteor.call("api.createExperience", {
      name: "FLAGTEST",
      description: "Build a flag",
      participateTemplate: "photoUpload", //pass in: user
      resultsTemplate: "collage",
      notificationText: "blah",
      contributionGroups: [{contributionTemplates: [redTemplate], stoppingCriteria: {"total": 2}},
                          {contributionTemplates: [blueTemplate], stoppingCriteria: {"total": 50}},
                          {contributionTemplates: [whiteTemplate], stoppingCriteria: {"total": 100}}]
    })
    const incidentId = Meteor.call("api.createIncident", {
      experienceId: experienceId
    });
  }
});

export const notify = new ValidatedMethod({
  name: 'notify',
  validate: new SimpleSchema({
    userMappings: {
      type: [Schema.IncidentPartition],
      // blackbox: true
    },
    experience: {
      type: Schema.Experience
    },
    incidentId:{
      type: String
    }
  }).validator(),
  run({userMappings, experience, incidentId}){
    var ogUm = Incidents.findOne({_id: incidentId}).userMappings;

    userMappings.forEach((userMap, index )=>{
      var newUsers = userMap.users;
      newUsers.forEach((u)=>{
        if(!ogUm[index].users.includes(u)){
          ogUm[index].users.push(u);
        }
      });

    });
    Incidents.update({_id: incidentId}, {$set: {"userMappings": ogUm}}, (err, docs) => {
      if (err) { console.log(err); }
    });

    userMappings.forEach((userMap) =>{
      prepareToNofityUsers(userMap["users"], experience, incidentId);
      Cerebro.notify({
        userIds: userMap["users"],
        experienceId: experience._id,
        subject: "Event " + experience.name + " is starting for " + userMap["name"],
        text: experience.startText,
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
    experience: {
      type: Schema.Experience
    }
  }).validator(),
  run({experience}){
    Meteor.call('api.americanFlag', experience._id)
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
    }else{
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


function removeOldUsers(users, affordance, experienceId){
  userIdsToRemove = []

  users.forEach((user)=>{
    var user_location = Locations.findOne({uid:user})
    console.log(user_location.affordances, affordance);
    if(! containsAffordance(user_location.affordances, affordance)){
      console.log("yo doesn't contain affordance anymore")
      userIdsToRemove.push(user);
    }
  });


  if(userIdsToRemove.length > 0){
    console.log("removing usrs", userIdsToRemove, experienceId)
    Cerebro.removeActiveExperiences(userIdsToRemove, experienceId);
  }


}
  export const usersAvalibleNow = function(possibleUserIds){
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
