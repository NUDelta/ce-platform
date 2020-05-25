import './api_custom_results.html';

import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';

import { Template } from "meteor/templating";
import { Meteor } from 'meteor/meteor'
import '../components/displayImage.html';
//import {notify} from "../../api/OpportunisticCoordinator/server/noticationMethods";


Template.api_custom_results.onCreated(() => {
  console.log("loaded");
});

Template.api_custom_results.helpers({
  data() {
    this.submissions.sort(function compare(a, b) {
      if (a.timestamp === undefined) {
        return 1;
      } else if (b.timestamp === undefined) {
        return -1;
      }

      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return dateA - dateB;
    });

    console.log(this);
    console.log(this.images);
    return this;
  },
});

Template.api_custom_results_admin.onCreated(() => {
  console.log("loaded admin");
});

Template.api_custom_results_admin.helpers({
  data() {
    this.submissions.sort(function compare(a, b) {
      if (a.timestamp === undefined) {
        return 1;
      } else if (b.timestamp === undefined) {
        return -1;
      }

      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return dateA - dateB;
    });

    console.log(this);
    console.log(this.images);
    return this;
  },
  adminTemplate(templateName) {
    return templateName + '_admin';
  }
});


Template.photosByCategories.helpers({
  categories() {
    let needNames = this.experience.contributionTypes.map(function(x){
      return x.needName;
    });

    let categoriesSet = new Set(needNames);
    return [...categoriesSet];
  },
  myCategories() {
    let mySubs = this.submissions.filter(function(x){
      return x.uid === Meteor.userId();
    });

    let myNeedNames = mySubs.map(function(x){
      return x.needName;
    });

    let categoriesSet = new Set(myNeedNames);
    return [...categoriesSet];
  },
  imagesByCategory(category){
    let specific = this.images.filter(function(x){
      return x.needName === category;
    });

    return specific;
  }
});

Template.photosByCategories_admin.helpers({
  categories() {
    let needNames = this.experience.contributionTypes.map(function(x){
      return x.needName;
    });

    let categoriesSet = new Set(needNames);
    return [...categoriesSet];
  },
  imagesByCategory(category){
    let specific = this.images.filter(function(x){
      return x.needName === category;
    });

    return specific;
  }
});

Template.bumpedResults.helpers({
  getName(x ){
    return x.friendName;
  },
  getImage(x){
    return x.image;
  },
  getMyImage(x){
    return x.myImage;
  },
  bumpees() {
    let mySubs = this.submissions.filter(function(x){
      return x.uid === Meteor.userId();
    });

    let myNeedNames = mySubs.map(function(x){
      return x.needName;
    });

    let otherSubs = this.submissions.filter(function(x){
      return (myNeedNames.includes(x.needName)) && (x.uid !== Meteor.userId());
    });

    let contents = otherSubs.map(function(x){
      let myInfoDic = mySubs.find(function(y){
        return y.needName === x.needName;
      });
      return {image: x.content.proof, friendName: myInfoDic.content.nameOfFriend, myImage: myInfoDic.content.proof};
    });

    let images = this.images;
    contents.reverse();

    contents = contents.map(function(x){
      let img = images.find(function(y){
        return y._id === x.image;
      });
      let myImg = images.find(function(y){
        return y._id === x.myImage;
      });

      return {friendName: x.friendName,image: img, myImage: myImg};
    });

    return contents;
  }
});

Template.groupBumpedResults.helpers({
  content() {
    const {submissions, images, users} = this;

    const mySub = submissions.find(s => s.uid === Meteor.userId());
    const myNeedNames = mySub.needName;
    const otherSubs = submissions.filter(s => myNeedNames.includes(s.needName) && s.uid !== Meteor.userId());

    const myImage = images.find(i => i._id === mySub.content.proof);
    const otherImages = otherSubs.map(s => images.find(i => i._id === s.content.proof));
    const friends = otherSubs.map(s => users.find(u => u._id === s.uid));

    results = {};
    Object.assign(results,
      friends[0] && {friendOneName: `${friends[0].profile.firstName} ${friends[0].profile.lastName}`},
      {imageOne: otherImages[0]},
      otherSubs[0] && {captionOne: otherSubs[0].content.sentence},
      {myImage: myImage},
      mySub && {myCaption: mySub.content.sentence},
      {imageTwo: otherImages[1]},
      friends[1] && {friendTwoName: `${friends[1].profile.firstName} ${friends[1].profile.lastName}`},
      otherSubs[1] && {captionTwo: otherSubs[1].content.sentence}
    )

    return results;
  }
});

Template.groupCheersResults.helpers({
  resultsGroupedByNeedAndTriad() {

    let mySubs = this.submissions.filter(function(x){
      return x.uid === Meteor.userId();
    });

    let users = this.users;
    let subs = this.submissions;
    let images = this.images;

    let myNeedNames = mySubs.map(function(x){
      return x.needName;
    });
    // only show examples where the need names are unique
    myNeedNames = [... new Set(myNeedNames)];

    const needGroups = myNeedNames.map((needName) => {
      // images already filtered by activeIncident. Now get them for each need
      let needImages = images.filter(function(img){
        return img.needName == needName;
      });

      //grab username from img uid
      let names = needImages.map(function(img){
        return getUserById(users, img.uid);
      });

      let needSubs = subs.filter(function(sub){
        return sub.needName == needName;
      });
      let captions = needSubs.map(function(sub){
        return sub.content.sentence;
      });

      return {needName: needName,
        needSubs: needSubs,
        imagesGroupedByTriad: needImages,
        captions: captions,
        names: names};
    });

    return(needGroups);
  },
  elementAtIndex(arr, index){
    return arr[index];
  },
  lengthEqual(arr, number) {
    return arr.length === number;
  },
  createReacts(submissions, users, idx){
    return createReactString(submissions, users, idx);
  }
});

Template.monsterCreateResults.helpers({
  resultsGroupedByNeedAndTriad() {
    let mySubs = this.submissions.filter(function(x){
      return x.uid === Meteor.userId();
    });

    let users = this.users;
    let subs = this.submissions;
    let images = this.images;

    let myNeedNames = mySubs.map(function(x){
      return x.needName;
    });
    // only show examples where the need names are unique
    myNeedNames = [... new Set(myNeedNames)];

    let needGroups = myNeedNames.map((needName) => {
      // images already filtered by activeIncident. Now get them for each need
      let needImages = images.filter(function(img){
        return img.needName == needName && !img.stitched;
      });

      //grab username from img uid
      let names = needImages.map(function(img){
        return getUserById(users, img.uid);
      });

      let needSubs = subs.filter(function(sub){
        return sub.needName == needName;
      });

      return {needName: needName,
        needSubs: needSubs,
        imagesGroupedByTriad: needImages,
        names: names};
    });

    return(needGroups);
  },
  stitchedImage(images){
    images = images.filter(i => i.stitched == 'true');
    return images[0];
  },
  elementAtIndex(arr, index){
    return arr[index];
  },
  lengthEqual(arr, len){
    return arr.length == len;
  }
});

Template.monsterStoryResults.helpers({
  stitchedMonster(){
    let images = this.images.filter(i => i.stitched == 'true' && this.needName == i.needName);
    return images[0];
  },
  getNeedImages(){
    let currUser = Meteor.userId();
    let currUserSubs = this.submissions.filter(s => s.uid == currUser);
    let needName = currUserSubs[0].needName;
    let images = this.images.filter(i => i.needName == needName);
    return images;
  },
  subDetails(needImage){
    let imageId = needImage._id;
    let sub = this.submissions.filter(s => s.content.Preview == imageId);
    let monsterLocation = sub[0].content.monsterLocation;
    let row = parseInt(monsterLocation / 3) + 1
    let col = parseInt(monsterLocation % 3) + 1

    return {
      sentence: sub[0].content.sentence,
      monsterRow: row.toString(),
      monsterCol: col.toString(),
      user: getUserById(this.users, sub[0].uid)
    };

  },
  elementAtIndex(array, index){
    return array[index];
  },
  increment(num){
    return parseInt(num)+1;
  },
  notFirst(index) {
    return index != 0;
  },
  notLast(index){
    //num images == images filtered by needName -1 (bc of stitched image)
    let images = this.images.filter(i => this.needName == i.needName).length - 1;
    return index < this.images.length - 1;
  },
});

Template.monsterStoryResults.events({
  'click .prev'(event, template){
    let currSlideIdx = parseInt(event.target.dataset.currslide);
    let slide = document.getElementById(`img${currSlideIdx}`);
    let prevSlide = document.getElementById(`img${currSlideIdx-1}`);
    slide.style.display = "none";
    prevSlide.style.display = "block";

  },
  'click .next'(event, template){
    let currSlideIdx = parseInt(event.target.dataset.currslide);
    console.log(currSlideIdx);
    let slide = document.getElementById(`img${currSlideIdx}`);
    let nextSlide = document.getElementById(`img${currSlideIdx+1}`);
    slide.style.display = "none";
    nextSlide.style.display = "block";
  }
});

Template.groupCheersResults.events({
     'click .reactWow'(event, template){
      let idx = parseInt(event.target.parentNode.dataset.val);
      let needName = event.target.parentNode.dataset.needname;
      let needSubs = this.submissions.filter(function(sub){
        return sub.needName == needName;
      });
      react = event.target.textContent;
      reactSubmission(react, this.users, needSubs[idx]);
    },
    'click .reactHeart'(event, template){
      let idx = parseInt(event.target.parentNode.dataset.val);
      let needName = event.target.parentNode.dataset.needname;
      let needSubs = this.submissions.filter(function(sub){
        return sub.needName == needName;
      });
      react = event.target.textContent;
      reactSubmission(react, this.users, needSubs[idx]);
    },
    'click .reactLaugh'(event, template){
      let idx = parseInt(event.target.parentNode.dataset.val);
      let needName = event.target.parentNode.dataset.needname;
      let needSubs = this.submissions.filter(function(sub){
        return sub.needName == needName;
      });
      react = event.target.textContent;
      reactSubmission(react, this.users, needSubs[idx]);
    }
});

export const getUserById = (users_arr, uid) => {
  let user = users_arr.find(function(x) {
    return x._id === uid;
  });
  if (uid){
    return user.username;
  } else {
    return null;
  }
};

export const createReactString = (submissions, users, idx) => {
  reactionString = "";

  //grab correct submission

  if (submissions[idx].content["react"]){
    for (i=0; i<submissions[idx].content["react"].length;i++){
      let username = getUserById(users, submissions[idx].content["reactUser"][i]);
      let react = submissions[idx].content["react"][i];
      reactionString = reactionString + username + ": " + react + " ";
    }
  };
  return reactionString;
}

export const reactSubmission = (react, users, submission) => {
  let notification = true;
  const uid = Meteor.userId();
  const name = getUserById(users, uid);
  //use uid
  if (!submission.content["react"]){
    submission.content["react"] = [react];
    submission.content["reactUser"] = [uid];
  } else {
    //if user already reacted, they can change reaction
    if (submission.content["reactUser"].includes(uid)){
      let idx = submission.content["reactUser"].indexOf(uid);
      submission.content["react"][idx] = react;
      notification = false;
    } else {
    //else just push reaction
      submission.content["react"].push(react);
      submission.content["reactUser"].push(uid);
    }
  }

  let submissionObject = {
    uid: uid,
    eid: submission.eid,
    iid: submission.iid,
    _id: submission._id,
    needName: submission.needName,
    content: submission.content,
    timestamp: submission.timestamp,
    lat: submission.lat,
    lng: submission.lng
  };

  Meteor.call('updateSubmission', submissionObject);
  //notify participant of reaction
  if (notification){
    Meteor.call('sendNotification', [submission.uid], submission.needName, name + ' reacted to your cheers!',
     '/apicustomresults/' + submission.iid + '/' + submission.eid);
 }
};

Template.imitationGameResults.helpers({
  content() {
    let currentUser = this.users.find(x => x._id === Meteor.userId());

    let triad;
    if(currentUser.profile.staticAffordances.triadOne) {
      triad = 'triadOne';
    } else if(currentUser.profile.staticAffordances.triadTwo) {
      triad = 'triadTwo';
    }
    let originalImage, creatorSub, descriptorSub, recreatorSub;
    let creatorName, descriptorName, recreatorName;

    this.submissions.filter(s => {
      let tokenizedNeed = s.needName.split('_');
      if(tokenizedNeed[2] == triad) {
        if(tokenizedNeed[0] == 'creator') {
          creatorSub = this.images.find(i => i._id === s.content.proof);
          let creatorUser = this.users.find(u => u._id == s.uid);
          creatorName = `${creatorUser.profile.firstName} ${creatorUser.profile.lastName}`
          originalImage = this.experience.contributionTypes.find(need => need.needName == s.needName).toPass.example_image;
        } else if (tokenizedNeed[0] == 'descriptor') {
          descriptorSub = s.content.sentence;
          if(descriptorSub) {
            let descriptorUser = this.users.find(u => u._id == s.uid);
            descriptorName = `${descriptorUser.profile.firstName} ${descriptorUser.profile.lastName}`
          }
        } else if (tokenizedNeed[0] == 'recreator') {
          recreatorSub = this.images.find(i => i._id === s.content.proof);
          if(recreatorSub) {
            let recreatorUser = this.users.find(u => u._id == s.uid);
            recreatorName = `${recreatorUser.profile.firstName} ${recreatorUser.profile.lastName}`
          }
        }
      }
    });
    return {originalImage, creatorSub, descriptorSub, recreatorSub, creatorName, descriptorName, recreatorName};
  }
});

/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} Array to split
 * @param chunkSize {Integer} Size of every group
 * @see https://ourcodeworld.com/articles/read/278/how-to-split-an-array-into-chunks-of-the-same-size-easily-in-javascript
 */
export const chunkArray = (myArray, chunk_size) => {
  let results = [];

  while (myArray.length) {
    results.push(myArray.splice(0, chunk_size));
  }

  return results;
};

Template.halfhalfResults.helpers({
  lengthEqual(arr, number) {
    return arr.length === number;
  },
  getUserById(users_arr, uid) {
    let user = users_arr.find(function(x) {
      return x._id === uid;
    });
    return user;
  },
  elementAtIndex(arr, index){
    return arr[index];
  },
  /** So we can show the contributions of a dyad, for each need
   * @returns {needName: String, imagesGroupedByDyad: [(a,b) (c, d) (e)]}
   */
  resultsGroupedByNeedAndDyad() {

    let mySubs = this.submissions.filter(function(x){
      return x.uid === Meteor.userId();
    });

    let myNeedNames = mySubs.map(function(x){
      return x.needName;
    });

    // only show examples where the need names are unique
    myNeedNames = [... new Set(myNeedNames)];

    return myNeedNames.map((needName) => {
      // images already filtered by activeIncident. Now get them for each need
      let needImages = this.images.filter((img) => {
        return img.needName == needName;
      });

      return {needName: needName, imagesGroupedByDyad: chunkArray(needImages, 2)};
    });
  }
});

Template.halfhalfResults_admin.helpers({
  lengthEqual(arr, number) {
    return arr.length === number;
  },
  getUserById(users_arr, uid) {
    let user = users_arr.find(function(x) {
      return x._id === uid;
    });
    return user;
  },
  elementAtIndex(arr, index){
    return arr[index];
  },
  /** So we can show the contributions of a dyad, for each need
   * @returns {needName: String, imagesGroupedByDyad: [(a,b) (c, d) (e)]}
   */
  resultsGroupedByNeedAndDyad() {

    let mySubs = this.submissions;

    let myNeedNames = mySubs.map(function(x){
      return x.needName;
    });

    // only show examples where the need names are unique
    myNeedNames = [... new Set(myNeedNames)];

    return myNeedNames.map((needName) => {
      // images already filtered by activeIncident. Now get them for each need
      let needImages = this.images.filter((img) => {
        return img.needName == needName;
      });

      return {needName: needName, imagesGroupedByDyad: chunkArray(needImages, 2)};
    });
  }
});

Template.scavengerHunt.helpers({
  categories() {
    let needNames = this.experience.contributionTypes.map(function(x){
      return x.needName;
    });
    let categoriesSet = new Set(needNames);
    return [...categoriesSet];
  },
  imagesByCategory(category){

    let specific = this.images.filter(function(x){
      return x.needName === category;
    });

    return specific;
  },
  getNeed(image){
    return image.needName
  },
  uncompletedNeeds(){
    let needs = this.experience.contributionTypes.map(function(x){
      return x.needName;
    });
    completedNeeds = [];
    for (i=0; i<this.images.length; i++){
      completedNeeds.push(this.images[i].needName);
    }
    let unfinished = needs.filter(x => !completedNeeds.includes(x))
    return unfinished
  },
  numTasksRemaining(){
    return this.images.length + "/" + this.experience.contributionTypes.length + " tasks completed";
  },
  onlySubmission(){
    if (this.images.length<=1){
      return true;
    }
  }
});

Template.storyBook_noInterdependence.helpers({
  notFirst(index) {
    return index !== 0;
  },
  notLast(index){
    // number of images is the number of pages
    return index < this.images.length - 1;
  },
  completedSubmissions(subs){
    return subs.filter((sub) => {
      return sub.uid !== null;
    })
  }
});

Template.storybook.helpers({
  notFirst(index){
    return index !==0;
  },
  notLast(index){
    return (index) < this.images.length;
  },
  firstSentence(){
    let pageOne = this.experience.contributionTypes.find(function(x) {
      return x.needName === "pageOne";
    });
    return pageOne.toPass.firstSentence;
  },
  previousSentence(index){
    const instance = Template.instance()
    let previousSubmission = instance.data.submissions[index-1];
    return previousSubmission.content.sentence
  },
  previousSentenceAuthorUid(index) {
    const instance = Template.instance()
    let previousSubmission = instance.data.submissions[index-1];
    return previousSubmission.uid;
  }
});

let slideIndex = 1;
function plusSlides(n) {
  console.log("increasing by", n);
  console.log("currently on", slideIndex);
  showSlides(slideIndex += n);
}
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}

  slides[slideIndex-1].style.display = "block";
}

Template.storybook.onRendered(function() {
  this.autorun(() => {
    showSlides(1);
  });
});

Template.storyBook_noInterdependence.onRendered(function() {
  this.autorun(() => {
    showSlides(1);
  });
});

Template.storybook.events({
  'click .prev'(event, instance) {
    event.preventDefault();
    plusSlides(-1)
  },
  'click .next'(event, instance) {
    event.preventDefault();
    plusSlides(1)
  }
});
Template.storyBook_noInterdependence.events({
  'click .prev'(event, instance) {
    event.preventDefault();
    plusSlides(-1)
  },
  'click .next'(event, instance) {
    event.preventDefault();
    plusSlides(1)
  }
});

let timeout = null;

let sunsetSlideIndex = 1;
function showSlidesAuto() {
  // let i
  let slides = document.getElementsByClassName("sunsetSlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  sunsetSlideIndex++;

  if (sunsetSlideIndex > slides.length) {sunsetSlideIndex = 1}
  if (sunsetSlideIndex < 1) {sunsetSlideIndex = slides.length}
  if (slides[sunsetSlideIndex-1]) {
    slides[sunsetSlideIndex-1].style.display = "block";
  } else {
    console.error(`slides[${sunsetSlideIndex-1}] undefined`);
    console.log(slides.item(sunsetSlideIndex-1));
    console.log('------');
  }
  timeout = Meteor.setTimeout(showSlidesAuto, 1500);
};

Template.sunset.onRendered(function() {
  this.autorun(() => {
    showSlidesAuto();
    // window.onload = function () {
    //   console.log("run slideshow before");
    //   // showSlidesAuto();
    //   console.log("run slideshow after");
    // }
  });
})

Template.sunset.onDestroyed(function() {
  this.autorun(() => {
    console.log("destroyed")
    Meteor.clearTimeout(timeout)
    timeout = null;
  });
});
