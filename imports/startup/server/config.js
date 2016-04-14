import { BrowserPolicy } from 'meteor/browser-policy-common';
import { Cerebro } from '../../api/cerebro/server/cerebro-server.js';

Cerebro.NOTIFY_ALL = true;
Cerebro.NOTIFY_METHOD = Cerebro.PUSH;

Cerebro.DEBUG_PUSH = true;
Cerebro.DEBUG_USERS = [ 'pTeAq958AvmvMvF7e', 'mr9qe4nRHQn8KufLX', 'BvYfcgvJ7yDETLjME' ];

BrowserPolicy.content.allowSameOriginForAll();
BrowserPolicy.content.allowOriginForAll('http://meteor.local');
BrowserPolicy.content.allowOriginForAll('http://localhost');
BrowserPolicy.content.allowOriginForAll('http://yo-star.xyz');
BrowserPolicy.content.allowOriginForAll('http://aspin.xyz');
BrowserPolicy.content.allowOriginForAll('https://*.googleapis.com');
BrowserPolicy.content.allowOriginForAll('https://*.gstatic.com');
BrowserPolicy.content.allowEval();

WebApp.connectHandlers.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return next();
});

