import {Incidents} from "./incidents";
import {Schema} from "../schema";


describe('Incidents create', function () {
    it('insert incident into database', function () {
        var incidentTest = {
            eid: "vC8b8hawwkKS3Hpfd",
            contributionTypes: [{templateName: "atLocation", needs: [
                    {needName: "atResturant", situation: {description: "resturant", number: "1"},
                        submissionData: {proof: "photo"}, numberNeeded: 10}]}],
        }

        var incidentInsertResult = Incidents.insert(incidentTest, (err, docs) => {
            if (err) {
                console.log(err);
                return false;
            } else {
                return true;
            }
        });

    })
})
