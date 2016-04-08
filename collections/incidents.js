Incidents = new Mongo.Collection('incidents');

Incidents.attachSchema(new SimpleSchema({
  experience: {
    type: String,
    label: 'Id of referenced experience'
  },
  name: {
    type: String,
    label: 'Name of referenced experience'
  },
  date: {
    type: String,
    label: 'Date of incident launch'
  },
  launcher: {
    type: String,
    label: 'Launcher user id',
    // regEx: SimpleSchema.RegEx.Id // leaing out for test cases
  }
}));
