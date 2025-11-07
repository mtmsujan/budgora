# Budgora - React Native Setup Instructions

## Converting from Expo to React Native CLI

This project has been converted from Expo to pure React Native CLI.

## Initial Setup

### 1. Install Dependencies

```bash
cd BudgoraMobile
npm install
```

### 2. Generate Native Projects

Since this was converted from Expo, you need to generate the native iOS and Android projects:

```bash
# Create a temporary React Native project to get native folders
npx react-native init TempProject --skip-install

# Copy native folders
cp -r TempProject/ios BudgoraMobile/
cp -r TempProject/android BudgoraMobile/

# Clean up
rm -rf TempProject
```

### 3. Configure Native Projects

#### iOS Configuration

1. Open `ios/BudgoraMobile.xcworkspace` in Xcode
2. Update Bundle Identifier to `com.budgora.mobile`
3. Update Display Name to `Budgora`
4. Add app icons (see ICON_GUIDE.md)

#### Android Configuration

1. Open `android/` in Android Studio
2. Update `applicationId` in `android/app/build.gradle` to `com.budgora.mobile`
3. Update `app_name` in `android/app/src/main/res/values/strings.xml` to `Budgora`
4. Add app icons (see ICON_GUIDE.md)

### 4. Install iOS Dependencies

```bash
cd ios
pod install
cd ..
```

## Running the App

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

### Metro Bundler
```bash
npm start
```

## App Icons

See `ICON_GUIDE.md` for detailed instructions on creating and placing app icons.

## Troubleshooting

### Metro Cache Issues
```bash
npm start -- --reset-cache
```

### iOS Build Issues
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### Android Build Issues
```bash
cd android
./gradlew clean
cd ..
```

## Notes

- The app no longer uses Expo
- All Expo-specific code has been removed
- Use React Native CLI commands instead of Expo commands
- Native projects need to be generated and configured

