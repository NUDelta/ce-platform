import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Users } from '../users/users.js';

import { registerCallback } from '../coordinator/methods.js';

export const thanksgiving = new ValidatedMethod({
  name: 'api.thanksgiving',
  validate: null,
  run() {
    const groceryShopTemplate = {
      'name': 'grocery_shop',
      'contributions': { 'photo': 'Image', 'sentence': 'String' },
    };
    const shoppingTemplate = {
      'name': 'shopping',
      'contributions': { 'photo': 'Image', 'sentence': 'String' },
    };
    const barsTemplate = {
      'name': 'bars',
      'contributions': { 'photo': 'Image', 'sentence': 'String' },
    };
    const feastTemplate = {
      'name': 'feast',
      'contributions': { 'photo': 'Image', 'sentence': 'String' },
    };
    const airportTemplate = {
      'name': 'airport',
      'contributions': { 'photo': 'Image', 'sentence': 'String' },
    };
    const drinksTemplate = {
      'name': 'drinks',
      'contributions': { 'photo': 'Image', 'sentence': 'String' },
    };

       const experienceId = Meteor.call('api.createExperience', {
      name: 'Thanksgiving Break',
      description: 'Take a photo to share what you\'re doing this Thanksgiving break',
      image: 'https://publicholidays-us.akamaized.net/wp-content/uploads/2012/10/USA_Thanksgiving_1920_800.jpg',
      participateTemplate: 'thanksgiving',
      resultsTemplate: 'thanksgivingResults',
      notificationText: 'We found an experience for you! Help us create a Thanksgiving break collage 🦃',
      contributionGroups: [
        { contributionTemplates: [groceryShopTemplate] },
        { contributionTemplates: [shoppingTemplate] },
        { contributionTemplates: [barsTemplate] },
        { contributionTemplates: [feastTemplate] },
        { contributionTemplates: [airportTemplate] },
        { contributionTemplates: [drinksTemplate] }
      ],
      callbackPair: []
    });

    const incidentId = Meteor.call('api.createIncident', {
      experienceId: experienceId
    });

    Meteor.call('api.addSituationNeeds', {
      incidentId: incidentId,
      need: {
        'name': 'groceryNeed',
        'contributionTemplate': 'grocery_shop',
        'affordance': 'grocery or costco or intlgrocery',
        'softStoppingCriteria': 4
      }
    });
    Meteor.call('api.addSituationNeeds', {
      incidentId: incidentId,
      need: {
        'name': 'shoppingNeed',
        'contributionTemplate': 'shopping',
        'affordance': 'womenscloth or menscloth or deptstores or shoes',
        'softStoppingCriteria': 4
      }
    });
    Meteor.call('api.addSituationNeeds', {
      incidentId: incidentId,
      need: {
        'name': 'barsNeed',
        'contributionTemplate': 'bars',
        'affordance': 'sportsbars or pubs or divebars or breweries or bars or beerbar or cocktailbars or irish_pubs',
        'softStoppingCriteria': 3
      }
    });
    Meteor.call('api.addSituationNeeds', {
      incidentId: incidentId,
      need: {
        'name': 'feastNeed',
        'contributionTemplate': 'feast',
        'affordance': 'chinese or hotpot or vietnamese or breakfast_brunch or buffets or newamerican or korean or tradamerican or japanese or sushi or desserts or seafood or asianfusion or pizza or greek or steak or french or diners or italian or latin or mexican',
        'softStoppingCriteria': 6
      }
    });
    Meteor.call('api.addSituationNeeds', {
      incidentId: incidentId,
      need: {
        'name': 'airportNeed',
        'contributionTemplate': 'airport',
        'affordance': 'airports or airportlounges',
        'softStoppingCriteria': 3
      }
    });
    Meteor.call('api.addSituationNeeds', {
      incidentId: incidentId,
      need: {
        'name': 'drinksNeed',
        'contributionTemplate': 'drinks',
        'affordance': 'coffee or bubbletea',
        'softStoppingCriteria': 4
      }
    });
  }
});
