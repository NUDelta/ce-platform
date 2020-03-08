import { addContribution } from '../OCEManager/OCEs/methods'
import {notify, notifyUsersInIncident, notifyUsersInNeed} from "../OpportunisticCoordinator/server/noticationMethods";
import {Incidents} from "../OCEManager/OCEs/experiences";

/** halfhalfRespawnAndNotify:
 * This is a helper function that generates a callback function definition
 * The callback will respawn or create a duplicate of the need that just completed,
 * while also sending notifications to the participants of that need.
 *
 * This function makes strong assumptions about how your OCE contributionTypes are written.
 * i.e. need.needName = 'Name of my need 1'
 * i.e. need.needName = 'Hand Silhouette 1'
 *
 * @param subject [String] subject of notification
 * @param text [String] accompanying subtext of notification
 * @return {any} A function
 */
export const halfhalfRespawnAndNotify = function(subject, text) {
  const functionTemplate = function (sub) {
    let contributionTypes = Incidents.findOne(sub.iid).contributionTypes;
    let need = contributionTypes.find((x) => {
      return x.needName === sub.needName;
    });

    // Convert Need Name i to Need Name i+1
    let splitName = sub.needName.split(' ');
    let iPlus1 = Number(splitName.pop()) + 1;
    splitName.push(iPlus1);
    let newNeedName = splitName.join(' ');

    need.needName = newNeedName;
    addContribution(sub.iid, need);

    let participants = Submissions.find({
      iid: sub.iid,
      needName: sub.needName
    }).map((submission) => {
      return submission.uid;
    });

    notify(participants, sub.iid, '${subject}', '${text}', '/apicustomresults/' + sub.iid + '/' + sub.eid);
  };
  return eval('`'+functionTemplate.toString()+'`');
};