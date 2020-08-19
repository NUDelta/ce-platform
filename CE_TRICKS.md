# CE THINGS THAT I HAVE LEARNED

## Purpose of this Document
There are a few things that are not obvious in this codebase, so I figured I would make a document that would allow future CEpeeps to take a glance at if they're having codebase troubles.

### The Testing Constants File(s)
1. I don't understand what the different fields are in an experience object...

I didn't explain the more obvious ones. Also it's probably better to ask Ryan than refer to this document
- `name`: used for UI purposes, title text of the experience
- `description`: also used for UI purposes: paragraph describing the experience
- `participateTemplate` and `resultsTemplate`: which template is used to render the experience,
make sure to match the template name exactly
- `contributionTypes.needName`: used for callback triggers
- `contributionTypes.situation.number`: honestly idk
- `contributionTypes.situation.toPass`: anything you might want to pass into the participation template; helpful if you're recycling templates for different experiences
- `contributionTypes.numberNeeded`: number of submissions that need to be completed to trigger this contribution being completed
- `contributionTypes.notificationDelay`: how long the user needs to be in a situation before they receive a notification to contribute to this need

2. Why can't I import a method in my testing constants file???

If you are trying to use the imported method in the callback, the
callbacks are actually executed using the `imports/api/OCEManager/progressor.js` file, and so you actually have to import the method into that file. See `import {notify} from "../OpportunisticCoordinator/server/noticationMethods";` and how `notify` is used in most of the experience callbacks.

### Detectors

### UI Stuff
1. A helper method that I wrote for a component is undefined!

If you're modifying (or creating) a page, import the component's js to the page's js file.

2. I'm so sick of using the same functions for every template.

See Issue 123 on the repo.

3. Please Explain the Half Half Camera to Me

Lol gg

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
