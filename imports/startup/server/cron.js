import {Meteor} from "meteor/meteor";
import { SyncedCron } from 'meteor/percolate:synced-cron';
import {Locations} from "../../api/locations/locations";

SyncedCron.config({
  // Default to using localTime
  utc: true,
});


function sendNotificationByTimeZone(offset){
  let uids = Meteor.users.find().fetch().map(function(x){
    return x._id;
  });

  let timezoneUids = uids.filter(function(uid){
    let location = Locations.findOne({uid: uid});
    if(location){
      if(location.affordance["utc_offset"] === offset){
        return true;
      }
    }
    return false;

  });

  Meteor.call('sendNotification', timezoneUids, "Please open this notification to continue receiving experiences :)", "/cron")

}

SyncedCron.add({
  name: 'EST TIME: Send notifications to keep location tracking alive',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('at 2:00pm also at 10:00pm');
  },
  job: function() {
    sendNotificationByTimeZone(-5)
  }
});
SyncedCron.add({
  name: 'CST TIME: Send notifications to keep location tracking alive',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('at 3:00pm also at 11:00pm');
  },
  job: function() {
    sendNotificationByTimeZone(-6)
  }
});
// SyncedCron.add({
//   name: 'MST TIME: Send notifications to keep location tracking alive',
//   schedule: function(parser) {
//     // parser is a later.parse object
//     return parser.text('at 4:00pm also at 0:00am');
//   },
//   job: function() {
//     sendNotificationByTimeZone(-7)
//   }
// });
SyncedCron.add({
  name: 'PST TIME: Send notifications to keep location tracking alive',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('at 5:00pm also at 1:00am');
  },
  job: function() {
    sendNotificationByTimeZone(-8)
  }
});
SyncedCron.add({
  name: 'test!!',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('at 5:35pm also at 5:40pm');
  },
  job: function() {
    sendNotificationByTimeZone(-6)
  }
});

Meteor.startup(() => {
  SyncedCron.start();
});