import './dynamic_participate.html';
// import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import {Incidents} from "../../api/OCEManager/OCEs/experiences";
import {
  needAggregator, needIsAvailableToParticipateNow, numberSubmissionsRemaining, prioritizeHalfCompletedNeeds
} from "../../api/OpportunisticCoordinator/strategizer";
import {Assignments} from "../../api/OpportunisticCoordinator/databaseHelpers";

Template.dynamicParticipate.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.set('renderWaiting', false);
  this.uid = Meteor.userId();

  if (!this.uid) {
    Router.go('home');
    return;
  }
  this.iid = Router.current().params.iid;
  this.detectorId = Router.current().params.detectorId;
  const handles = [
    this.subscribe('incidents.single', this.iid),
    this.subscribe('assignments.single', this.iid),
    this.subscribe('submissions.activeIncident', this.iid),
    this.subscribe('participating.now.activeIncident', this.iid)
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

      let potentialNeedNames = needNamesBinnedByDetector[this.detectorId];

      // TODO: filter additionally by only the needs in which this user is assigned to
      /**
       * needA will be given a higher value in the sorting, if needA has fewer submissions left
       * (e.g., a photo that needs 1 more person to complete it will be ranked higher)
       * TODO(rlouie): What about the case where some needs have 1 out of 2 more needed,
       *               while others just need 1 out of 1 submission to complete?
       * @param needA
       * @param needB
       * @return {number}
       */
      const prioritizeHalfCompletedNeeds = (needA, needB) => {
        return numberSubmissionsRemaining(this.iid, needB) - numberSubmissionsRemaining(this.iid, needA);
      };
      potentialNeedNames.sort(prioritizeHalfCompletedNeeds); // mutates
      potentialNeedNames = potentialNeedNames.filter(needName => needIsAvailableToParticipateNow(this.incident, needName));

      if (!potentialNeedNames.length) {
        // tell user that somehow they were too late and there are no needs available for them
        // or redirect them away from this page -- don't go route them to a participate screen.
        this.state.set('renderWaiting', true);
        return;
      }

      // choose the top-1, then dynamically redirect to that participate
      const chosenNeedName = potentialNeedNames[0];
      Router.go(`/apicustom/${this.iid}/${this.incident.eid}/${chosenNeedName}`);
    }
  });
});

Template.dynamicParticipate.helpers({
  renderWaiting() {
    return Template.instance().state.get('renderWaiting')
  }
});

Template.dynamicParticipate.onDestroyed(() => {
  if (this.state) {
    this.state.destroy();
  }
});
