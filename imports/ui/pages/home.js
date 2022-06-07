import './home.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Experiences, Incidents } from '../../api/OCEManager/OCEs/experiences';
import { Assignments } from '../../api/OpportunisticCoordinator/databaseHelpers';

import {RActiveExperience} from "../react-component/r_active_experience.js";
import '../components/active_experience.js';
import {needAggregator} from "../../api/OpportunisticCoordinator/strategizer";
import {setIntersection} from "../../api/custom/arrayHelpers";
import {getUserActiveIncidents} from "../../api/UserMonitor/users/methods";



Template.home.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.set('render', true);
  this.autorun(() => {
    Template.instance().state.set('render', true);
    // this.subscribe('experiences.activeUser');
    this.subscribe('experiences.all');
    // this.subscribe('incidents.activeUser');
    this.subscribe('incidents.all');
    this.subscribe('assignments.activeUser');
  });
});

Template.home.events({
  'click .refresh'() {
    ///Template.instance().state.set('render', false);
    Template.instance().state.get('render');
    Template.instance().state.set('render', false);
    location.reload();
  },
});

Template.home.helpers({
  RActiveExperience() {
    // log.info(RActiveExperience);
    
    return RActiveExperience;
  },
  activeUserAssigment() {
    if (Template.instance().subscriptionsReady()) {
      // create [{iid: incident_id, experience: experience, detectorUniqueKey: detector_id}]
      let activeAssignments = Assignments.find().fetch();
      let output = [];
      
      _.forEach(activeAssignments, (assignment) => {

        let iid = assignment._id;
        let incident = Incidents.findOne(iid);

        // TODO(rlouie): errors on refresh? try the competing resource test garret/barrett
        let needNamesBinnedByDetector = needAggregator(incident);

        // gah I wish the assignments had its own interface
        let assignedNeedNames = assignment.needUserMaps.map(currNeedUserMap => {
          if (currNeedUserMap.users.find(user => user.uid === Meteor.userId())) {
            return currNeedUserMap.needName;
          }
        });

        _.forEach(needNamesBinnedByDetector, (needNamesForDetector, detectorUniqueKey) => {
          let assignedNeedNamesForDetector = setIntersection(assignedNeedNames, needNamesForDetector);
          if (assignedNeedNamesForDetector.length === 0) {
            // user not assigned to any needs for this detector
            return;
          }
          // get experience
          let experience = Experiences.findOne(Incidents.findOne(iid).eid);

          // instead of knowing the specific need at the home screen,
          // we only know the associated iid/detector; dynamic routing to the need will happen
          output.push({
            'iid': assignment._id,
            'experience': experience,
            'detectorUniqueKey': detectorUniqueKey
          });

        });

      });

      return output;
    }
  },
  noActiveIncidents() {
    let user = Meteor.users.findOne(Meteor.userId());

    // note(rlouie): was forced to use getUserActiveIncidents rather than user.activeIncidents collection helper
    let currActiveIncidents = getUserActiveIncidents(user._id);

    return (typeof currActiveIncidents === 'undefined' ||
            currActiveIncidents === null ||
            currActiveIncidents.length === 0);
  },
  getCurrentExperience(iid) {
    Template.instance().state.get('render');

    return {
      experience: Experiences.findOne(Incidents.findOne(iid).eid)
    }
  },
  allExperience() {
    if (Template.instance().subscriptionsReady()) {
    let user = Meteor.users.findOne(Meteor.userId());
    let aff = user.profile.staticAffordances;
    let pair = Object.keys(aff).filter(k => k.search('pair') != -1)[0];

    let allIncidents = Incidents.find().fetch();
    // console.log(`allIncidents: ${allIncidents}`);
    let output = [];
    _.forEach(allIncidents, (incident) => {
      if(incident.contributionTypes[0].needName.includes(pair)) {
        let currentExp = incident.contributionTypes[0].needName.split('pair')[0].toLowerCase();
        if(currentExp === 'selfintro' && ('participatedInSelfIntro' in aff) ) {
          //don't show self intro if user hs participated
        } else if (!user.profile.waitOnPartnerSubmission[currentExp]) {  // don't show the experience if the user is waiting for their partner to submit
          // get experience
          let experience = Experiences.findOne(incident.eid);

          let needNamesBinnedByDetector = needAggregator(incident);
          _.forEach(needNamesBinnedByDetector, (needNamesForDetector, detectorUniqueKey) => {
            output.push({
              'iid': incident._id,
              'experience': experience,
              'detectorUniqueKey': detectorUniqueKey
            });
          })
        }
        
      }
    })

    // console.log( "output: ", output);
    return output;
  }
}
});
