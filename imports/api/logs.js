import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import 'meteor/nooitaf:colors';

export const log = {
  debug(message) {
    _log(`[debug]: ${ process(message) }`, 'yellow');
  },

  info(message) {
    _log(`[info]: ${ process(message) }`, 'green');
  },

  warning(message) {
    _log(`[warn]: ${ process(message) }`, 'grey');
  },
  error(message) {
    _log(`[error]: ${ process(message) }`, 'red');
  },

  job(message) {
    _log(`[job]: ${ process(message) }`, 'magenta');
  },

  cerebro(message) {
    _log(`[cerebro]: ${ process(message) }`, 'cyan');
  }
};

export const serverLog = new ValidatedMethod({
  name: 'server.log',
  validate: new SimpleSchema({
    message: {
      type: String
    }
  }).validator(),
  run({ message }) {
    log.info(message);
  }
});

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
