import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Users } from '../users/users.js';
import { registerCallback } from '../coordinator/methods.js';

export const americanFlag = new ValidatedMethod({
  name: 'api.americanFlag',
  validate: null,
  run() {
    const redTemplate = {
      'name': 'red',
      'contributions': { 'red': 'Image' },
    };
    const yellowTemplate = {
      'name': 'yellow',
      'contributions': { 'yellow': 'Image' },
    };
    const greenTemplate = {
      'name': 'green',
      'contributions': { 'green': 'Image' },
    };
    const blueTemplate = {
      'name': 'blue',
      'contributions': { 'blue': 'Image' },
    };
    const blackTemplate = {
      'name': 'black',
      'contributions': { 'black': 'Image' },
    };
    const whiteTemplate = {
      'name': 'white',
      'contributions': { 'white': 'Image' },
    };
    //console.log('gonna call to create a rainbow experience');

    const experienceId = Meteor.call('api.createExperience', {
      name: 'Create a rainbow',
      description: 'Take a photo to help build a rainbow collage',
      image: 'http://www.publicdomainpictures.net/pictures/120000/velka/rainbow-colors-background.jpg',
      participateTemplate: 'americanFlag',
      resultsTemplate: 'americanFlagResults',
      notificationText: 'We found an experience for you! Help us create a rainbow collage 🌈',
      contributionGroups: [
        { contributionTemplates: [redTemplate] },
        { contributionTemplates: [blueTemplate] },
        { contributionTemplates: [whiteTemplate] },
        { contributionTemplates: [greenTemplate] },
        { contributionTemplates: [blackTemplate] },
        { contributionTemplates: [yellowTemplate] }
      ],
      callbackPair: []
    });

    const incidentId = Meteor.call('api.createIncident', {
      experienceId: experienceId
    });

    Meteor.call('api.addSituationNeeds', {
      incidentId: incidentId,
      need: {
        'name': 'redNeed',
        'contributionTemplate': 'red',
        'affordance': 'womenscloth or menscloth or firedepartments',
        'softStoppingCriteria': 4
      }
    });
    Meteor.call('api.addSituationNeeds', {
      incidentId: incidentId,
      need: {
        'name': 'yellowNeed',
        'contributionTemplate': 'yellow',
        'affordance': 'grocery or hackerspace',
        'softStoppingCriteria': 4
      }
    });
    Meteor.call('api.addSituationNeeds', {
      incidentId: incidentId,
      need: {
        'name': 'greenNeed',
        'contributionTemplate': 'green',
        'affordance': 'parks or grocery or skiresorts or womenscloth or menscloth',
        'softStoppingCriteria': 4
      }
    });
    Meteor.call('api.addSituationNeeds', {
      incidentId: incidentId,
      need: {
        'name': 'blueNeed',
        'contributionTemplate': 'blue',
        'affordance': 'clear and daytime',
        'softStoppingCriteria': 2
      }
    });
    Meteor.call('api.addSituationNeeds', {
      incidentId: incidentId,
      need: {
        'name': 'blueNeed',
        'contributionTemplate': 'blue',
        'affordance': 'womenscloth or menscloth or airports or lakes',
        'softStoppingCriteria': 2
      }
    });
    Meteor.call('api.addSituationNeeds', {
      incidentId: incidentId,
      need: {
        'name': 'blackNightNeed',
        'contributionTemplate': 'black',
        'affordance': 'coffee or casinos skiresorts',
        'softStoppingCriteria': 4
      }
    });
    Meteor.call('api.addSituationNeeds', {
      incidentId: incidentId,
      need: {
        'name': 'whiteClouds',
        'contributionTemplate': 'white',
        'affordance': 'clouds and daytime',
        'softStoppingCriteria': 2
      }
    });
    Meteor.call('api.addSituationNeeds', {
      incidentId: incidentId,
      need: {
        'name': 'whiteClouds',
        'contributionTemplate': 'white',
        'affordance': 'newamerican or italian',
        'softStoppingCriteria': 2
      }
    });
  }
});
