Push.debug = true;

Push.Configure({
  apn: {
    production: true,
    // keyData: Assets.getText("ios/pp.pem"), // depreciated for nudelta2015:push
    // certData: Assets.getText("ios/cc.pem"), // depreciated for nudelta2015:push
    pfx: Assets.absoluteFilePath("ios/edu.northwestern.delta.D.p12"),
    passphrase: "password",
    gateway: "gateway.push.apple.com"
  }
});

Push.allow({
  send: function (userId, notification) {
    return true; // Allow all users to send
  }
});