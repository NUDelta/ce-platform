Push.debug = true;

Push.Configure({
  apn: {
    production: true,
    keyData: Assets.getText("ios/pp.pem"),
    certData: Assets.getText("ios/cc.pem"),
    passphrase: "limo",
    gateway: "gateway.push.apple.com"
  },
  gcm: {
    apiKey: 'AAAA2l3Cyss:APA91bH6rS4xYcNs1UeX7_vs27fAkZVroEJfQ29xkVpwHh_bv7guqWKjMqE6Zu03vc7py2FErZUJUMzE8WEuZNlL15hqbS_lHwBtYyzZo3gc-JZ9hCfqExVpmItHN8U9L276uo72hTts',
    projectNumber: 937875917515
  }
});

Push.allow({
  send: function (userId, notification) {
    return true; // Allow all users to send
  }
});