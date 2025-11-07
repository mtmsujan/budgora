# React Native CLI Setup Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **React Native CLI**: `npm install -g react-native-cli`
3. **Xcode** (for iOS development on macOS)
4. **Android Studio** (for Android development)
5. **Java Development Kit (JDK)** 17 or higher

## Installation

1. Install dependencies:
```bash
cd BudgoraMobile
npm install
```

2. For iOS (macOS only):
```bash
cd ios
pod install
cd ..
```

## Running the App

### iOS
```bash
npm run ios
# or
react-native run-ios
```

### Android
```bash
npm run android
# or
react-native run-android
```

### Start Metro Bundler
```bash
npm start
# or
react-native start
```

## Project Structure

- `src/` - Source code
  - `screens/` - Screen components
  - `services/` - API services
  - `utils/` - Utility functions
  - `components/` - Reusable components
- `ios/` - iOS native code (will be generated)
- `android/` - Android native code (will be generated)

## Generating Native Projects

If you need to generate the iOS and Android native projects:

```bash
# This will create ios/ and android/ directories
npx react-native init BudgoraMobile --skip-install
```

Then copy your `src/` folder and configuration files.

## App Icons

App icons should be placed in:
- iOS: `ios/BudgoraMobile/Images.xcassets/AppIcon.appiconset/`
- Android: `android/app/src/main/res/` (various mipmap folders)

## Troubleshooting

- Clear Metro cache: `npm start -- --reset-cache`
- Clean iOS build: `cd ios && xcodebuild clean && cd ..`
- Clean Android build: `cd android && ./gradlew clean && cd ..`

