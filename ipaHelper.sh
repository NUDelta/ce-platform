rm -rf ../ce-platform-ios
npm run build-dev
cp ceEnterpriseExport.sh ../ce-platform-ios/ios/project
cp exportOptions.plist ../ce-platform-ios/ios/project
cd ../ce-platform-ios/ios/project
pod install
open ce-platform.xcworkspace/

