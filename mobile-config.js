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
      <string>Cerebro needs photo library access to allow you to submit photos for Experiences.</string>
    </config-file>
    <config-file platform="ios" target="*-Info.plist" parent="NSCameraUsageDescription">
      <string>Cerebro needs camera access to allow you to take photos for Experiences.</string>
    </config-file>
    <!-- background-geolocation -->
    <config-file parent="NSLocationAlwaysAndWhenInUseUsageDescription" target="*-Info.plist">
        <string>Cerebro needs access to your location 'Always' to notify you of Experiences based on the place you are located.</string>
    </config-file>
    <config-file parent="NSLocationWhenInUseUsageDescription" target="*-Info.plist">
        <string>Cerebro needs access to your location 'When In Use' to identify Experiences based on the place you are located.</string>
    </config-file>
    <config-file parent="NSMotionUsageDescription" target="*-Info.plist">
        <string>Cerebro needs device motion updates, as these help determine when the device is stationary so the app can save power by turning off location-updates</string>
    </config-file>
  </platform>`);

App.configurePlugin('phonegap-plugin-push', {
  SENDER_ID: 12341234
});

// https://github.com/meteor/meteor/issues/4496#issuecomment-127773041
App.setPreference('AutoHideSplashScreen' ,'true'); 