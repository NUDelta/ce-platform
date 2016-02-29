Cerebro.NOTIFY_ALL = true;

BrowserPolicy.content.allowSameOriginForAll();
BrowserPolicy.content.allowOriginForAll('http://meteor.local');
BrowserPolicy.content.allowOriginForAll('http://yo-star.xyz');
BrowserPolicy.content.allowOriginForAll('http://aspin.xyz');
BrowserPolicy.content.allowEval();