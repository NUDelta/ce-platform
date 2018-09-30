let Affinder = [];
let needComplete = function(){};
let sendTimelapseReadyNotification = function(){};
let page = []

let exp;
exp = {
  name: 'Storybook',

  needs: [
    {
      needName: 'page0',
      situation:
        {
          detector: Affinder.lookup('Harry Potter Castle'),
          number: 1
        },
      passToTemplate: {sentence: 'Harry looked up at the towering castle!'},
      numberNeeded: 1
    }],

  callbacks: [
    {
      trigger: "newSubmission() && (numberOfSubmissions() <= 7)",
      callbackFunction:
        function (newSubmission) {
        let newNeed = {
          "needName": page + i,
          "situation": {
            "detector": Affinder.lookup(newSubmission.content.nextSituation),
            "number": 1
          },
          ...
        };
        addNeed(experienceId, newNeed);
      }

  ],

  participateTemplate: 'storyPage',
  resultsTemplate: 'book',

};




v = callbackFunction;








;