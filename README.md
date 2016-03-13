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

## Style Guide

Because we're cool and want to be ES6 friendly.

### Variable Declarations
Use `let` instead of `var`.

```js
// bad
var foo = 'bar';

// good
let foo = 'bar';
```

### Quotations
Use single quotes for Javascript, and double quotes for HTML.

```js
// bad
let foo = "bar";

// good
let foo = 'bar'
```
