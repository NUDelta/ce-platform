#!/bin/bash
xcodebuild clean \
    -workspace Cerebro.xcworkspace/ \
    -scheme Cerebro

xcodebuild \
    -workspace Cerebro.xcworkspace \
    -scheme Cerebro \
    -archivePath build/Cerebro.xcarchive \
    archive

xcodebuild \
	-exportArchive \
	-archivePath build/Cerebro.xcarchive \
	-exportOptionsPlist exportEnterprise.plist \
	-exportPath Cerebro.ipa
