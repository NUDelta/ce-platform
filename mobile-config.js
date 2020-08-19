App.info({
  // id: "edu.northwestern.delta.ce-platform",
  id: "edu.northwestern.delta.D",
  name: "Cerebro"
});

App.accessRule('*');
App.accessRule('blob:*');
App.accessRule('*.google.com/*');
App.accessRule('*.googleapis.com/*');
App.accessRule('*.gstatic.com/*');

App.appendToConfig(`<platform name="ios">
    <config-file platform="ios" target="*-Info.plist" parent="NSPhotoLibraryUsageDescription">
      <string>Collective Experiences needs photo library access to allow you to submit photos for Experiences.</string>
    </config-file>
    <config-file platform="ios" target="*-Info.plist" parent="NSCameraUsageDescription">
      <string>Collective Experiences needs camera access to allow you to take photos for Experiences.</string>
    </config-file>
  </platform>`);

App.configurePlugin('phonegap-plugin-push', {
  SENDER_ID: 12341234
});
