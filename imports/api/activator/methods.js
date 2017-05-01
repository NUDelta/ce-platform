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


import './custom_options.js'
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
export const cheers = new ValidatedMethod({
  name: 'api.cheers',
  validate: new SimpleSchema({
    experienceId:{
      type: String
    }
  }).validator(),
  run({experienceId}){
    console.log("starting Cheers")
    var mainGoal = function(results, experience){
      var paritions = experience.parts;
      console.log("checking main goal to see if we have met our main goal")
      return (getResultsByTag(results, "left").length >= getP(paritions, "left").max && (getResultsByTag(results, "right").length  >= getP(paritions, "right").max) );
    };
    var miniGoal = function(part_name, results, experience){
      console.log("checking mini goal for " + part_name)
      return getResultsByTag(results, part_name).length >= getP(experience.parts, part_name).max;
    };

    var experience = Experiences.findOne(experienceId);
    var incidentId = Meteor.call('api.createIncident', {experience: experience, launcher_id: this.userId})

    interval =  Meteor.setInterval(function(){
      var results = Images.findOne({incidentId: incidentId}).fetch();

      experience = Experiences.findOne(experienceId);

      if(mainGoal(results, experience)){
        console.log("DONE WE FINISHED!")
        Meteor.call("stopCheers", {experienceId: experienceId})
        return true;
      }
      console.log("we have not met main goal so lets go!");
      var incident = Incidents.findOne(incidentId);
      var parts = experience.parts;
      var available_users = [];


      //TODO: if a user looses an affordance, their activeIncident
      for(var i = 0; i < parts.length; i++){
        if(miniGoal(parts[i].name, results, experience) == false){
          removeOldUsers(incident.userMappings[i].users, parts[i].affordance, experienceId)
          console.log("still looking for " + parts[i].name);
          var possible_users = queryFor(parts[i].affordance)
          available_users.push({"name": parts[i].name, "users": usersAvalibleNow(possible_users)});
        }else{
          console.log("met our mini goal, so not looking at " + parts[i].name);
          //available_users.push({"name": parts[i].name, "users": []});

        }
      }
      var userMappings = notifyUsersIfTwoFree(available_users);
      console.log("about to call notify with", userMappings)
      Meteor.call("notify", {userMappings, experience, incidentId});

    }, 15000, true)
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
  validate: new SimpleSchema({
    experienceId:{
      type: String
    }
  }).validator(),
  run({experienceId}){
    console.log("starting American Flag")
    var mainGoal = function(results, experience){
      var paritions = experience.parts;
      console.log("checking main goal to see if we have met our main goal")
      return (getResultsByTag(results, "blue").length >= getP(paritions, "blue").max && (getResultsByTag(results, "red").length  >= getP(paritions, "red").max) && (getResultsByTag(results, "white").length  >= getP(paritions, "white").max));
    };
    var miniGoal = function(part_name, results, experience){
      console.log("checking mini goal for " + part_name)
      return getResultsByTag(results, part_name).length >= getP(experience.parts, part_name).max;
    };

    console.log("made it this far", experienceId, this.userId);

    var incidentId = Meteor.call('api.createIncident', {experience_id: experienceId, launcher_id: this.userId})
    console.log("inc id is now ", incidentId)
    interval =  Meteor.setInterval(function(){
      var results = Images.find({incidentId: incidentId}).fetch();

      experience = Experiences.findOne({_id:experienceId});

      if(mainGoal(results, experience)){
        console.log("DONE WE FINISHED!")
        Meteor.call("stop", {experienceId: experienceId})
        return true;
      }
      console.log("we have not met main goal so lets go!");

      var parts = experience.parts;
      var available_users = [];
      var incident = Incidents.findOne({_id: incidentId});
      //TODO: if a user looses an affordance, their activeIncident
      for(var i = 0; i < parts.length; i++){
        if(miniGoal(parts[i].name, results, experience) == false){
          console.log("still looking for " + parts[i].name);
          removeOldUsers(incident.userMappings[i].users, parts[i].affordance, experienceId)
          var possible_users = queryFor(parts[i].affordance)
          available_users.push({"name": parts[i].name, "users": usersAvalibleNow(possible_users)});
        }else{
          console.log("met our mini goal, so not looking at " + parts[i].name);
          //available_users.push({"name": parts[i].name, "users": []});

        }
      }

      var userMappings = notifyUsersEvenly(available_users);

      Meteor.call("notify", {userMappings, experience, incidentId});

    }, 10000, true)
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
  console.log("query returned", mapped)
  return mapped;
}
function containsAffordance(user_affordances, search_affordance){
  return user_affordances.includes(search_affordance);
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

  export const createIncident = new ValidatedMethod({
    name: 'api.createIncident',
    validate: new SimpleSchema({
      experience_id: {
        type: String
      },
      launcher_id: {
        type: String
      }
    }).validator(),
    run({experience_id, launcher_id}) {
      var experience = Experiences.findOne({_id:experience_id});
      console.log("THE experimence is", experience)
      var pu = [];
      for(var i =0; i < experience.parts.length; i++){
        pu.push({"name": experience.parts[i].name, "users": []});
      }
      const incidentId = Incidents.insert({
        date: Date.parse(new Date()),
        name: experience.name,
        experienceId: experience._id,
        launcher: launcher_id,
        userMappings: pu
      },  (err, docs) => {
        if (err) { console.log("errorrr", err); }
        else {}
      });
      Experiences.update( experience._id, { $set: { activeIncident: incidentId } });
      return incidentId;
    }
  });


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
