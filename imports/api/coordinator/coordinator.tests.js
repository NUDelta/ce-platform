import { _ } from 'meteor/underscore';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import {Availability} from "./availability";
import {updateAvailability} from "./methods";

describe('Availability Tests', function () {
  let ID1 = "26Jjd7ffARhLvZJLs";
  let ID2 = "39Jjd7ffARhLvZJLs";

  beforeEach(function () {
    resetDatabase();

    let ID1 = "26Jjd7ffARhLvZJLs";
    let ID2 = "39Jjd7ffARhLvZJLs";

    Availability.insert({
      _id: ID1,
      needUserMaps: [{needName:"need1", uids: ["1", "2", "3"]}, {needName:"need2", uids: ["5", "3", "4", "1"]}],
    });
    Availability.insert({
      _id: ID2,
      needUserMaps: [{needName:"need3", uids: ["8", "2", "5"]}, {needName:"need4", uids: ["9", "14", "5"]}],
    });

  });


  it('update availability', function () {
    let ID1 = "26Jjd7ffARhLvZJLs";
    let ID2 = "39Jjd7ffARhLvZJLs";

    updateAvailability("1",  {"26Jjd7ffARhLvZJLs": ["need1"], "39Jjd7ffARhLvZJLs": ["need3", "need4"]});

    let firstEntry = Availability.findOne({_id:"26Jjd7ffARhLvZJLs"});
    let secondEntry = Availability.findOne({_id:"39Jjd7ffARhLvZJLs"});

    _.forEach(firstEntry.needUserMaps, (needUserMap) =>{
      if(needUserMap.needName === "need1"){
        if(needUserMap.uids.indexOf("1") === -1){
          chai.assert(false, "user not added to need1");
        }
      }
      if(needUserMap.needName === "need2"){
        if(needUserMap.uids.indexOf("1") !== -1){
          chai.assert(false, "user not removed from need2");
        }
      }
    });

    _.forEach(secondEntry.needUserMaps, (needUserMap) =>{
      if(needUserMap.needName === "need3"){
        if(needUserMap.uids.indexOf("1") === -1){
          chai.assert(false, "user not added to need 3");
        }
      }
      if(needUserMap.needName === "need4"){
        if(needUserMap.uids.indexOf("1") === -1){
          chai.assert(false, "user not added to need 4");
        }
      }
    });

  })

});