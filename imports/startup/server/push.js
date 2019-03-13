Push.debug = true;

Push.Configure({
  apn: {
    production: false,
    keyData: Assets.getText("ios/pp.pem"),
    certData: Assets.getText("ios/cc.pem"),
    passphrase: "limo",
    gateway: "gateway.push.apple.com"
  }
});

Push.allow({
  send: function (userId, notification) {
    return false; // Allow all users to send
  }
});