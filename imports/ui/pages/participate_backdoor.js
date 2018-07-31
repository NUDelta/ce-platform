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