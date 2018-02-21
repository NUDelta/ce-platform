import { Template } from "meteor/templating";

Template.api_custom_results.onCreated(() => {
  console.log("results data", this)

});

Template.api_custom_results.helpers({

  data() {
    console.log("results data is", this);
    return this;
  }
});


Template.photosByCategories.helpers({

  categories() {
    console.log("results data is", this);
    let needNames = this.experience.contributionTypes.map(function(x){
      return x.needName;
    });

    let categoriesSet = new Set(needNames);
    return [...categoriesSet];
  },
  imagesByCategory(category){
    console.log(this.images)
    console.log(this.images.length);
    let specific = this.images.filter(function(x){
      console.log("image for", x.needName, category);
      return x.needName === category;
    });

    console.log("specific", specific);
    return specific;
  }
});
