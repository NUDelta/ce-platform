import './participate_backdoor.html';

import {Template} from 'meteor/templating';

Template.participateBackdoor.helpers({
  apiCustomLinks() {
    let links = this.submissions.map((sub) => {
      return `/apicustom/${sub.iid}/${sub.eid}/${sub.needName}`
    });

    return [... new Set(links)];
  }
});

Template.resultsBackdoor.helpers({
  experienceName(link) {
    // /apicustomresultsadmin/zEYETNptJxF7aw8iK/pwSBHwj9xDLJTvLxq/
    let [tmp1, tmp2, iid, eid, tmp3] = link.split('/');
    let expMatch = this.experiences.find((exp) => {
      return exp._id === eid;
    });
    return expMatch.name;
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
  }
});