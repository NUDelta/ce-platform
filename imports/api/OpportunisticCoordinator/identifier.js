import { Meteor } from "meteor/meteor";
import { Availability } from "./databaseHelpers";


Meteor.methods({
  getUserAvailabilities({uid}) {
    new SimpleSchema({
      uid: { type: String }
    }).validate({uid});

    const user = Meteor.users.findOne(uid);
    if (!user) {
      throw new Meteor.Error('getUserAvailabilities.userNotFound',
        `User not found with uid = ${uid}`);
    }
    return getUserAvailabilities(uid);
  }

});

export const getUserAvailabilities = (uid) => {
  return Availability.find({"needUserMaps.users.uid": uid});
};
