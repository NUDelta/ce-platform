Cerebro.NOTIFY_ALL = true;
Cerebro.NOTIFY_METHOD = CerebroServer.PUSH; // TODO: refacotr this shit

BrowserPolicy.content.allowSameOriginForAll();
BrowserPolicy.content.allowOriginForAll('http://meteor.local');
BrowserPolicy.content.allowOriginForAll('http://yo-star.xyz');
BrowserPolicy.content.allowOriginForAll('http://aspin.xyz');
BrowserPolicy.content.allowEval();
