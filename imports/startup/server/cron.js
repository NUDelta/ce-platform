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
    console.log("location", location);
    if(location && location.affordances){
      if(location.affordances["utc_offset"] === offset){
        return true;
      }
    }
    return false;

  });

  Meteor.call('sendNotification', timezoneUids, "Open this notification to be eligible to get experiences today!", 'https://ce-platform.herokuapp.com/cron')

}

SyncedCron.add({
  name: 'EST TIME: Send notifications to keep location tracking alive',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('at 2:00pm also at 10:30pm');
  },
  job: function() {
    sendNotificationByTimeZone(-5)
  }
});
SyncedCron.add({
  name: 'CST TIME: Send notifications to keep location tracking alive',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('at 5:00pm also at 11:30pm');
  },
  job: function() {
    sendNotificationByTimeZone(-6)
  }
});
SyncedCron.add({
  name: 'MST TIME: Send notifications to keep location tracking alive',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('at 4:00pm also at 12:30am');
  },
  job: function() {
    sendNotificationByTimeZone(-7)
  }
});
SyncedCron.add({
  name: 'PST TIME: Send notifications to keep location tracking alive',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('at 5:00pm also at 1:30am');
  },
  job: function() {
    sendNotificationByTimeZone(-8)
  }
});
// SyncedCron.add({
//   name: 'test!!',
//   schedule: function(parser) {
//     // parser is a later.parse object
//     return parser.text('at 9:45pm');
//   },
//   job: function() {
//     sendNotificationByTimeZone(-6)
//   }
// });

Meteor.startup(() => {
  SyncedCron.start();
});