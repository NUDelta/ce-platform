Meteor.publish('experiences', function(query) {
  return Experiences.find(query);
});

Meteor.publish('textEntries', function() {
  return TextEntries.find();
});

Meteor.publish('images', function(experienceId) {
  if (experienceId) {
    return Images.find({ experience: experienceId });
  } else {
    return Images.find();
  }
});
