import { Template } from 'meteor/templating';
import './globalHelpers.js'
Template.registerHelper('$and', (a, b) => {
  return a && b;
});

Template.registerHelper('$not', a => !a);
