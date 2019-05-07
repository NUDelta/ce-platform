import './dynamic_participate.html';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import {Incidents} from "../../api/OCEManager/OCEs/experiences";
import {Submissions} from "../../api/OCEManager/currentNeeds";
import {needAggregator} from "../../api/OpportunisticCoordinator/strategizer";
import {Assignments} from "../../api/OpportunisticCoordinator/databaseHelpers";

Template.dynamicParticipate.onCreated(function() {
  this.uid = Meteor.userId();
  this.iid = Router.current().params.iid;
  this.detectorId = Router.current().params.detectorId;
  const handles = [
    this.subscribe('incidents.single', this.iid),
    this.subscribe('assignments.single', this.iid),
    this.subscribe('submissions.activeIncident', this.iid),
  ];

  this.autorun(() => {
    const areReady = handles.every(handle => handle.ready());
    console.log(`Handles are ${areReady ? 'ready' : 'not ready'}`);

    if (areReady) {

      // Dynamic Need Chooser
      // OCE side: From a single detector, and groupedNeeds
      // User side: User has
      // 1) already participated in a half half need
      // 2) participate screen is already opened by another person (e.g., they have truly taken the resource)
      // Find the groupedNeeds

      this.incident = Incidents.findOne();
      this.assignment = Assignments.findOne();
      let needNamesBinnedByDetector = needAggregator(this.incident);

      let potentialNeeds = needNamesBinnedByDetector[this.detectorId];

      // TODO: filter additionally by only the needs in which this user is assigned to

      const numberSubmissionsRemaining = (iid, needName) => {
        let numberPeopleNeeded = Submissions.find({
          iid: iid,
          needName: needName,
          uid: null
        }).count();
        return numberPeopleNeeded;
      };

      /**
       * needA will be given a higher value in the sorting, if needA has more submission left
       * (e.g., a photo that needs 1 more person to complete it will
       * @param needA
       * @param needB
       * @return {number}
       */
      const prioritizeHalfCompletedNeeds = (needA, needB) => {
        return numberSubmissionsRemaining(this.iid, needB) - numberSubmissionsRemaining(this.iid, needA);
      };

      potentialNeeds.sort(prioritizeHalfCompletedNeeds); // mutates

      // at this point, assignments are already filtered by user has already participated in this need

      // TODO: create collection that monitors the participateSemaphore; then filter the potentials

      // choose the top-1, then dynamically redirect to that participate
      const chosenNeedName = potentialNeeds[0];
      Router.go(`/apicustom/${this.iid}/${this.incident.eid}/${chosenNeedName}`);

      // _.forEach(needNamesBinnedByDetector, (commonDetectorNeedNames, detectorId) => {
      //   relevantAssignments
      // });
      // this.assignment
    }
  });
});

