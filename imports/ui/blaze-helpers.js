import { Template } from 'meteor/templating';

Template.registerHelper('$and', (a, b) => {
  return a && b;
});

Template.registerHelper('$not', a => !a);
