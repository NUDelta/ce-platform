Push.debug = true;

Push.Configure({
  apn: {
    production: true,
    keyData: Assets.getText("ios/key.pem"), // depreciated for nudelta2015:push
    certData: Assets.getText("ios/cert.pem"), // depreciated for nudelta2015:push
    pfx: Assets.absoluteFilePath("ios/key.p12"), // depreciated, use P8
    // token: {
    //   key: Assets.absoluteFilePath("ios/AuthKey_W9H43BKTXS.p8"),
    //   keyId: "W9H43BKTXS",
    //   teamId: "823S57WQK3"
    // },
    passphrase: "password",
    gateway: "gateway.push.apple.com"
  }
});

Push.allow({
  send: function (userId, notification) {
    return true; // Allow all users to send
  }
});