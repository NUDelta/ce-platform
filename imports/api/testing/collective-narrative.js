function Setting(name, contexts) {
    this.name = name;
    this.contexts = contexts;
}

function Chapter(story, setting, characters, objects, endCondition, progressCondition) {
    this.story = story;
    this.setting = setting;
    this.characters = characters;
    this.objects = objects || [];
    this.find_participants_for_character = find_participants_for_character;
    this.lines = [];
    this.action = null;
    //a chapter ends when an action is committed, or when someone that has accepted to participate leaves
}

function Character(name, owner_chapters, owned_objects, actions, contexts, first_chapter_appearance) {
    this.name = name;
    //this.owner_chapters = owner_chapters;
    this.owned_objects = owned_objects || [];
    //this.actions = actions || {};   // map of arrays based on chapter
    this.contexts = contexts || {}; // map of chapter_title to list of contexts
    this.current_participant = null;
    //this.active_chapter = first_chapter_appearance;
}


function Action(description, object, repercussions) {
    this.object = object
    this.description = description;
    this.repercussions = repercussions;
    //this.change_character_and_object = change_character_and_object;
    //this.priority = priority;
}

function Object(name, owner, actions) {
    this.name = name;
    this.owner = owner || null;
    //this.active_chapter = first_chapter_appearance;
    this.actions = actions
    this.actions.append(giveAway)
}

function endCondition {numSubs, timePassed, unique) {
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
