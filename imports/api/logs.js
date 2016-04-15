import 'meteor/nooitaf:colors';

export const log = {
  debug(message) {
    _log(`[debug]: ${ process(message) }`, 'blue');
  },

  info(message) {
    _log(`[info]: ${ process(message) }`, 'green');
  },

  warning(message) {
    _log(`[warn]: ${ process(message) }`, 'yellow');
  },

  job(message) {
    _log(`[job]: ${ process(message) }`, 'magenta');
  },

  cerebro(message) {
    _log(`[cerebro]: ${ process(message) }`, 'cyan');
  }
};

function process(message) {
  if (typeof message == 'string') {
    return message;
  } else {
    return JSON.stringify(message);
  }
}

function _log(message, color) {
  if (Meteor.isClient) {
    console.log(message);
  } else {
    console.log(message[color]);
  }
}
