Push.debug = true;

let apn_config = (process.env.MODE === "PROD"
  ? {
    // --- edu.northwestern.delta.A ---
    production: true,
    keyData: Assets.getText("ios/pp.pem"),
    certData: Assets.getText("ios/cc.pem"),
    passphrase: "limo",
    gateway: "gateway.push.apple.com"
  } : {
    // --- edu.northwestern.delta.ce-platform ---
    production: false,
    keyData: Assets.getText("ios/edu.northwestern.delta.ce-platform.cert.pem"),
    certData: Assets.getText("ios/edu.northwestern.delta.ce-platform.key.pem"),
    passphrase: "",
    gateway: "gateway.push.apple.com"
  });

Push.Configure({
  apn: apn_config
});

Push.allow({
  send: function (userId, notification) {
    return true; // Allow all users to send
  }
});