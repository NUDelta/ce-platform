// //CE has needs
// //CN has characters, which each have a context attribute, which is set to needs
//
// //CE has uids for participants
// //CN hs characters, which each have a participant attribute, which is set to a uid or null
//
// //CE has iids
// //CN has stories whose instances have iids
//
// //CE experiences callback into each other
// //CN story chapters callback into each other until the end condition is reached.
//
// character {
// 	name: string
// 	specific: boolean
// 	/*
// 	if specific == true:
// 		character will be referred to as character.name when referred to in text
// 	else:
// 		character will be referred to by the participant's name
// 	*/
// 	participant: uid //assigned based on context, or manually set by author
// 	context: detector + static affordances
// 	/*
// 	if participant is set manually by the author before the story begins OR recast == false and participant != null (the participant has already been cast at least once)
// 		add the participant to the context so that the system knows to look for that specific person in the context
// 	*/
// 	recast: boolean
// 	/*
// 	if recast == true:
// 		participant is reset to null after the chapter ends
// 	*/
// }
//
// /*
// general flow of casting
// 	get affordances from context tracker
// 	match participants to characters who have those contexts
// 	set participant attribute of character through uid
// 	experience runs
// 	if recast is true, reset participant attributes
// 	iid remains the same
// 	restart cycle of context tracker
// */
// IMPORTANT: can characters in the same chapter have different contexts, or do they all need to have the same one?
//
// //prompts require a response from participants.
// prompt {
// 	question: string
// 	response:
// 		string,
// 		picture,
// 		range
// 	//response usually maps to a story variable
// }
//
// text can usually be written as string + var + string
//
// //getting variable information from detectors
// var restaurant = character.participant.situation.detector