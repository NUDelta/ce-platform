import { Meteor } from "meteor/meteor";
import { findUserByUsername } from "../../../api/UserMonitor/users/methods";

export const createPairing = (userNames) => {
  for (let ind = 0; ind < userIds.length; ind += 2) {
    let uid1 = findUserByUsername(userNames[ind]);
    let uid2 = findUserByUsername(userNames[ind + 1]);
    let pairName = "pair" + +String(Math.floor(ind / 2));
    Meteor.users.update(
      {
        _id: { $in: [uid1] },
      },
      {
        $set: {
          "profile.staticAffordances": {
            [pairName]: true,
          },
        },
      },
      {
        multi: true,
      }
    );

    Meteor.users.update(
      {
        _id: { $in: [uid2] },
      },
      {
        $set: {
          "profile.staticAffordances": {
            [pairName]: true,
          },
        },
      },
      {
        multi: true,
      }
    );
  }
};
