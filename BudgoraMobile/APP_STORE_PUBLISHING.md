# App Store Publishing Guide

This guide will help you publish your Budgora app to both Google Play Store (Android) and iOS App Store.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Android Publishing](#android-publishing)
   - [Generate Signing Key](#generate-signing-key)
   - [Configure Release Build](#configure-release-build)
   - [Build Release APK/AAB](#build-release-apkaab)
   - [Publish to Google Play Store](#publish-to-google-play-store)
3. [iOS Publishing](#ios-publishing)
   - [Configure App in Xcode](#configure-app-in-xcode)
   - [Build Archive](#build-archive)
   - [Publish to App Store](#publish-to-app-store)
4. [Version Management](#version-management)
5. [Troubleshooting](#troubleshooting)

## Prerequisites

### For Android
- Google Play Developer Account ($25 one-time fee)
- Android Studio installed
- Java Development Kit (JDK) 17+

### For iOS
- Apple Developer Account ($99/year)
- Xcode installed
- Mac computer (required for iOS builds)
- Physical iOS device for testing (recommended)

## Android Publishing

### Generate Signing Key

1. **Create a keystore file** (run this command in the BudgoraMobile directory):

```bash
cd BudgoraMobile/android/app
keytool -genkeypair -v -storetype PKCS12 -keystore budgora-release-key.keystore -alias budgora-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. **Save the keystore securely** - This file is critical for future app updates!

3. **Create a properties file** to store keystore information:

Create `android/gradle.properties` (if it doesn't exist) and add:

```properties
MYAPP_RELEASE_STORE_FILE=budgora-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=budgora-key-alias
MYAPP_RELEASE_STORE_PASSWORD=your_keystore_password
MYAPP_RELEASE_KEY_PASSWORD=your_key_password
```

### Configure Release Build

1. **Update `android/app/build.gradle`** to use the release signing configuration:

```gradle
...
signingConfigs {
    debug {
        storeFile file('debug.keystore')
        storePassword 'android'
        keyAlias 'androiddebugkey'
        keyPassword 'android'
    }
    release {
        if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
            storeFile file(MYAPP_RELEASE_STORE_FILE)
            storePassword MYAPP_RELEASE_STORE_PASSWORD
            keyAlias MYAPP_RELEASE_KEY_ALIAS
            keyPassword MYAPP_RELEASE_KEY_PASSWORD
        }
    }
}
buildTypes {
    debug {
        signingConfig signingConfigs.debug
    }
    release {
        // Caution! In production, you need to generate your own keystore file.
        // see https://reactnative.dev/docs/signed-apk-android.
        signingConfig signingConfigs.release
        minifyEnabled enableProguardInReleaseBuilds
        proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
    }
}
...
```

2. **Enable ProGuard** for code minification (recommended for production):

In `android/app/build.gradle`, set:

```gradle
def enableProguardInReleaseBuilds = true
```

### Build Release APK/AAB

1. **Clean the project**:

```bash
cd BudgoraMobile/android
./gradlew clean
```

2. **Build the release bundle** (AAB is recommended for Google Play):

```bash
cd BudgoraMobile/android
./gradlew bundleRelease
```

Or for APK (for testing or other stores):

```bash
cd BudgoraMobile/android
./gradlew assembleRelease
```

3. **Find the generated files**:
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`
- APK: `android/app/build/outputs/apk/release/app-release.apk`

### Publish to Google Play Store

1. **Go to Google Play Console**: https://play.google.com/console

2. **Create a new app**:
   - Click "Create app"
   - Select app category
   - Fill in app details

3. **Upload your AAB file**:
   - Go to "Release" → "Production" → "Create new release"
   - Upload your AAB file
   - Fill in release notes

4. **Complete store listing**:
   - App name, description, screenshots
   - App icon (512x512 PNG)
   - Feature graphic (1024x500 PNG)
   - Privacy policy URL
   - Content rating questionnaire

5. **Set up app content**:
   - Target audience
   - Content rating
   - App category

6. **Pricing and distribution**:
   - Select "Free" or "Paid"
   - Select countries/regions

7. **Submit for review**:
   - Review all information
   - Click "Start rollout to production"

## iOS Publishing

### Configure App in Xcode

1. **Open the project in Xcode**:

```bash
cd BudgoraMobile
open ios/Budgora.xcworkspace
```

2. **Set up team and bundle identifier**:
   - Select "Budgora" project in the navigator
   - Select "Budgora" target
   - In "Signing & Capabilities" tab:
     - Set Team to your Apple Developer account
     - Set Bundle Identifier to a unique identifier (e.g., com.yourcompany.budgora)

3. **Configure app icons and launch screen**:
   - Add app icons in Assets.xcassets
   - Verify launch screen in LaunchScreen.storyboard

4. **Update app version and build**:
   - In "General" tab:
     - Set Version (e.g., 1.0)
     - Set Build (e.g., 1)

5. **Add app capabilities** (if needed):
   - Push notifications
   - In-app purchases
   - Sign in with Apple
   - etc.

### Build Archive

1. **Select device**:
   - Select "Any iOS Device" in the device dropdown

2. **Build the archive**:
   - Product → Archive

3. **Validate the app**:
   - In Organizer window, select your archive
   - Click "Validate App"
   - Follow the prompts to sign in with your Apple ID
   - Select the correct team and provisioning profile

4. **Distribute the app**:
   - Click "Distribute App"
   - Select "App Store Connect"
   - Follow the prompts to upload

### Publish to App Store

1. **Go to App Store Connect**: https://appstoreconnect.apple.com

2. **Create a new app**:
   - Click "My Apps" → "+"
   - Fill in app information
   - Select primary language

3. **Complete app information**:
   - App name, description, keywords
   - Screenshots (required for all device sizes)
   - App icon (1024x1024 PNG)
   - Privacy policy URL
   - Marketing URL (optional)

4. **Set up pricing and availability**:
   - Price tier
   - Availability date
   - Countries/regions

5. **Submit for review**:
   - Go to "TestFlight" tab to add beta testers (optional)
   - Go to "App Store" tab
   - Click "Submit for Review"

## Version Management

### Android Versioning

Update version in `android/app/build.gradle`:

```gradle
defaultConfig {
    applicationId "com.budgora.mobile"
    minSdkVersion rootProject.ext.minSdkVersion
    targetSdkVersion rootProject.ext.targetSdkVersion
    versionCode 2  // Increment for each release
    versionName "1.1" // User-facing version
}
```

### iOS Versioning

Update version in Xcode:
- Version: User-facing version (e.g., 1.1)
- Build: Incremental build number (e.g., 2)

## Troubleshooting

### Android Issues

1. **Build fails with signing errors**:
   - Verify keystore file exists
   - Check passwords in gradle.properties
   - Ensure keystore alias is correct

2. **Google Play rejects app**:
   - Check content rating
   - Verify permissions in AndroidManifest.xml
   - Ensure app follows all policies

3. **App crashes on launch**:
   - Check ProGuard configuration
   - Verify bundle release is properly signed
   - Test on multiple devices

### iOS Issues

1. **Archive fails**:
   - Check code signing settings
   - Verify provisioning profile
   - Clean build folder (Product → Clean Build Folder)

2. **App Store rejects app**:
   - Check app metadata
   - Verify all required screenshots are provided
   - Ensure app follows App Store guidelines

3. **App crashes on launch**:
   - Check device compatibility
   - Verify bundle identifier is unique
   - Test on physical device

## Quick Scripts

### Android Release Build Script

Create `scripts/build-android-release.sh`:

```bash
#!/bin/bash

echo "Building Android Release Bundle..."

cd BudgoraMobile/android

# Clean project
./gradlew clean

# Build release bundle
./gradlew bundleRelease

echo "Release bundle created at:"
echo "android/app/build/outputs/bundle/release/app-release.aab"
```

### iOS Release Build Script

Create `scripts/build-ios-release.sh`:

```bash
#!/bin/bash

echo "Opening Xcode for iOS Archive..."

cd BudgoraMobile

# Open Xcode
open ios/Budgora.xcworkspace

echo "In Xcode:"
echo "1. Select 'Any iOS Device'"
echo "2. Product → Archive"
echo "3. In Organizer, click 'Distribute App'"
echo "4. Follow prompts to upload to App Store Connect"
```

## Next Steps

1. Test your release builds thoroughly
2. Set up beta testing (TestFlight for iOS, Internal Testing for Android)
3. Prepare marketing materials
4. Plan your launch strategy
5. Monitor app performance after release

## Resources

- [React Native Docs: Signed APK Android](https://reactnative.dev/docs/signed-apk-android)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Console Policy](https://support.google.com/googleplay/android-developer/topic/9858017)
