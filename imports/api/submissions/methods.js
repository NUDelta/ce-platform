import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import {_} from 'meteor/underscore';
import {Submissions} from './submissions.js';


/**
 * Gets the needNames/iid for all unique unfilled entries in the submission DB
 *
 * @returns {object} dictionary of iids and needs in form {iid:[need], iid:[need]}
 */
export const getUnfinishedNeedNames = function () {

  let submissions = Submissions.find({
      uid: null
    }, {
      multi: true
    }
  ).fetch();

  let unfinishedNeeds = {};

  _.forEach(submissions, (sub)=>{
    let iid = sub.iid;
    let needName = sub.needName;
    if(iid in unfinishedNeeds){
      if(unfinishedNeeds[iid].indexOf(needName) === -1){
        unfinishedNeeds[iid].push(needName)
      }
    }else{
      unfinishedNeeds[iid] = [needName]
    }
  });

  return unfinishedNeeds; //{iid:[need], iid:[need]}
}

