# CE THINGS THAT I HAVE LEARNED

## Purpose of this Document
There are a few things that are not obvious in this codebase, so I figured I would make a document that would allow future CEpeeps to take a glance at if they're having codebase troubles.

### Triadic Experiences Specific Things
1. Starting Static Affordances for the users

In a triad, the mutual friend should have the static affordances `{friend: true, triad$number: true, chat:false}`. One of the strangers in the triad should be stranger1 and the other one should be stranger2. Stranger1 should have the static affordances `{stranger1: true, triad$number: true, chat:false, imitationGameFlag: false}`, and the other stranger should have the static affordances: `{stranger2: true, triad$number: true, chat:false}`

2. Progression of Experiences

Experiences proceed in order: Appreciation Station => Imitation Game => Group Cheers. At this point, the triadic experiences are finished and only 2 people experiences are left. Chat is now available for both of the strangers. The dyadic experiences proceed in order:
Drinks Talk & Mood Meteorology => Monster Create/Monster Story & Night Time Spooks & Life Journey Map.

The static affordances of a stranger are added in this order: participatedInAppreciationStation, participatedInImitationGame, participatedInGroupCheers,
participatedInDrinksTalk && participatedInMoodMeteorology

3. Detectors

Detectors are necessary to prevent users from participating out of order. The static affordances users gain from experiences limit them doing an experience later in the progression. 

### The Testing Constants File(s)
1. I don't understand what the different fields are in an experience object...

I didn't explain the more obvious ones. Also it's probably better to ask Ryan than refer to this document
- `name`: used for UI purposes, title text of the experience
- `description`: also used for UI purposes: paragraph describing the experience
- `participateTemplate` and `resultsTemplate`: which template is used to render the experience,
make sure to match the template name exactly
- `contributionTypes.needName`: used for callback triggers
- `contributionTypes.situation.number`: number of participants needed to be in the situation at the same time. in asynchronous experiences, this will be 1. if you need two people in real time participating, it will be 2
- `contributionTypes.situation.toPass`: anything you might want to pass into the participation template; helpful if you're recycling templates for different experiences
- `contributionTypes.numberNeeded`: number of submissions that need to be completed to trigger this contribution being completed (maybe should be replaced with `numberNeededToComplete`)
- `contributionTypes.numberAllowedToParticipateAtSameTime`: upper limit to how many people can participate at the same time-- different from `number` because some experiences are dependent on past contributions (see half half) while others can have as many people contributing as possible
- `contributionTypes.notificationDelay`: how long the user needs to be in a situation before they receive a notification to contribute to this need

2. I still don't understand how to create an experience...

3. Why can't I import a method in my testing constants file???

If you are trying to use the imported method in the callback, the
callbacks are actually executed using the `imports/api/OCEManager/progressor.js` file, and so you actually have to import the method into that file. See `import {notify} from "../OpportunisticCoordinator/server/noticationMethods";` and how `notify` is used in most of the experience callbacks.

### Detectors

### UI Stuff
1. A helper method that I wrote for a component is undefined!

If you're modifying (or creating) a page, import the component's js to the page's js file.

2. Please Explain the Half Half Camera to Me.

What I do is copy & paste all the camera stuff from one template to another: Use `{{> Template.dynamic template="halfhalfCamera" data="Preview"}}` in an `id=participate` or `id=triparticipate` form (and make sure to include the `cameraOverlay`). Copy & paste all the  `Template.<template_name>.onCreated` & `Template.<template_name>.onDestroyed` & `Template.<template_name>.events`. If you change what the data name in the dynamic camera template is, add it to the `getPreviewRect` function. Make sure to note that the page with the camera should not be scrollable- otherwise you'll get some weird UI bugs (so fit all your elements to the page). This may mean having to show a text input box only when a picture is already taken (so that the camera is now replaced with the file-input preview image).

3. I'm so sick of using the same functions for every template (especially the half half camera).

See Issue 123 on the repo.

### Creating a new Mongo Collection
This might be most helpful for Collective Narrative
1. Define your collection; I think most are in `imports/api`. Write a `methods.js` and `publications.js` file.
2. *IMPORTANT* For the client to have access to your collections new methods/publications import the files you've just written to `client/main.js` and `imports/startup/server/register-api.js`
The second file took forever to find! You can also pass collection data into specific routes using `imports/startup/client/router.js` (remember to import your collection)!
3. An exhaustive list of where you might have to add import statements for your collection:
- `client/main.js`
- `imports/startup/server/register-api.js`
- `imports/startup/client/router.js`
- `server/main.js`
- `imports/startup/server/fixtures/.js` (remember to clear the collection in the clear database method)
