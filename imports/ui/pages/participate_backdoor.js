import './participate_backdoor.html';

import {Template} from 'meteor/templating';
import {Submissions} from '../../api/OCEManager/currentNeeds';
import { Experiences } from '../../api/OCEManager/OCEs/experiences';

Template.participate_backdoor_page.onCreated(function() {
  this.autorun(() => {
    this.subscribe('submissions.all');
  });
});

Template.participate_backdoor_page.helpers({
  participateBackdoorArgs() {
    return {
      submissions: Submissions.find().fetch(),
    }
  }
});

Template.participateBackdoor.helpers({
  apiCustomLinks() {
    let links = this.submissions.map((sub) => {
      return `/apicustom/${sub.iid}/${sub.eid}/${sub.needName}`
    });

    return [... new Set(links)];
  }
});

Template.results_backdoor_page.onCreated(function() {
  this.autorun(() => {
    this.subscribe('experiences.all');
    this.subscribe('submissions.all');
  });
});

Template.results_backdoor_page.helpers({
  resultsBackdoorArgs() {
    return {
      submissions: Submissions.find({}).fetch(),
      experiences: Experiences.find({}).fetch()
    }
  }
});


Template.resultsBackdoor.helpers({
  objectAttribute_name(obj) {
    return obj.name;
  },
  objectAttribute_link(obj) {
    return obj.link;
  },
  pairsKey(pairsObj) {
    if (!Array.isArray(pairsObj)) {
      console.log('Error in pairsKey: pairsObj is not an array');
      return;
    }
    return pairsObj[0]
  },
  pairsValue(pairsObj) {
    if (!Array.isArray(pairsObj)) {
      console.log('Error in pairsValue: pairsObj is not an array');
      return;
    }
    return pairsObj[1]
  },
  apiCustomResultsAdminLinks() {
    let completedSubmissions = this.submissions.filter((sub) => {
      return sub.uid != null;
    });
    let links = completedSubmissions.map((sub) => {
      return `/apicustomresultsadmin/${sub.iid}/${sub.eid}/`
    });

    return [... new Set(links)];
  },
  apiCustomResultsLinks() {
    let links = this.submissions.map((sub) => {
      return `/apicustomresults/${sub.iid}/${sub.eid}/`
    });

    return [... new Set(links)];
  },
  groupLinksBySocialGroup(uniqueLinks) {
    if (!Array.isArray(uniqueLinks)) {
      console.log('Error in groupLinksBySocialGroup: uniqueLinks is not an array');
      return;
    }

    if (!Template.instance().subscriptionsReady()) {
      console.log('Warning in groupLinksBySocialGroup: subscriptions not ready');
      return;
    }
    let groupToLinkObj = {};

    uniqueLinks.forEach(link => {
      let [tmp1, tmp2, iid, eid, tmp3] = link.split('/');
      exp = Experiences.findOne({_id: eid});
      let key;
      if (exp.group) {
        key = exp.group;
      } else {
        key = "nullGroup";
      }
      if (Object.keys(groupToLinkObj).includes(key)) {
        groupToLinkObj[key].push({name: exp.name, group: exp.group, link: link});
      } else {
        groupToLinkObj[key] = [{name: exp.name, group: exp.group, link: link}]
      }
    });

    return _.pairs(groupToLinkObj);
  }

});