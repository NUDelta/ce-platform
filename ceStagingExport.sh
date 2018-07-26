#!/bin/bash
xcodebuild clean \
    -workspace ce-platform.xcworkspace/ \
    -scheme ce-platform

xcodebuild \
    -workspace ce-platform.xcworkspace \
    -scheme ce-platform \
    -archivePath build/ce-platform.xcarchive \
    archive

xcodebuild \
  -exportArchive \
  -archivePath build/ce-platform.xcarchive \
  -exportOptionsPlist stagingExportOptions.plist \
  -exportPath ce-platform-export
