import {Meteor} from 'meteor/meteor';
import {resetDatabase} from 'meteor/xolvio:cleaner';
import {Assignments} from "../../OpportunisticCoordinator/databaseHelpers";
import {findUserByUsername, getUserActiveIncidents} from "./methods";
import {insertTestUser} from "../../OpportunisticCoordinator/populateDatabase";

describe('users activeIncidents computed from Assignments', () => {
  const iid1 = Random.id();
  const iid2 = Random.id();
  const usernameA = 'garrett';
  const usernameB = 'garretts_brother';
  const needName1 = 'Rainy 1';
  const needName2 = 'Rainy 2';
  let userA;
  let userB;

  beforeEach(() => {
    resetDatabase();

    insertTestUser(usernameA);
    insertTestUser(usernameB);
    const testUserA = findUserByUsername(usernameA);
    const testUserB = findUserByUsername(usernameB);
    userA = testUserA._id;
    userB = testUserB._id;
    Assignments.insert({
      _id: iid1,
      needUserMaps: [
        {
          needName: needName1,
          users: [
            {uid: userA}
          ]
        },
      ],
    });
    Assignments.insert({
      _id: iid2,
      needUserMaps: [
        {
          needName: needName2,
          users: [
            {uid: userA},
            {uid: userB},
          ]
        }
      ],
    });

  });

  it('should show userA be assigned to two incidents via getUserActiveIncidents', () => {

    const activeIncidents = getUserActiveIncidents(userA);
    console.log(`activeIncidents: \n ${JSON.stringify(activeIncidents)}`);
    chai.assert(activeIncidents.includes(iid1));
    chai.assert(activeIncidents.includes(iid2));

  });

  it('should show userB be assigned to one incident via getUserActiveIncidents', () => {

    const activeIncidents = getUserActiveIncidents(userB);
    console.log(`activeIncidents: \n ${JSON.stringify(activeIncidents)}`);

    chai.assert(activeIncidents.includes(iid2));

  });

  it('should show userA be assigned to two incidents via activeIncidents collection helper', () => {

    const activeIncidents = Meteor.users.findOne(userA).activeIncidents();
    console.log(`activeIncidents: \n ${JSON.stringify(activeIncidents)}`);
    chai.assert(activeIncidents.includes(iid1));
    chai.assert(activeIncidents.includes(iid2));

  });

  it('should show userB be assigned to one incident via activeIncidents collection helper', () => {

    const activeIncidents = Meteor.users.findOne(userB).activeIncidents();
    console.log(`activeIncidents: \n ${JSON.stringify(activeIncidents)}`);

    chai.assert(activeIncidents.includes(iid2));

  });
});
