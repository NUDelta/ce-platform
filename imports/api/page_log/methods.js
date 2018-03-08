import {Meteor} from "meteor/meteor";
import {Page_log} from "./page_log";


Meteor.methods({
  insertLog(dic){
    Page_log.insert(dic, (err, docs) => {
      if (err) {
        console.log('upload error,', err);
      } else {
      }
    });
  }
});
