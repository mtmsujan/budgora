# Fixing React Native CLI Setup

## Issues Fixed

### 1. Missing Dependencies ✅
- Ran `npm install` to install all required packages including `@react-native/metro-config`

### 2. CocoaPods Installation Required ⚠️

The iOS build is failing because CocoaPods haven't been installed. You need to:

**Install CocoaPods** (if not already installed):
```bash
sudo gem install cocoapods
```

**Then install iOS dependencies**:
```bash
cd BudgoraMobile/ios
pod install
cd ..
```

**Alternative**: If you don't have CocoaPods installed, you can use Homebrew:
```bash
brew install cocoapods
cd BudgoraMobile/ios
pod install
cd ..
```

### 3. After Installing Pods

Once pods are installed, try running again:
```bash
npm run ios
```

## Quick Fix Commands

```bash
# Install CocoaPods (if needed)
sudo gem install cocoapods

# Install iOS dependencies
cd BudgoraMobile/ios
pod install
cd ..

# Start Metro bundler
npm start

# Run iOS app
npm run ios
```

## Note

The Metro bundler should now work. The iOS build will work once CocoaPods are installed.


