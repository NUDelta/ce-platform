{
  name: 'Sunset',
    participateTemplate
:
  'uploadPhoto',
    resultsTemplate
:
  'sunset',
    needs
:
  [{
    needName: 'sunset', situation: {detector: DETECTORS.sunset._id, number: '1'},
    toPass: {instruction: 'Take a photo of the sunset!'}, numberNeeded: 20
  }],
    description
:
  'Create a timelapse of the sunset with others around the country',
    notificationText
:
  'Take a photo of the sunset!',
    callbacks
:
  [{
    trigger: 'cb.incidentFinished()',
    function: sendNotificationSunset.toString()
  }]
}
