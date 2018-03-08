import {Submissions} from "../submissions/submissions";
import { CONSTANTS} from "./testingconstants";
import {Detectors} from "../detectors/detectors";
import {createIncidentFromExperience, startRunningIncident} from "../incidents/methods";
import {Experiences} from "../experiences/experiences";

Meteor.methods({
  startFreshBumped(){
    createNewBumped();
  }
});

function createNewBumped(){
  let experience = {
    name: 'Bumped',
    participateTemplate: 'bumped',
    resultsTemplate: 'bumpedResults',
    contributionTypes: [ ],
    description: 'You just virtually bumped into someone!',
    notificationText: 'You just virtually bumped into someone!',
    callbacks: []
  };

  let bumpedCallback = function (sub) {
    let otherSub = Submissions.findOne({
      uid: { $ne: sub.uid },
      iid: sub.iid,
      needName: sub.needName
    });

    notify([sub.uid, otherSub.uid], sub.iid, 'See a photo from who you bumped into!', '', '/apicustomresults/' + sub.iid + '/' + sub.eid);
  };

  let relationships = ['lovesDTRAlumni', 'lovesLeesha', 'lovesDTR'];
  let places = [['bar','bar'], ['coffee', 'coffee shop'], ['grocery', 'grocery store'], ['restaurant', "restaurant"]];
  _.forEach(relationships, (relationship) =>{
    _.forEach(places, (place)=>{

      let newVars = JSON.parse(JSON.stringify(CONSTANTS.DETECTORS[place[0]]['variables']));
      newVars.push('var ' + relationship + ';');

      let detector = {
        '_id': Random.id(),
        'description': CONSTANTS.DETECTORS[place[0]].description + relationship,
        'variables': newVars,
        'rules': [ '(' + CONSTANTS.DETECTORS[place[0]].rules[0] + ' && ' + relationship + ');' ]
      };
      CONSTANTS.DETECTORS[place[0]+relationship] = detector;
      Detectors.insert(detector);

      let need = {
        needName: place[0]+relationship,
        situation: {detector: detector._id, number: '2'},
        toPass: {instruction: 'You are at a  ' + place[1] + ' at the same time as '},
        numberNeeded: 2
      };
      let callback = {
        trigger: 'cb.numberOfSubmissions(\'' + place[0]+relationship + '\') === 7',
        function: bumpedCallback.toString(),
      };

      experience.contributionTypes.push(need);
      experience.callbacks.push(callback)
    })
  });

  Experiences.insert(experience);
  let incident = createIncidentFromExperience(experience);
  startRunningIncident(incident);

}