import { Template } from "meteor/templating";
import { Meteor } from 'meteor/meteor'
import '../components/displayImage.html';


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
    console.log(x);
    return x.friendName;
  },
  getImage(x){
    return x.image;
  },
  getMyImage(x){
    return x.myImage;
  },
  bumpees() {
    console.log(this)
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

    console.log("contents", contents);

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

    console.log("contents2", contents);
    return contents;
  }
});

Template.bumpedResults.events({

});


Template.bumpedThreeResults.helpers({
  content() {
    console.log(this);
    const {submissions, images, users} = this;

    const mySub = submissions.find(s => s.uid === Meteor.userId());
    const myNeedNames = mySub.needName;
    const otherSubs = submissions.filter(s => myNeedNames.includes(s.needName) && s.uid !== Meteor.userId());

    const myImage = images.find(i => i._id === mySub.content.proof);
    const otherImages = otherSubs.map(s => images.find(i => i._id === s.content.proof));
    const friendNames = otherSubs.map(s => users.find(u => u._id === s.uid));
  
    results = {};
    Object.assign(results, 
      friendNames[0] && {friendOneName: friendNames[0].username},
      {imageOne: otherImages[0]},
      otherSubs[0] && {captionOne: otherSubs[0].content.sentence},
      {myImage: myImage},
      mySub && {myCaption: mySub.content.sentence},
      {imageTwo: otherImages[1]},
      friendNames[1] && {friendTwoName: friendNames[1].username},
      otherSubs[1] && {captionTwo: otherSubs[1].content.sentence}
    )

    return results;
  }
})

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
