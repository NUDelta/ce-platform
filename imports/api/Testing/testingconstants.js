import {LOCATIONS} from "./LOCATIONS";
import {USERS} from "./USERS";
import {DETECTORS} from "./DETECTORS";

import CHI20_DTR_EXPERIENCES from "./summer19study/dtr_experiences";
import CHI20_Olin_EXPERIENCES from "./summer19study/olin_experiences";
import SPRING18_EXPERIENCES from "./spring18study/four_interaction_structures";
import SCAVENGER_HUNT from "./spring18study/shared_goals.js";
import SUMMER18_BETA from "./summer18beta/beta_experiences";
import SUMMER18_EXPERIENCES from "./summer18study/summer18experiences";
import TRIADIC_EXPERIENCES from "./triadic_experiences/triadic_experiences.js"
import SENIOR_FINALS from "./spring18study/senior_finals.js";
// import ST from "./spring18study/senior_finals.js";

let EXPERIENCES = Object.assign({},
  //CHI20_DTR_EXPERIENCES,
  //CHI20_Olin_EXPERIENCES,
  //SPRING18_EXPERIENCES,
  //SUMMER18_BETA,
  // SUMMER18_EXPERIENCES,
  //TRIADIC_EXPERIENCES
  SENIOR_FINALS
  //SCAVENGER_HUNT
);

export const CONSTANTS = {
  'LOCATIONS': LOCATIONS,
  'USERS': USERS,
  'EXPERIENCES': EXPERIENCES,
  'DETECTORS': DETECTORS
};
