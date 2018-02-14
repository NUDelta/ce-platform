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
      _id: ID1,
      needUserMaps: [{needName:"need1", uids: ["1", "2", "3"]}, {needName:"need2", uids: ["5", "3", "4", "1"]}],
    });
    Assignments.insert({
      _id: ID2,
      needUserMaps: [{needName:"need3", uids: ["8", "2", "5"]}, {needName:"need4", uids: ["9", "14", "5"]}],
    });

  });


  it('update availability', function () {
    updateAvailability("1",  {id1: ["need1"], id2: ["need3", "need4"]});

    let firstEntry = Assignments.findOne({_id:ID1});
    let secondEntry = Assignments.findOne({_id:ID2});

    _.forEach(firstEntry.needUserMaps, (needUserMap) =>{
      if(needUserMap.needName === "need1"){
        if(needUserMap.uids.indexOf("1") === -1){
          chai.assert(false);
        }
      }
      if(needUserMap.needName === "need2"){
        if(needUserMap.uids.indexOf("1") !== -1){
          chai.assert(false);
        }
      }
    });

    _.forEach(secondEntry.needUserMaps, (needUserMap) =>{
      if(needUserMap.needName === "need3"){
        if(needUserMap.uids.indexOf("1") === -1){
          chai.assert(false);
        }
      }
      if(needUserMap.needName === "need4"){
        if(needUserMap.uids.indexOf("1") !== -1){
          chai.assert(false);
        }
      }
    });

  })

});