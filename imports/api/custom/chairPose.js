import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Users } from '../users/users.js';

import { registerCallback } from '../coordinator/methods.js';

export const chairPose = new ValidatedMethod({
  name: 'api.chairPose',
  validate: null,
  run() {
    const chairCollageTemplate = {
      'name': 'chairCollage',
      'contributions': { 'chairCollage': 'Image' },
    };

    const experienceId = Meteor.call('api.createExperience', {
      name: 'Chair pose',
      description: 'Do a funny pose and take a selfie',
      image: 'https://i.ytimg.com/vi/jDWd2YygGkE/maxresdefault.jpg',
      participateTemplate: 'chairPose',
      resultsTemplate: 'chairPoseResults',
      notificationText: 'We found an experience for you! Make a funny pose while sitting on a chair 😂',
      notificationStrategy: 'greedyOrganization',
      contributionGroups: [{
        contributionTemplates: [chairCollageTemplate],
        stoppingCriteria: { 'total': 20 }
      }],
      callbackPair: []
    });

    const incidentId = Meteor.call('api.createIncident', {
      experienceId: experienceId
    });

    Meteor.call('api.addSituationNeeds', {
      incidentId: incidentId,
      need: {
        'name': 'chairNeed',
        'contributionTemplate': 'chairCollage',
        'affordance': 'chair',
        'softStoppingCriteria': { 'total': 20 } //if finished but experience isn't then ignore
      }
    });
  }
});
