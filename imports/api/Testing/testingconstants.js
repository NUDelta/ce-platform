import { LOCATIONS } from "./LOCATIONS";
import { USERS } from "./USERS";
import { DETECTORS } from "./DETECTORS";

// import CHI20_DTR_EXPERIENCES from "./summer19study/dtr_experiences";
// import CHI20_Olin_EXPERIENCES from "./summer19study/olin_experiences";
// import SPRING18_EXPERIENCES from "./spring18study/four_interaction_structures";
// import SAMESITUATION_ACROSSTIME from "./spring18study/samesituation_acrosstime";
// import SCAVENGER_HUNT from "./spring18study/shared_goals.js";
// import SUMMER18_BETA from "./summer18beta/beta_experiences";
// import SUMMER18_EXPERIENCES from "./summer18study/summer18experiences";
// import TRIADIC_EXPERIENCES from "./triadic_experiences/triadic_experiences.js"
import SENIOR_FINALS from "./spring18study/senior_finals.js";
import PARALLEL from './s22test/parallel'
import DEBIAS from './s23study/debiasing'
import Test1 from './s23study/debiasing2'
// import TRIADIC_EXPERIENCES from "./triadic_experiences/triadic_experiences.js"
// import PAIR_EXPERIENCES from "./winter22statusupdate/pair_experiences.js"
// import NEW_PAIR_EXPERIENCES from "./fall21study/new_pair_experiences.js"

console.log("I AM IN THE WRITE PLACE")

let EXPERIENCES = Object.assign({},
  //CHI20_DTR_EXPERIENCES,
  //CHI20_Olin_EXPERIENCES,
  // SPRING18_EXPERIENCES,
  //SUMMER18_BETA,
  // SAMESITUATION_ACROSSTIME, // sunset
  // Test1,
  DEBIAS

  // SCAVENGER_HUNT
  //SUMMER18_EXPERIENCES,
  // TRIADIC_EXPERIENCES
  // PAIR_EXPERIENCES,
);


export const CONSTANTS = {
  'LOCATIONS': LOCATIONS,
  'USERS': USERS,
  'EXPERIENCES': EXPERIENCES,
  'DETECTORS': DETECTORS
};

