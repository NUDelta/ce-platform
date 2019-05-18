import { CONSTANTS } from "../Testing/testingconstants";
import {createIncidentFromExperience, startRunningIncident} from "../OCEManager/OCEs/methods";
import {Experiences} from "../OCEManager/OCEs/experiences";

/**
 *
 * @param username [String] key in the CONSTANTS.USERS object
 */
export const insertTestUser = (username) => {
  // NOTE: tried to use Account.createUser, but does not properly trigger the onCreateUser callback in time
  let user = CONSTANTS.USERS[username];
  user.profile = {};
  user.profile.experiences = [];
  user.profile.subscriptions = [];
  user.profile.lastParticipated = null;
  user.profile.lastNotified = null;
  user.profile.pastIncidents = [];
  user.profile.staticAffordances = user.profile.staticAffordances || {};
  Meteor.users.insert(user);
};

/**
 *
 * @param oce_name [String] key in the CONSTANTS.EXPERIENCES object
 */
export const startTestOCE = (oce_name) => {
  let testExp = CONSTANTS.EXPERIENCES[oce_name];
  Experiences.insert(testExp);
  let testIncident = createIncidentFromExperience(testExp);
  startRunningIncident(testIncident);
};