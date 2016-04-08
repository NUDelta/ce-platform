# CE Platform
The Collective Experience (CE) Platform facilitates the creation and operation of collective experience applications. By building to cordova/iOS and distributing this project as a native app, experiences can be launched with native push notifications and users can be targeted by their location for context-specific experiences. Currently, the platform facilitates image and text submissions for experiences.

## Setup
- Install Meteor `curl https://install.meteor.com/ | sh`
- Clone the repository `git clone https://github.com/NUDelta/ce-platform.git`
- Navigate to the project folder `cd ce-platform`
- Start the server `meteor`

## iOS Build
- Deploy to Galaxy, Heroku, or start a local server
- `meteor build <output_dir> --server=<server_location>`
  - If running a local server, `<server_location>` is `<your_IP_address>:3000`
- Open the xcodeproject that the build generates
- Build a `.ipa` file with DTR guides using the DeltaLab or Enterprise certificates
- Distribute your `.ipa` to testers using [diawi.com](www.diawi.com)

Push notifications are currently configured to work with the Enterprise A certificate. Talk to Ryan or Yongsung for more information.

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
You'll notice that, to match what's recommended from Meteor 1.3, all of the methods in this project have been changed into exported `ValidatedMethod`s. See the (Github Repo)[https://github.com/meteor/validated-method/] and the (guide page)[http://guide.meteor.com/methods.html] about this, but be sure to use these.
