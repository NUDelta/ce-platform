import { Experiences, SituationDescription } from './experiences';
import { CONSTANTS } from "../../Testing/testingconstants";

describe('Experience Tests', () => {
  it('insert OCEs into database', () => {

    Experiences.insert(CONSTANTS.experiences.atLocation, (err) => {
      if (err) {
        chai.assert(false);
      } else {
        chai.assert(true);
      }
    });
  })
});
