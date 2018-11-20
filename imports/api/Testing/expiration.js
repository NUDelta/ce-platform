// Command to get submissions      db.submissions.find({uid: {$ne: null}})
// Command to add hours to IsoDate     date.setHours(12+x);     where x is number of hours added
// Compare ISODate Objects         var diff = date1 - date2; (If date1 is later than date2, diff will be positive)
// Current ISODATE.   var today = new Date();

// Need function to find first-submission of an experience
function checkExperiences(){
	var arr = db.submissions.find({uid: {$ne: null}});
	var length = arr.length();
	/*
	Optional Sorting -> Must be of BSON Object
	arr.sort(function(a, b) {
    	return a.timestamp - b.timestamp;
	}); */

	// Hashmap to keep track of earliest submission time
	var map = {};
	// Adds earliest submission timestamp to the hashmap
	// map[eid] = first_submission_timestamp;

	var idMap = {};
	// Saves submission ID of earliest submission
	// map[eid] = first_submission_id;
	for(var i = 0; i<length; i++){
		// If not in map, add directly to map
		if(!(arr[i].eid in map)){
			map[arr[i].eid] = arr[i].timestamp;
			idMap[arr[i].eid] = arr[i]._id;
		}
		else if((arr[i].timestamp - map[arr[i].eid].timestamp) < 0){
			map[arr[i].eid] = arr[i].timestamp;
			idMap[arr[i].eid] = arr[i]._id;
		}
	}

	// Checks each experience and validates their expiration
	var keyArr = Object.keys(map);
	for(var i = 0; i<keyArr.length; i++){
		var timeToExpiration = db.experiences.find({_id: {$eq: keyArr[i]}})[0].timeToExpire;
		//timeToExpiration = 0; ->>>>> USED FOR TESTING THE FUNCTION
		var submissionID = idMap[keyArr[i]];
		if(checkExpired(timeToExpiration,submissionID)){
			print("Submission ID "+ submissionID + " from experience ID "+  keyArr[i] + " is an expired experience!");
		}
		else{
			print("Submission ID "+ submissionID + "from experience ID " +  keyArr[i] + " is valid.");
		}
	}
	return;
}


// checkExpired returns true or false depending on whether an experience is expired
// True = expired; false = nonexpired
function checkExpired(timeToExpiration, submissionID){
	var expirationDate = db.submissions.find({_id: {$eq: submissionID}})[0].timestamp;
	var offset = expirationDate.getHours();
	expirationDate.setHours(offset+timeToExpiration);
	var today = new Date();
	var expired = (today-expirationDate)>0;
	return expired;
}



// Pseudo cron-job that runs script every 10 minutes
window.setInterval(function(){
	checkExperiences();
}, 600000);


