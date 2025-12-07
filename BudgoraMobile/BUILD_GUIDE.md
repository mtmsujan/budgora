# React Native Build Guide: Development vs Production

## What is `__DEV__`?

`__DEV__` is a **global variable** automatically set by React Native's build system. You **don't manually change it** - it's automatically set based on how you build your app.

### How `__DEV__` Works

- **`__DEV__ = true`** (Development/Debug builds)
  - When: Running `npm run ios` or `npm run android` (default)
  - Features: Hot reloading, debugger, development warnings
  - API URL: Uses `http://localhost:8000/api/v1`

- **`__DEV__ = false`** (Production/Release builds)
  - When: Building for App Store/Play Store or release builds
  - Features: Optimized, no debugger, production warnings disabled
  - API URL: Uses `https://budgora.xyz/api/v1`

## How to Build for Production

### iOS Production Build

#### Option 1: Using Xcode (Recommended)

1. **Open Xcode:**
   ```bash
   npm run ios:xcode
   # or
   open ios/Budgora.xcworkspace
   ```

2. **Select "Any iOS Device" or a physical device** (not simulator)

3. **Change Scheme to "Release":**
   - Click on the scheme dropdown (next to the play button)
   - Select "Edit Scheme..."
   - Under "Run" → "Build Configuration" → Select "Release"
   - Click "Close"

4. **Build:**
   - Product → Archive (for App Store)
   - Or Product → Build (Cmd+B) for testing

#### Option 2: Using Command Line

```bash
# Build for Release (production)
cd ios
xcodebuild -workspace Budgora.xcworkspace \
  -scheme Budgora \
  -configuration Release \
  -sdk iphoneos \
  -archivePath build/Budgora.xcarchive \
  archive
```

#### Option 3: Using React Native CLI

```bash
# This builds in Release mode
react-native run-ios --configuration Release
```

### Android Production Build

#### Option 1: Using Android Studio

1. Open `android/` folder in Android Studio
2. Build → Generate Signed Bundle / APK
3. Select "Release" build variant
4. Follow the signing wizard

#### Option 2: Using Command Line

```bash
# Build Release APK
cd android
./gradlew assembleRelease

# Or build AAB (for Play Store)
./gradlew bundleRelease
```

The APK/AAB will be in:
- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

## Verifying Production Build

### Check if `__DEV__` is false:

Add this temporarily to your `App.tsx`:

```typescript
console.log('__DEV__ is:', __DEV__);
console.log('API URL:', API_BASE_URL);
```

- **Development**: Will show `__DEV__ is: true` and `localhost:8000`
- **Production**: Will show `__DEV__ is: false` and `budgora.xyz`

## Alternative: Force Production API URL

If you want to test the production API even in development mode, you can temporarily change `apiClient.ts`:

```typescript
// Force production URL (for testing)
const API_BASE_URL = 'https://budgora.xyz/api/v1';
```

Or use environment variables (requires additional setup with `react-native-config` or `react-native-dotenv`).

## Current Configuration

Your `apiClient.ts` is already configured correctly:

```typescript
const API_BASE_URL = __DEV__
  ? 'http://localhost:8000/api/v1' // Development
  : 'https://budgora.xyz/api/v1';   // Production
```

This means:
- ✅ Development builds → Use localhost
- ✅ Production builds → Use live site automatically

## Summary

- **You don't manually change `__DEV__`** - it's automatic
- **Development builds** (`npm run ios`) → `__DEV__ = true` → localhost API
- **Production builds** (Xcode Release/Archive) → `__DEV__ = false` → live API
- Your code is already set up correctly! Just build in Release mode for production.



