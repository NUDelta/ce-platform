import {log} from "../../logs";

Push.addListener('message', function(notification) {
  // Called on every message
  log.cerebro('Received notification!!!!!');

});