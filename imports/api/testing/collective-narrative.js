
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
  while (!storyEndCondition && ) {
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
    this.find_participants_for_character = find_participants_for_character;
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
