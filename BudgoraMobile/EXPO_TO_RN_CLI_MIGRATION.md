# Complete Guide: Expo to React Native CLI Migration

This document outlines the complete process of converting the Budgora mobile app from Expo to pure React Native CLI, including all fixes and solutions applied.

## Table of Contents
1. [Initial Setup](#initial-setup)
2. [Removing Expo Dependencies](#removing-expo-dependencies)
3. [Creating Native iOS and Android Folders](#creating-native-ios-and-android-folders)
4. [Fixing CocoaPods Issues](#fixing-cocoapods-issues)
5. [Fixing Build Errors](#fixing-build-errors)
6. [Fixing Bundle URL Issues](#fixing-bundle-url-issues)
7. [Final Configuration](#final-configuration)

---

## Initial Setup

### Prerequisites
- Node.js >= 18
- CocoaPods installed (`pod --version` should work)
- Xcode installed (for iOS)
- Android Studio installed (for Android)

---

## Step 1: Removing Expo Dependencies

### 1.1 Update package.json

**File:** `BudgoraMobile/package.json`

**Changes:**
- Removed all Expo-related dependencies (`expo`, `expo-status-bar`, etc.)
- Added React Native CLI dependencies:
  ```json
  {
    "dependencies": {
      "@react-native-async-storage/async-storage": "^1.21.0",
      "@react-native-community/datetimepicker": "^7.6.2",
      "@react-native-picker/picker": "^2.11.4",
      "@react-navigation/native": "^6.1.9",
      "@react-navigation/native-stack": "^6.9.17",
      "axios": "^1.6.2",
      "react": "18.2.0",
      "react-native": "0.73.0",
      "react-native-gesture-handler": "~2.14.0",
      "react-native-safe-area-context": "4.8.2",
      "react-native-screens": "~3.29.0"
    },
    "devDependencies": {
      "@babel/core": "^7.20.0",
      "@babel/preset-env": "^7.20.0",
      "@babel/runtime": "^7.20.0",
      "@react-native/babel-preset": "^0.73.0",
      "@react-native/eslint-config": "^0.73.0",
      "@react-native/metro-config": "^0.73.0",
      "@react-native/typescript-config": "^0.73.0",
      "@types/react": "~18.2.45",
      "@types/react-test-renderer": "^18.0.0",
      "babel-jest": "^29.6.3",
      "eslint": "^8.19.0",
      "jest": "^29.6.3",
      "prettier": "^2.8.8",
      "react-test-renderer": "18.2.0",
      "typescript": "^5.1.3"
    }
  }
  ```

### 1.2 Update Scripts

**File:** `BudgoraMobile/package.json`

**Changes:**
```json
{
  "scripts": {
    "android": "react-native run-android",
    "ios": "NO_FLIPPER=1 react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx"
  }
}
```

**Note:** `NO_FLIPPER=1` is added to disable Flipper (debugging tool) which causes build issues with React Native 0.73.

### 1.3 Update Babel Configuration

**File:** `BudgoraMobile/babel.config.js`

**Before:**
```js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

**After:**
```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
};
```

### 1.4 Create Metro Configuration

**File:** `BudgoraMobile/metro.config.js`

**Content:**
```js
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

### 1.5 Update Entry Point

**File:** `BudgoraMobile/index.js`

**Content:**
```js
/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

### 1.6 Update app.json

**File:** `BudgoraMobile/app.json`

**Content:**
```json
{
  "name": "Budgora",
  "displayName": "Budgora"
}
```

---

## Step 2: Creating Native iOS and Android Folders

### 2.1 Generate Native Projects

Since the `ios` and `android` folders were missing, we generated them using React Native CLI:

```bash
# Create a temporary React Native project to copy native folders
cd /path/to/temp/directory
npx react-native init TempBudgora --skip-install

# Copy ios and android folders to your project
cp -r TempBudgora/ios /path/to/BudgoraMobile/
cp -r TempBudgora/android /path/to/BudgoraMobile/

# Clean up
rm -rf TempBudgora
```

### 2.2 Update iOS Project Configuration

**File:** `BudgoraMobile/ios/Budgora/Info.plist`

**Changes:**
- Updated `CFBundleDisplayName` to "Budgora"
- Added network security settings:
  ```xml
  <key>NSAppTransportSecurity</key>
  <dict>
    <key>NSAllowsArbitraryLoads</key>
    <false/>
    <key>NSAllowsLocalNetworking</key>
    <true/>
  </dict>
  ```

**File:** `BudgoraMobile/ios/Budgora/AppDelegate.mm`

**Content:**
```objc
#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"Budgora";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
```

**Important:** The `moduleName` must match the `name` in `app.json` ("Budgora").

**File:** `BudgoraMobile/ios/Budgora/LaunchScreen.storyboard`

**Changes:**
- Update the launch screen label text from "TempBudgora" to "Budgora"

**Before:**
```xml
<label ... text="TempBudgora" ... />
```

**After:**
```xml
<label ... text="Budgora" ... />
```

This is the splash screen that appears when the app launches.

### 2.3 Update Android Project Configuration

**File:** `BudgoraMobile/android/app/build.gradle`

**Changes:**
- Updated `namespace` to `com.budgora.mobile`
- Updated `applicationId` to `com.budgora.mobile`

**File:** `BudgoraMobile/android/app/src/main/res/values/strings.xml`

**Content:**
```xml
<resources>
    <string name="app_name">Budgora</string>
</resources>
```

**File:** `BudgoraMobile/android/app/src/main/java/com/budgora/mobile/MainActivity.kt`

**Content:**
```kotlin
package com.budgora.mobile

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "Budgora"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
```

**File:** `BudgoraMobile/android/app/src/main/java/com/budgora/mobile/MainApplication.kt`

**Content:**
```kotlin
package com.budgora.mobile

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, false)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }
  }
}
```

**File:** `BudgoraMobile/android/settings.gradle`

**Content:**
```gradle
rootProject.name = 'Budgora'
```

---

## Step 3: Fixing CocoaPods Issues

### 3.1 Install Dependencies

```bash
cd BudgoraMobile
npm install
```

### 3.2 Fix Boost Podspec Download Issue

**Problem:** The boost library download URL in React Native 0.73 was broken (JFrog Artifactory returning HTML instead of the file).

**Solution:** Update the boost podspec to use SourceForge mirror.

**File:** `BudgoraMobile/node_modules/react-native/third-party-podspecs/boost.podspec`

**Before:**
```ruby
spec.source = { :http => 'https://boostorg.jfrog.io/artifactory/main/release/1.83.0/source/boost_1_83_0.tar.bz2',
                :sha256 => '6478edfe2f3305127cffe8caf73ea0176c53769f4bf1585be237eb30798c3b8e' }
```

**After:**
```ruby
spec.source = { :http => 'https://downloads.sourceforge.net/project/boost/boost/1.83.0/boost_1_83_0.tar.bz2' }
```

**Note:** Removed the SHA256 checksum as SourceForge provides a reliable download.

### 3.3 Install CocoaPods Dependencies

```bash
cd BudgoraMobile/ios

# Set UTF-8 encoding (required for CocoaPods)
export LANG=en_US.UTF-8

# Set NO_FLIPPER to disable Flipper
export NO_FLIPPER=1

# Remove old pods and lock file
rm -rf Pods Podfile.lock

# Install pods
pod install
```

**Expected Output:**
```
Pod installation complete! There are 57 dependencies from the Podfile and 57 total pods installed.
```

**Important:** Make sure `NO_FLIPPER=1` is set before running `pod install` to avoid including Flipper dependencies.

---

## Step 4: Fixing Build Errors

### 4.1 Fix Flipper Compilation Errors

**Problem:** FlipperKit was causing compilation errors with React Native 0.73 and newer Xcode versions.

**Solution:** Disable Flipper completely.

**Steps:**
1. Set `NO_FLIPPER=1` environment variable before `pod install`
2. Update `package.json` script to always include `NO_FLIPPER=1`:
   ```json
   "ios": "NO_FLIPPER=1 react-native run-ios"
   ```

### 4.2 Fix DateTimePicker Compatibility Issue

**Problem:** `@react-native-community/datetimepicker` version 7.6.2 has a function signature mismatch with Yoga library in React Native 0.73.

**Error:**
```
error: incompatible function pointer types passing 'YGSize (YGNodeRef, ...)' 
to parameter of type 'YGMeasureFunc' (aka 'struct YGSize (*)(const struct YGNode *, ...)')
```

**Solution:** Update the function signature in the DateTimePicker source file.

**File:** `BudgoraMobile/node_modules/@react-native-community/datetimepicker/ios/RNDateTimePickerShadowView.m`

**Before:**
```objc
static YGSize RNDateTimePickerShadowViewMeasure(YGNodeRef node, float width, YGMeasureMode widthMode, float height, YGMeasureMode heightMode)
```

**After:**
```objc
static YGSize RNDateTimePickerShadowViewMeasure(YGNodeConstRef node, float width, YGMeasureMode widthMode, float height, YGMeasureMode heightMode)
```

**Explanation:** React Native 0.73's Yoga library expects `YGNodeConstRef` (const pointer) instead of `YGNodeRef` (non-const pointer) for measure functions.

---

## Step 5: Fixing Bundle URL Issues

### 5.1 Problem: "No bundle url present"

**Symptoms:**
- App launches in simulator
- Shows error: "No bundle url present. Make sure you are running a packager server or have included .jsbundle file in your application bundle."

**Root Causes:**
1. Metro bundler not running
2. Module name mismatch between AppDelegate and app.json
3. Network connectivity issues between simulator and Metro

### 5.2 Solutions Applied

#### Solution 1: Start Metro Bundler

```bash
cd BudgoraMobile
npm start
```

**Verify Metro is running:**
```bash
curl http://localhost:8081/status
# Should return: packager-status:running
```

#### Solution 2: Fix Module Name Mismatch

**File:** `BudgoraMobile/ios/Budgora/AppDelegate.mm`

**Before:**
```objc
self.moduleName = @"TempBudgora";
```

**After:**
```objc
self.moduleName = @"Budgora";
```

**Important:** The module name must exactly match the `name` field in `app.json`.

#### Solution 3: Verify Network Configuration

**File:** `BudgoraMobile/ios/Budgora/Info.plist`

Ensure these settings exist:
```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <false/>
  <key>NSAllowsLocalNetworking</key>
  <true/>
</dict>
```

This allows the simulator to connect to Metro bundler running on localhost.

#### Solution 4: Rebuild and Reload App

```bash
cd BudgoraMobile
npm run ios
```

If the app is already running:
1. Press `Cmd+R` in the simulator to reload, or
2. Shake device (`Cmd+Ctrl+Z`) and select "Reload"

---

## Step 6: Final Configuration

### 6.1 Verify All Files Are Correct

**Checklist:**
- ✅ `package.json` has correct dependencies and scripts
- ✅ `babel.config.js` uses React Native preset
- ✅ `metro.config.js` exists and is configured
- ✅ `index.js` registers the app component
- ✅ `app.json` has correct name
- ✅ `ios/Budgora/AppDelegate.mm` has correct module name
- ✅ `ios/Budgora/Info.plist` allows local networking
- ✅ `ios/Podfile.lock` exists and doesn't include Flipper
- ✅ `node_modules/@react-native-community/datetimepicker/ios/RNDateTimePickerShadowView.m` has correct function signature

### 6.2 Running the App

**Start Metro Bundler:**
```bash
cd BudgoraMobile
npm start
```

**In a new terminal, run iOS:**
```bash
cd BudgoraMobile
npm run ios
```

**Or run Android:**
```bash
cd BudgoraMobile
npm run android
```

---

## Troubleshooting

### Issue: Build fails with Flipper errors

**Solution:** Ensure `NO_FLIPPER=1` is set before `pod install` and in the npm script.

### Issue: Boost download fails

**Solution:** Update boost podspec to use SourceForge URL (see Step 3.2).

### Issue: DateTimePicker compilation error

**Solution:** Update function signature to use `YGNodeConstRef` (see Step 4.2).

### Issue: Bundle URL not found

**Solutions:**
1. Ensure Metro bundler is running (`npm start`)
2. Verify module name matches in AppDelegate and app.json
3. Check Info.plist allows local networking
4. Reload app in simulator (`Cmd+R`)

### Issue: CocoaPods encoding error

**Solution:** Set `export LANG=en_US.UTF-8` before running `pod install`.

---

## Summary of Key Changes

1. **Removed Expo:** Replaced all Expo dependencies with React Native CLI equivalents
2. **Generated Native Folders:** Created iOS and Android native project folders
3. **Fixed Boost Download:** Changed podspec to use SourceForge mirror
4. **Disabled Flipper:** Set `NO_FLIPPER=1` to avoid build errors
5. **Fixed DateTimePicker:** Updated function signature for React Native 0.73 compatibility
6. **Fixed Module Name:** Ensured AppDelegate module name matches app.json
7. **Configured Networking:** Added local networking permissions in Info.plist

---

## Files Modified

### Configuration Files
- `package.json`
- `babel.config.js`
- `metro.config.js`
- `index.js`
- `app.json`

### iOS Files
- `ios/Budgora/AppDelegate.mm`
- `ios/Budgora/Info.plist`
- `ios/Podfile` (auto-generated, but NO_FLIPPER affects it)

### Android Files
- `android/app/build.gradle`
- `android/app/src/main/res/values/strings.xml`
- `android/app/src/main/java/com/budgora/mobile/MainActivity.kt`
- `android/app/src/main/java/com/budgora/mobile/MainApplication.kt`
- `android/settings.gradle`

### Node Modules (Patches)
- `node_modules/react-native/third-party-podspecs/boost.podspec`
- `node_modules/@react-native-community/datetimepicker/ios/RNDateTimePickerShadowView.m`

**Note:** Changes to `node_modules` will be lost when running `npm install`. Consider using `patch-package` to persist these changes, or wait for package updates.

---

## Next Steps

1. **Persist Patches:** Use `patch-package` to save changes to node_modules
2. **Add App Icons:** Generate and add app icons for iOS and Android
3. **Configure Signing:** Set up code signing for iOS and Android release builds
4. **Test on Device:** Test the app on physical devices
5. **Build Release:** Configure and build release versions

---

## References

- [React Native CLI Documentation](https://reactnative.dev/docs/environment-setup)
- [CocoaPods Documentation](https://guides.cocoapods.org/)
- [React Native 0.73 Release Notes](https://github.com/facebook/react-native/releases/tag/v0.73.0)

