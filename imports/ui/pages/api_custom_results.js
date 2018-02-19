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
