Experiences = new Mongo.Collection('experiences');

Experiences.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: 'Experience name'
  },
  author: {
    type: String,
    label: 'Author user id',
    // regEx: SimpleSchema.RegEx.Id // leaing out for test cases
  },
  description: {
    type: String,
    label: 'Experience description'
  },
  startEmailText: {
    type: String,
    label: 'Experience starting email text'
  },
  modules: {
    type: [String],
    label: 'Integrated collective experience modules',
    allowedValues: CEModules
  },
  requirements: {
    type: [String],
    label: 'User characteristic requirements',
    allowedValues: CEQualifications
  },
  location: {
    type: String,
    label: 'Desired location of participants'
  }
}));
