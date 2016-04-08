Meteor.publish('experiences', function(experienceId) {
  if (experienceId) {
    return Experiences.find({ _id: experienceId });
  } else {
    return Experiences.find();
  }
});

Meteor.publish('textEntries', function() {
  return TextEntries.find();
});

Meteor.publish('images', function(incidentId) {
  if (incidentId) {
    return Images.find({ incident: incidentId });
  } else {
    return Images.find();
  }
});

Meteor.publish('locations', function() {
  return Locations.find();
});

Meteor.publish('incidents', function () {
  return Incidents.find();
});