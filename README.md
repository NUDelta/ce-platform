# CE Platform
The Collective Experience (CE) Platform facilitates the creation and operation of collective experience applications. By building to cordova/iOS and distributing this project as a native app, experiences can be launched with native push notifications and users can be targeted by their location for context-specific experiences. Currently, the platform facilitates image and text submissions for experiences.

## Setup and Local Development
1. Install Meteor `curl https://install.meteor.com/ | sh`.
2. Clone the repository `git clone https://github.com/NUDelta/ce-platform.git`.
3. Navigate to the project folder `cd ce-platform`.
4. Run `meteor npm install` to install local dependencies.
5. Start the server using `meteor`.

## iOS Build

### Building iOS Application from Meteor
1. Deploy Meteor application to Galaxy or Heroku, or start a local server.
2. Run `npm run build` to generate the Xcode project.
    1. Change the server in the `scripts` section within `package.json` if you want to run with a local server (`localhost:3000`).
3. Navigate to `../ce-platform-ios/ios/project` and run `pod install` to install needed dependencies. 

### Creating an .ipa File
#### Setup
Exporting an iOS application as an `.ipa` file requires the `ceEnterpriseExport.sh` export script and `exportOptions.plist` export options plist. The former runs the Xcode cleaning, building, and archiving stages for enterprise export and uses the latter to sign the application. 

`exportOptions.plist` are used to specify the provisioning profile and team ID to sign the application. Configure the following to change which profile is used to perform the signing:
```xml
<key>provisioningProfiles</key>
<dict>
    <key>edu.northwestern.delta.A</key>
    <string>Delta Lab A</string>
</dict>
```
```xml
<key>teamID</key>
<string>823S57WQK3</string>
```

Push notifications are currently configured to work with the Enterprise A certificate. Talk to Ryan or Yongsung for more information.

#### Export
1. Navigate to `../ce-platform-ios/ios/project` and open the `.xcworkspace`. 
2. Change the Bundle Identifier to the same identifier as in the provisioning profile above (here, `edu.northwestern.delta.A`). 
3. Copy `ceEnterpriseExport.sh` and `exportOptions.plist` to the same directory as the `.xcworkspace`. Then, run `./ceEnterpriseExport.sh` to create the application.
4. The `.ipa` can be found in the `ce-platform-export/` directory. Distribute your `.ipa` to testers using [diawi.com](www.diawi.com).



## Development Guidelines & Styles
Please read through and follow these guidelines while contributing code to this project.

### Javascript
Refer to the [Airbnb Javascript style guide](https://github.com/airbnb/javascript). We're fully into ES6, so make sure you're familiar with using `let` over `var`, `() => {}` function shorthand, and so on.


### Quotations
Use single quotes for Javascript, and double quotes for HTML.

```js
// bad
let foo = "bar";

// good
let foo = 'bar'
```

### Template Naming
Try to fit template names into namespaces describing their functionality and what pages/routes they show up on.
For example, any component that shows up underneath the `home` template should be named `home_component`. Be
descriptive with names; prefer full words over brevity. Don't include `page` at the end, unless it would be ambigious
otherwise.

### Ordering / Grouping Imports
Sort all imports in this order and into these groups, omitting any groups that don't exist.

1. If client page `.js` file, include the matching `html` file. Do not include `html` files in any files except the relevant `.js` one..
2. Include Meteor packages, starting with `import { Meteor } from 'meteor/meteor'`, followed by
   `import { Template } from 'meteor/templating'` if you use either of those.
3. Include files from `imports/`.
4. If client page `.js` file, include other template components used inside. Do `components/` first, then `partials`.

### Methods
You'll notice that, to match what's recommended from Meteor 1.3, all of the methods in this project have been changed into exported `ValidatedMethod`s. See the [Github Repo](https://github.com/meteor/validated-method/) and the [guide page](http://guide.meteor.com/methods.html) about this, but be sure to use these.

### Dev Tips and Tricks
- To clear the database and therefore propagate changes to dummy data in `fixture.js`, set the `CLEAR_DB` boolean in `config.js` to 1


- if notifications stop working, check that production is set to true in config.push.json
- to see logs in terminal: heroku logs -t --app ce-platform
- "quote exceed" might mean the quota of the whole db is exceeded, the limit for free is 500MB
