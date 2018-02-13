import {Experiences, SituationDescription} from "./experiences";


describe('Experience Tests', function () {
    it('insert experiences into database', function () {
        let experienceTest = {
            name: "You're at a location",
            participateTemplate: [{templateName: "atLocation", submissionData: {proof: "photo"}}],
            resultsTemplate: "photoCollage",
            contributionTypes: [{templateName: "atLocation", needs: [
                {needName: "atResturant", situation: {detector: "resturant", number: "1"},
                    toPass: {item: "resturant"}, numberNeeded: 10}]}],
            description: "This is a simple experience for testing",
            notificationText: "Please participate in this test experience!",
        };

        let experienceInsertResult = Experiences.insert(experienceTest, (err, docs) => {
            if (err) {
                console.log(err);
                return false;
            } else {
                return true;
            }
        });

    })
})