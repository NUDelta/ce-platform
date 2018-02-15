import { Experiences, SituationDescription } from './experiences';

describe('Experience Tests', () => {
  it('insert experiences into database', () => {
    let experienceTest = {
      name: 'You\'re at a location',
      participateTemplate: [{ templateName: 'atLocation', submissionData: { proof: 'photo' } }],
      resultsTemplate: 'photoCollage',
      contributionTypes: [{
        templateName: 'atLocation', needs: [
          {
            needName: 'atRestaurant', situation: { detector: 'restaurant', number: '1' },
            toPass: { item: 'restaurant' }, numberNeeded: 10
          }]
      }],
      description: 'This is a simple experience for testing',
      notificationText: 'Please participate in this test experience!',
    };

    Experiences.insert(experienceTest, (err) => {
      if (err) {
        chai.assert(false);
      } else {
        chai.assert(true);
      }
    });
  })
});