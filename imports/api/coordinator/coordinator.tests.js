import { _ } from 'meteor/underscore';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import {Assignments} from "./assignments";
import {updateAvailability} from "./methods";

describe('Availability Tests', function () {
  let ID1 = "26Jjd7ffARhLvZJLs";
  let ID2 = "39Jjd7ffARhLvZJLs";

  beforeEach(function () {
    resetDatabase();
    Assignments.insert({
      iid: ID1,
      needs: [{needName:"need1", users: ["1", "2", "3"]}, {needName:"need2", users: ["5", "3", "4", "1"]}],
    });
    Assignments.insert({
      iid: ID2,
      needs: [{needName:"need3", users: ["8", "2", "5"]}, {needName:"need4", users: ["9", "14", "5"]}],
    });

  });


  it('update availability', function () {
    updateAvailability("1",  {id1: ["need1"], id2: ["need3", "need4"]});
    let firstEntry = Assignments.findOne({iid:ID1});
    let secondEntry = Assignments.findOne({iid:ID2});
    _.forEach(firstEntry.needs, (need) =>{
      if(need.needName === "need1"){
        if(need.users.indexOf("1") === -1){
          return false;
        }
      }
      if(need.needName === "need2"){
        if(need.users.indexOf("1") !== -1){
          return false;
        }
      }
    });

    _.forEach(secondEntry.needs, (need) =>{
      if(need.needName === "need3"){
        if(need.users.indexOf("1") === -1){
          return false;
        }
      }
      if(need.needName === "need4"){
        if(need.users.indexOf("1") !== -1){
          return false;
        }
      }
    });

  })

});