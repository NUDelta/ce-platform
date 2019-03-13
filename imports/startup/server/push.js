Push.debug = true;

Push.Configure({
  apn: {
    production: true,
    keyData: Assets.getText("ios/pp.pem"),
    certData: Assets.getText("ios/cc.pem"),
    passphrase: "limo",
    gateway: "gateway.push.apple.com"
  }
});

Push.allow({
  send: function (userId, notification) {
    return true; // Allow all users to send
  }
});