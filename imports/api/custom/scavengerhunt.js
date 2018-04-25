// const experienceTest = {
//   name: 'You\'re at a location',
//   participateTemplate: [{ templateName: 'atLocation', submissionData: { proof: 'photo' } }],
//   resultsTemplate: 'photoCollage',
//   contributionTypes: [{
//     templateName: 'atLocation', needs: [
//       {
//         needName: 'atResturant', situation: { description: 'restaurant', number: '1' },
//         submissionData: { proof: 'photo' }, numberNeeded: 10
//       }]
//   }],
//   description: 'This is a simple experience for testing',
//   notificationText: 'Please participate in this test experience!',
// };
//
//
// const experience = new ExperienceDefinition();
// experience.addName('Scavenger Hunt');
// experience.addDescription('Help us find all the objects on this scavenger hunt!');
// experience.addNotificationText('Help us complete the scavenger hunt!');
//
// templateItemFound = { templateName: 'itemFound', submissionData: { proof: 'photo' } };
// experience.addTemplate(templateItemFound);
//
// experience.addResultsTemplate('scavengerHuntResults');
//
// const need = {
//   needName: 'apple',
//   situation: { description: 'asd8932udasd', number: 1 },
//   toPass: {},
//   numberNeeded: 10
// };
// experience.getUsers(situation, numberNeeded);
//
// const id = experience.Create();
//
// const incidentId = runExperience('Scavenger Hunt'); //or runExperience(id);