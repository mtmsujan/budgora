# Fix for Xcode 26.1 Compatibility Issue

## Problem
When running `npm run ios`, you get an error:
```
xcodebuild: error: Unable to find a destination matching the provided destination specifier
error: iOS 26.1 is not installed. Please download and install the platform from Xcode > Settings > Components.
```

This is a known issue with Xcode 26.1 (beta) where it's looking for the device platform instead of the simulator platform.

## Solutions

### Solution 1: Install iOS 26.1 Device Platform (Recommended)

1. Open **Xcode**
2. Go to **Xcode > Settings** (or **Preferences**)
3. Click on **Platforms** (or **Components**)
4. Download and install **iOS 26.1** device platform
5. Wait for the download to complete
6. Try running `npm run ios` again

### Solution 2: Build Through Xcode GUI

1. Open the project in Xcode:
   ```bash
   npm run ios:xcode
   # or
   open ios/Budgora.xcworkspace
   ```

2. In Xcode:
   - Select **iPhone 17 Pro** (or any simulator) from the device dropdown at the top
   - Press **Cmd+R** to build and run
   - Or click the **Play** button

### Solution 3: Use React Native CLI Without Simulator Spec

Try running without specifying a simulator:
```bash
npm run ios
```

React Native will try to auto-detect an available simulator.

### Solution 4: Use a Different Simulator

List available simulators:
```bash
xcrun simctl list devices available
```

Then boot a different simulator:
```bash
xcrun simctl boot "iPhone 16e"
npm run ios
```

### Solution 5: Downgrade Xcode (If Possible)

If you have access to Xcode 15.x or earlier, you can:
1. Download an older Xcode version
2. Switch using: `sudo xcode-select -s /Applications/Xcode-15.app/Contents/Developer`
3. Run `npm run ios`

## Quick Fix Commands

```bash
# Option 1: Try auto-detection
npm run ios

# Option 2: Open in Xcode and build manually
npm run ios:xcode
# Then press Cmd+R in Xcode

# Option 3: Boot simulator manually first
xcrun simctl boot "iPhone 17 Pro"
npm run ios
```

## Why This Happens

Xcode 26.1 is a beta/preview version that has compatibility issues with React Native 0.73.0. The build system is incorrectly checking for the device platform (iphoneos) when building for simulator (iphonesimulator).

The error message is misleading - iOS 26.1 simulator SDK is installed, but Xcode is looking for the device SDK which may not be installed or recognized properly.

## Long-term Fix

Once Xcode 26.1 is stable or you upgrade to a newer React Native version that supports it, this issue should be resolved. For now, use Solution 1 (install device platform) or Solution 2 (build through Xcode GUI).


