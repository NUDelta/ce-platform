rm -rf ../ce-platform-ios
npm run build-staging
cp ceStagingExport.sh ../ce-platform-ios/ios/project
cp stagingExportOptions.plist ../ce-platform-ios/ios/project
cd ../ce-platform-ios/ios/project
pod install
open ce-platform.xcworkspace/

