Cerebro.NOTIFY_ALL = true;

BrowserPolicy.content.allowSameOriginForAll();
BrowserPolicy.content.allowOriginForAll('http://meteor.local');
BrowserPolicy.content.allowOriginForAll('https://yourapp.io');
BrowserPolicy.content.allowOriginForAll('https://*.yourapp.io');
BrowserPolicy.content.allowOriginForAll('https://*.stripe.com');
BrowserPolicy.content.allowEval();