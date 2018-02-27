import { Experiences, SituationDescription } from './experiences';
import { CONSTANTS } from "../testing/testingconstants";

describe('Experience Tests', () => {
  it('insert experiences into database', () => {

    Experiences.insert(CONSTANTS.experiences.atLocation, (err) => {
      if (err) {
        chai.assert(false);
      } else {
        chai.assert(true);
      }
    });
  })
});
