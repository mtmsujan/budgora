#!/bin/bash

echo "Building Android Release Bundle..."

cd BudgoraMobile/android

# Clean project
./gradlew clean

# Build release bundle
./gradlew bundleRelease

echo "Release bundle created at:"
echo "android/app/build/outputs/bundle/release/app-release.aab"
