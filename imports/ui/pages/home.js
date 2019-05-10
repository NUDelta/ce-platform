import './home.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Experiences, Incidents } from '../../api/OCEManager/OCEs/experiences';
import { Assignments } from '../../api/OpportunisticCoordinator/databaseHelpers';

import '../components/active_experience.js';
import {needAggregator} from "../../api/OpportunisticCoordinator/strategizer";
import {setIntersection} from "../../api/custom/arrayHelpers";

Template.home.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.set('render', true);
  this.autorun(() => {
    Template.instance().state.set('render', true);
    this.subscribe('experiences.activeUser');
    this.subscribe('incidents.activeUser');
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
  activeUserAssigment() {
    if (Template.instance().subscriptionsReady()) {
      // create [{iid: incident_id, experience: experience, detectorId: detector_id}]
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

        _.forEach(needNamesBinnedByDetector, (needNamesForDetector, detectorId) => {
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
            'detectorId': detectorId
          });

        });

      });

      return output;
    }
  },
  noActiveIncidents() {
    let currActiveIncidents = Meteor.users.findOne(Meteor.userId()).profile.activeIncidents;
    return currActiveIncidents === null || currActiveIncidents.length === 0;
  },
  getCurrentExperience(iid) {
    Template.instance().state.get('render');

    return {
      experience: Experiences.findOne(Incidents.findOne(iid).eid)
    }
  }
});
