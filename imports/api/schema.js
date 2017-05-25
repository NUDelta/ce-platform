export const Schema = {};

// TODO: refacotr into enums?
Schema.CEModules = [
  'camera',
  'text',
  'chain',
  'map',
  'flashlight'
];

// Note: If you add a qualification here, you also have to add an english
// question in /imports/api/users/qualification_questions.js
Schema.CEQualifications = [
  'hasDog',
  'hasCamera',
  'isGirl',
  'isBoy',
];
