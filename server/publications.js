Meteor.publish('experiences', function(query) {
  return Experiences.find(query);
});

Meteor.publish('yelpCategories', function() {
  return YelpCategories.find({}, { fields: { title: 1 }});
});

Meteor.publish('images', function(experienceId) {
  if (experienceId) {
    return Images.find({ experience: experienceId });
  } else {
    return Images.find();
  }
});
