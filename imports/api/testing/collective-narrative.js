
// this section is for the author to write
let castle = new Setting("castle", "grocery store || restaurant")//fill this out later
let Alan = new Character("Alan", [])
let Billy = new Character("Billy", [])
let Caleb = new Character("Caleb", [])
let Shopkeeper = new Character("Shopkeeper", [])
let ax = new Object("ax", Shopkeeper, true, [kill])
let money = new Object("money", Alan, true, [buy])


function kill(recipient) {
  recipient.status = dead;
}

function buy(purchase) {
  this.owner.items.append(purchase);
  purchase.owner.items.remove(purchase);
  this.transfer(this.owner, purchase.owner, this);
}

let example = new Story("medieval", "anyCharDead", "afk || actionCommitted", [Alan, Billy, Caleb, Shopkeeper], castle, [ax, money]);
//

function Story(name, storyEndCondition, chapterEndCondition, characters, setting, objects) {
  this.name = name;
  this.anyCharDead = false;
  this.numDeadChars = 0;
  this.characters = characters;
  this.setting = setting;
  this.items = items;
  while (!eval(storyEndCondition) && ) {
    let sub = new Chapter(this.setting, this.characters, this.objects, chapterEndCondition);
    convertChapterToExperience(sub);
  }
}

function Setting(name, contexts) {
    this.name = name;
    this.contexts = contexts; // setting castle - contexts would be library, restaurant, etc Yelp API
}


function Chapter(setting, characters, objects, chapterEndCondition) {
    this.afk = false;
    this.setting = setting;
    this.characters = characters;
    this.objects = objects || [];
    //this.find_participants_for_character = find_participants_for_character;
    this.lines = [];
    this.action = null;
    this.actionCommitted = false;
    //a chapter ends when an action is committed, or when someone that has accepted to participate leaves
}

function Character(name, owned_items) { //diff character for each chapter OR setting mapped to character
    this.name = name;
    this.status = alive;
    //this.owner_chapters = owner_chapters;
    this.owned_items = owned_items || [];
    //this.actions = actions || {};   // map of arrays based on chapter
    this.contexts = contexts || {}; // map of chapter_title to list of contexts
    this.current_participant = null;
    //this.active_chapter = first_chapter_appearance;
}

function transfer(item, owner, recipient) { //should be a member function of the object class
  object.item = recipient;
  recipient.owned_objects.push(item);
  owner.owned_objects.remove(item);

}

// function Action(description, object, repercussions) {
//     this.object = object
//     this.description = description;
//     this.repercussions = repercussions;
//     //this.change_character_and_object = change_character_and_object;
//     //this.priority = priority;
// }

function Item(name, owner, transferrable, actions) {
    this.name = name;
    this.owner = owner;
    this.transferrable = transferrable;
    this.actions = actions;
    if (transferrable) {
      this.actions.push()
    }
}

function endCondition (numSubs, timePassed, unique) { //"anyCharDead() || personLeaves()" story flags as ints - story.dead == 0
//should this be its own class?
    if (numSubs != 0 && number of submissions == numSubs) {
      return True
    }

    if (timePassed != 0 && time Passed == numSubs) {
      return True
    }

    if (unique != null) {
      //parse unique from a string into actual code
    }

}

function convertChapterToExperience(chapter) {
  // total list of actions that will be completed in the chapter

  console.log("DEBUG [creating chapter actions]");
  let chapterActions = [];

  for (let character of chapter.characters) {
   for (let action of character.actions[chapter.title]) {
         chapterActions.push(new Action(action.description, Random.id(), action.priority));
         console.log("DEBUG action description = " + action.description);
         console.log("DEBUG action priority = " + action.priority);
     }
  }
  // find the first action
  let first_action = chapterActions[0];
  let max_priority_allowed = 0;
  console.log("DEBUG first_action created = " + first_action.description);

  for (let action of chapterActions) {
   if (action.priority < first_action.priority) {
     first_action = action;
   }
   if (action.priority < max_priority_allowed) {
     max_priority_allowed = action.priority;
   }
  }
  console.log("DEBUG first_action updated = " + first_action.description);
  console.log("DEBUG max_priority_allowed = " + max_priority_allowed);

  //need a way to keep number of already completed actions
  let number_of_actions_done = 0;

  //detectorIds = detectorNames.map((name) => { return getDetectorId(DETECTORS[name]); });
  //let CHAPTER_OPTIONS = _.zip(dropdownText, detectorIds);

  let CHAPTER_OPTIONS = _.zip(chapterActions);
  let CHAPTER_CHARACTERS = _.zip(chapter.characters);

  chapterActions = chapterActions.filter(function(x) {
      return x.priority == number_of_actions_done;
  });
  chapterActions.map(function(action){return [action.description, action.priority];});

  console.log("DEBUG chapterAction size updated = " + chapterActions.length);

  console.log("DEBUG [creating send notification]");
  let sendNotification = function(sub) {
      let uids = Submissions.find({ iid: sub.iid }).fetch().map(function(x) {
          return x.uid;
      });
      notify(
          uids,
          sub.iid,
          "Chapter 1 is complete. Find out what happened here!",
          "",
          "/apicustomresults/" + sub.iid + "/" + sub.eid
      );
  };



  console.log("DEBUG [creating callback]");
  //detectorIds = detectorNames.map((name) => { return getDetectorId(DETECTORS[name]); });

  let hpStoryCallback = function(sub) {
      //et chapter = chapter_one;
      console.log("DEBUG in callback");
      //console.log("current chapter is " + chapter.title)
      //var newSet = "profile.staticAffordances.participatedInPotterNarrative" + chapter.title;
      Meteor.users.update(
          {_id: sub.uid},
          {$set: {newSet : true}}
          );
      // an action has now been performed
      //not sure if this is still needed
      let affordance = sub.content.affordance;

      let options = eval('${JSON.stringify(CHAPTER_OPTIONS)}');
      let characters = eval('${JSON.stringify(CHAPTER_CHARACTERS)}');

      // options = options.filter(function(x) {
      //   return x[2] === cb.numberOfSubmissions() && x[1] === affordance;
      // });

      options = options.filter(function(x) {
        return x[1] === cb.numberOfSubmissions();
      });

      /*
      let chapterActions = [];

      for (let character of chapter.characters) {
       for (let action of character.actions[chapter.title]) {
             chapterActions.push(action);
             console.log("DEBUG action description = " + action.description);
             console.log("DEBUG action priority = " + action.priority);
         }
      }
      let options = chapterActions;
      */


      // takes the list of actions within the chapter
      // filters out all the actions that cannot be done at the moment
      console.log("past eval calls");
      console.log("options are " + options)
      options = options.filter(function(x) {
          return x.priority == cb.numberOfSubmissions();
      });
      number_of_actions_done += 1;
      // which action in the chapter is being completed
      let needName = "Action" + Random.id(3);
      if (cb.numberOfSubmissions() === 2) {
          needName = "pageFinal";
      }
      //finding the character of the action
      console.log("past checking actions")
      let next_action = options[0];
      console.log("next action is " + options)
      let next_character;
      for (let character of CHAPTER_CHARACTERS) {
        for (let action of character.actions[chapter.title]) {
          console.log("reached nested");
          if (action.description == next_action.description) {
            next_character = character;
          }
        }
      }
      console.log("past setting next character");
      let contribution = {
          needName: sub.content.title,
          situation: { detector: affordance, number: "1" },
          toPass: {
              characterName: next_character.name,
              instruction:  sub.needName,
              dropdownChoices: {
                  name: "affordance",
                  options: options
              }
          },
          numberNeeded: 1
      };
      addContribution(sub.iid, contribution);
  };

  console.log("DEBUG [creating character contexts]");
  var character_contexts = [];

  for (let character of chapter.characters) {
      let character_context = [character.contexts[chapter.title], character.name];
      console.log("DEBUG character context = " + character_context[0][0]);
      console.log("DEBUG character name = " + character_context[1]);
      character_contexts.push(character_context);
  }
  console.log("DEBUG character contexts size = " + character_contexts.length);

  console.log("DEBUG [creating experience]");
  let experience = {
      name: "Collective Narrative " + chapter.title,
      participateTemplate: "Harry_Potter_Story",
      resultsTemplate: "Harry_Potter_Story_Result",
      contributionTypes: [],
      description: "You are invited to participate in Collective Narrative: " + chapter.title,
      notificationText: "You are invited to participate in Collective Narrative: "+ chapter.title,
      callbacks: [
        {
            //trigger: "cb.newSubmission() && (cb.numberOfSubmissions() <= " + max_priority_allowed + ")",
            trigger: "cb.newSubmission()", //TODO: Make it so the submission only triggers when an action is committed
            function: eval('`' + hpStoryCallback.toString() + '`')
        },
        {
            trigger: "cb.incidentFinished()",
            function: sendNotification.toString() //start the next chapter
        }
      ]
  };
  console.log("DEBUG experience name = " + experience.name);
  console.log("DEBUG experience resultsTemplate = " + experience.resultsTemplate);
  console.log("DEBUG experience contributionTypes size = " + experience.contributionTypes.length);
  console.log("DEBUG experience description = " + experience.description);
  console.log("DEBUG experience notificationText = " + experience.notificationText);
  console.log("DEBUG experience callbacks size = " + experience.callbacks.length);

  // set up detectors
  console.log("DEBUG [creating detectors]");
  let detectorIds = [
      "oFCWkpZ3MSdXXyKbu",
      "oFCWkpZ3MSdXXyKbb"
  ];
  let i = 0;
  _.forEach(character_contexts, character_context => {
      console.log("character_context = " + character_context);
      let newVars = JSON.parse(
          JSON.stringify(DETECTORS[character_context[0]]['variables'])
      );
      console.log("newVars = " + newVars[0]);
      newVars.push("var participatedInPotterNarrative" + chapter.title + ";");

      let detector = {
          '_id': detectorIds[i],
          'description': DETECTORS[character_context[0]].description + "_PotterNarrative_" + chapter.title,
          'variables': newVars,
          'rules': [
              "(" + DETECTORS[character_context[0]].rules[0] +
              " ) && !participatedInPotterNarrative" + chapter.title + ";"]
      };
      console.log("DEBUG detector [" + i + "]");
      console.log("DEBUG id = " + detector._id);
      console.log("DEBUG description = " + detector.description);
      console.log("DEBUG variables = " + detector.variables);
      console.log("DEBUG rules = " + detector.rules[0]);

      // DETECTORS[character_context[0]] = detector;
      Detectors.insert(detector, (err, docs) => {
        if (err) {
          console.log("ERROR");
          console.log("error = " + err);
        } else {
          console.log("Detector added -");
          console.log("docs = " + docs);
        }
      });

      let first_character;
      for (let character of chapter.characters) {
          for (let action of character.actions[chapter.title]) {
              if (action.description == first_action.description) {
                  first_character = character;
              }
          }
      }

      if (i == 0) {
        // insert first need
        let need = {
          needName: first_action.description, //should be the title of the action
          situation: {detector: DETECTORS[character_context[0]]._id, number: "1"},
          toPass: {
              characterName: first_character.name,
              instruction: "Please choose from the following list of actions",
              firstSentence: chapter.title,
              dropdownChoices: {
                  name: "affordance",
                  options:  [[first_action.description, DETECTORS.grocery._id]]
              }
          },
          numberNeeded: 1
        };
        console.log("current chapter after first contribution " + chapter.title);
        experience.contributionTypes.push(need);
        console.log("current chapter after first contribution " + chapter.title);
      }
      i++;
  });
console.log("current chapter after loop " + chapter.title);

  // Experiences.insert(["HPStory": exp]);
  //let incident = createIncidentFromExperience(exp);
  //startRunningIncident(incident);
  return experience;
}


/**
 * Assumes that submission takes the schema
 * {
 *  iid:
 *  user:
 *  info: {
 *    sentence: "Fine, here is the sword."
 *    action: true
 *  }
 * }
 * @param chapterName
 */
chapterEnd(chapterName) {
  // check if recent submission is the end of a chapter
  if (this.submission.info.action === true) {
    return true;
  }

  return false;

  //example finding a particular submission
  return Submissions.find({
    iid: this.submission.iid,
    needName: chapterName,
    uid: { $ne: null }
  })
}
