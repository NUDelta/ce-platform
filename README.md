## Collective Narrative

Collective Narrative is an extension of CE, allowing authors to concisely write "scripts" that are collaboratively played out and developed by participants. Currently, the repo contains "Murder Mystery," a CN script that allows three participants to engage in a murder mystery centered around their current contexts. The following instructions detail how to test the murder mystery CN, how to write your own CN script, and how to continue development of the CN project.

## CN Setup and Local Development
1. Install Meteor `curl https://install.meteor.com/ | sh`.
2. Clone the repository `git clone https://github.com/NUDelta/ce-platform.git`.
3. Navigate to the project folder `cd ce-platform`.
4. Run `meteor npm install` to install local dependencies.
5. Start the server using `meteor`.
6. Starting the server will also generate a python script for location testing. Copy and paste this script (highlighted in green, labeled "FOR LOCATION TESTING") into a new terminal window to simulate users at specific locations.
7. Navigate to `http://localhost:3000/` in your web browser to view the experience.
8. For editing the codebase, we recommend using VS Code.

### Murder Mystery Testing

For testing the murder mystery CN, use the following account credentials when signing in:

1. username `meg`, password `password`
2. username `andrew`, password `password`
3. username `josh`, password `password`

All three users need to sign in and participate in the murder mystery pre-story questionnaire before casting will begin. You can use different browsers or Private/Incognito mode to test the synchronous chat feature on a single computer.

### Notes

If cloning the repo for the first time, you may need to rename the folder located at "imports" -> "api" from "Testing" to "testing".

## CN Authoring Syntax

At the core of the CN project is a concise syntax that makes authoring a CN accessible and easy. The syntax used to generate Murder Mystery can be viewed and modified in `cn.js`, which can be found at "imports" -> "api" -> "testing." Following are instructions on how to write your own CN, assuming you start with a blank `cn.js`.

1. Start by declaring an export function. You must use the following name and syntax for the CN to be compiled properly: 
```js
export const cn = () => {

}
```
2. Fill in the function with the eight required parameters of a CN. The first five are defined immediately while the last three start as empty arrays. The murder mystery CN can be referenced for examples of these parameters. Copy the parameters for the `templates` array exactly, as it refers to specific HTML templates currently required for CN.
```js
let title = 'Name of the CN'
let description = 'Description of the CN, displayed on the Home tab of the Cerebro app'
let notification = "Notification sent to the user's phone when the CN appears in their app"
let setting = ['CE detector used to trigger the CN', 'description of what user context the detector refers to']
let templates = ['CNstart', 'CNchat']
let questions = []
let characters = []
let prompts = []
```
3. Define the pre-story questions. Each participant is asked these questions after they agree to participate in a CN. They can be used to further understand the contexts of each participant, allowing for a more engaging story. Each question is an object with three fields:
```js
let questionName = {
    question: 'The question itself',
    responseType: 'text or dropdown',
    responseData: 'name of variable to store the text answer, or an array of the dropdown options'
}
```
Remember to update the `questions` array with all of your questions objects.

4. Define the characters that participants will be cast as. These are also objects with three fields:
```js
let characterName = {
    roleName: 'name of the role',
    instruction: 'Instructions given to the participant who is cast as this role. This is sent as a private message to the participant, so others cannot see it.',
    context: ['An array containing the various user contexts, derived from question answers, that define if a participant is cast as this character']
}
```
Remember to update the `questions` array with all of your questions objects.

5. Define the prompts. These will be sent by a narrator in the group chat to all participants. They are crucial for building the narrative and guiding participants. They are also objects with three fields:
```js
let promptName = {
    prompt: 'The prompt sent by the narrator',
    info: 'Optional: the name of the responseData variable used in the prompt. It is appended to the end of the prompt.',
    timing: integer, representing the number of seconds after casting occurs, used to time when the prompt is sent
}
```
Remember to update the `questions` array with all of your questions objects.

6. At the end of your function, return an array containing all of the parameters:
```js
return [title, description, notification, setting, templates, questions, characters, prompts];
```

### Notes

- Templates currently conform to the CE concepts of `participateTemplate` and `resultsTemplate`, which are the HTML templates used to structure experiences in the Cerebro app. The goal is to have many different templates that satisfy different aspects of storytelling, allowing the author to use as many as they want to construct a story. But for now, exactly two templated need to be used, and only two are currently defined. The `CNstart` template allows for the pre-story questions that can further establish context before a CN. The `CNchat` template allows for synchronous storytelling experiences between participants and an author-defined narrator.
- While experiences are currently fixed at three participants, the number will eventually be author-defined.

## Additional CE Setup Notes

### Windows Subsystem for Linux Specific Setup

Follow steps 1 & 2 from above and then enter the following commands to install Mongo and start a Mongo process:

```
$ sudo apt-get install mongodb-server
$ sudo mkdir -p /data/db
$ sudo chown -R $USER /data/db
$ mongod
```
Open a separate terminal and navigate to the `ce-platform` directory and run `npm start`.

Open Mongo Shell in another terminal and try to find users to verify that you're interacting with the correct data.
```
$ mongo
> use meteor
> db.users.find()
```

## iOS Development Running 
Development build is nice to develop the mobile app, connected to a local server. Following these steps will also allow you to setup hot-code-push for local development, which makes it extra easy to make changes to the mobile app without having to go through a long build process. 

1. Find your ipaddress using `ifconfig |grep inet`. On northwesterns network, it sometimes looks something like `10.105.X.Y`. On a home WiFi network, it might look like `192.168.X.Y`
2. From the ce-platform directory, run `npm run build-dev 3000 192.168.X.Y` or equivalently `meteor run ios-device -p 3000 --mobile-server=http://{ipaddress}:3000`
3. At some point, the previous command will have opened an xcodeproject, which lives at `ce-platform/.meteor/local/cordova-build/platforms/ios`. Navigate there by typing `cd ce-platform/.meteor/local/cordova-build/platforms/ios`.
4. `pod install` to install dependencies.
5. `open Cerebro.xcworkspace` to open the workspace file, which will have the pod dependencies linked. You can close the `Cerebro.xcodeproject file now.
6. Change bundle identifier to `edu.northwestern.delta.ce-platform`
7. Get the "CE Platform" provisioning profile from developer.apple.com and import the profile into xcode. You can do this by dragging the *.mobileprovision file onto the xcode icon, or by going to General > Signing (Debug or Release) > Import Profile...
8. Set the Provisioning Profile to "CE Platform"
9. Set your build target to the iPhone you have plugged in to your computer, and press the Play button.
10. ce-platform should start up on your iPhone. Client logging should be available in XCode Terminal. Server logging should be available in the terminal you ran the `meteor run ios-device ...` commmand.

## iOS Enterprise Build

For a quick script that does the meteor build and sets up the xcworkspace, see the `ipaHelper.sh` script. For all the details that lead to writing the streamlined script, see the rest of this section.

### Building iOS Application from Meteor
1. Deploy Meteor application to Galaxy or Heroku, or start a local server.
2. Run `npm run build` to generate the Xcode project.
    1. Change the server in the `scripts` section within `package.json` if you want to run with a local server (`localhost:3000`).
    2. *Note*: if this fails with an error saying that `dezalgo` module cannot be found, run `meteor npm i -g write-file-atomic path-is-inside async-some dezalgo`.
    3. *Note*: if this fails with an error saying that `EACCES: permission denied` for one of the Pods in ce-platform-ios, you should try removing or moving the folder `../Cerebro-ios` to start a fresh build.
3. Navigate to `../Cerebro-ios/ios/project` and run `pod install` to install needed dependencies. 

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
1. Navigate to `../Cerebro-ios/ios/project` and open the `.xcworkspace`. 
2. Change the Bundle Identifier to the same identifier as in the provisioning profile above (here, `edu.northwestern.delta.A`). 
3. Copy `ceEnterpriseExport.sh` and `exportOptions.plist` to the same directory as the `.xcworkspace`. Then, run `./ceEnterpriseExport.sh` to create the application.
4. The `.ipa` can be found in the `Cerebro-export/` directory. Distribute your `.ipa` to testers using [diawi.com](www.diawi.com).



## Development Guidelines & Styles
Please read through and follow these guidelines while contributing code to this project.

### Dev Tips and Tricks
- To clear the database and therefore propagate changes to dummy data in `fixture.js`, set the `CLEAR_DB` boolean in `config.js` to 1
- if notifications stop working, check that production is set to true in config.push.json
- to see logs in terminal: heroku logs -t --app ce-platform
- "quote exceed" might mean the quota of the whole db is exceeded, the limit for free is 500MB
- Use this handy console log to keep track of any data flowing during the Identify, Coordinate, or Progress calls: `const util = require('util'); console.log('myVariable: ', util.inspect(myVariable, false, null));`

#### Accessing Test Data to Test Participate and Results Views
For the 4 OCEs used in the CHI 19 study, I made a data dump which has several dummy submissions.  It will allow you to look at all the participate and results screens to check your views.
1. Download the data dump from our `ce-platform/mlab-dump` S3 bucket!
2. Start a meteor server i.e. `meteor`
3. Start a connection to the database i.e. `meteor mongo`
4. Restore the data i.e. `mongorestore -h 127.0.0.1 --port 3001 -d meteor ce-dump-avatar-storytimerichpoor-samesituationrich/meteor`
5. Several accounts were used to create data, like users `nagy` and `bonnie`. Their passwords are `password`
6. If you want to create more data, do so within the app. Then use mongodump i.e. `mongodump -h 127.0.0.1 --port 3001 -d meteor`

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


