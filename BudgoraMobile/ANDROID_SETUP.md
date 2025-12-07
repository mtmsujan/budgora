# Android Emulator Setup Guide for macOS

## Prerequisites

1. **Java Development Kit (JDK) 17 or higher**
2. **Android Studio** (latest version)
3. **Android SDK** (installed via Android Studio)
4. **Android Emulator** (created via Android Studio)

## Step 1: Install Java Development Kit (JDK)

### Check if JDK is installed:
```bash
java -version
```

### If not installed, install JDK 17:
```bash
# Using Homebrew (recommended)
brew install openjdk@17

# Link it
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk

# Set JAVA_HOME
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
source ~/.zshrc
```

Or download from: https://www.oracle.com/java/technologies/downloads/#java17

## Step 2: Install Android Studio

1. **Download Android Studio:**
   - Visit: https://developer.android.com/studio
   - Download for macOS
   - Install the `.dmg` file

2. **First Launch Setup:**
   - Open Android Studio
   - Follow the setup wizard
   - Install Android SDK, Android SDK Platform, and Android Virtual Device (AVD)

## Step 3: Configure Environment Variables

Add these to your `~/.zshrc` (or `~/.bash_profile` if using bash):

```bash
# Android SDK
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

Then reload:
```bash
source ~/.zshrc
```

## Step 4: Create Android Virtual Device (AVD)

### Option 1: Using Android Studio GUI

1. **Open Android Studio**
2. **Tools → Device Manager** (or click the device icon in toolbar)
3. **Create Device** button
4. **Select a device:**
   - Recommended: **Pixel 5** or **Pixel 6**
   - Click **Next**
5. **Select System Image:**
   - Recommended: **API 33 (Android 13)** or **API 34 (Android 14)**
   - Click **Download** if needed
   - Click **Next**
6. **Configure AVD:**
   - Name: `Pixel_5_API_33` (or your choice)
   - Click **Finish**

### Option 2: Using Command Line

```bash
# List available system images
sdkmanager --list | grep "system-images"

# Create AVD (replace with your chosen image)
avdmanager create avd -n Pixel_5_API_33 -k "system-images;android-33;google_apis;x86_64"
```

## Step 5: Verify Setup

```bash
# Check Java
java -version
# Should show: openjdk version "17.x.x"

# Check Android SDK
echo $ANDROID_HOME
# Should show: /Users/yourusername/Library/Android/sdk

# Check ADB (Android Debug Bridge)
adb version
# Should show version number

# List available emulators
emulator -list-avds
# Should show your created AVD
```

## Step 6: Start Android Emulator

### Option 1: From Android Studio
1. Open Android Studio
2. Tools → Device Manager
3. Click the **Play** button next to your AVD

### Option 2: From Command Line
```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd Pixel_5_API_33

# Or start with specific options
emulator -avd Pixel_5_API_33 -no-snapshot-load
```

**Note:** The emulator takes 1-2 minutes to boot up. Wait until you see the Android home screen.

## Step 7: Run React Native App on Android

### Method 1: Using npm script (Recommended)

```bash
cd BudgoraMobile

# Terminal 1: Start Metro bundler
npm start

# Terminal 2: Run Android app
npm run android
```

### Method 2: Using React Native CLI directly

```bash
cd BudgoraMobile

# Make sure emulator is running first!
react-native run-android
```

### Method 3: Build and install manually

```bash
cd BudgoraMobile/android
./gradlew assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk
```

## Step 8: Verify Connection

After running `npm run android`, check:

```bash
# List connected devices
adb devices

# Should show something like:
# List of devices attached
# emulator-5554   device
```

## Troubleshooting

### Issue 1: "ANDROID_HOME not set"

**Solution:**
```bash
# Add to ~/.zshrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
source ~/.zshrc
```

### Issue 2: "No devices found" or "No emulators found"

**Solutions:**
1. Make sure emulator is running (check Android Studio Device Manager)
2. Check ADB connection:
   ```bash
   adb devices
   ```
3. Restart ADB:
   ```bash
   adb kill-server
   adb start-server
   adb devices
   ```

### Issue 3: "SDK location not found"

**Solution:**
Create `android/local.properties`:
```properties
sdk.dir=/Users/yourusername/Library/Android/sdk
```

Replace `yourusername` with your actual username.

### Issue 4: Build fails with Gradle errors

**Solutions:**
```bash
cd BudgoraMobile/android

# Clean build
./gradlew clean

# Try again
cd ..
npm run android
```

### Issue 5: "Metro bundler not found"

**Solution:**
```bash
# Start Metro bundler first
npm start

# Then in another terminal
npm run android
```

### Issue 6: App crashes on launch

**Solutions:**
1. Check Metro bundler is running
2. Check API URL in `src/services/apiClient.ts`:
   - For Android Emulator, use: `http://10.0.2.2:8000/api/v1` (not localhost)
   - `10.0.2.2` is a special IP that maps to `localhost` on your Mac

### Issue 7: Slow emulator performance

**Solutions:**
1. Enable hardware acceleration in Android Studio:
   - AVD Manager → Edit → Show Advanced Settings
   - Graphics: **Hardware - GLES 2.0**
2. Allocate more RAM:
   - AVD Manager → Edit → Show Advanced Settings
   - RAM: **4096 MB** (or more if you have it)
3. Use x86_64 system image (faster than ARM)

## API URL Configuration for Android

For Android Emulator, update `src/services/apiClient.ts`:

```typescript
const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:8000/api/v1' // Android Emulator uses 10.0.2.2 for localhost
  : 'https://budgora.xyz/api/v1';
```

**Important:** 
- `10.0.2.2` = localhost on your Mac (for Android Emulator)
- `localhost` = localhost on the emulator itself (won't work)

## Quick Start Checklist

- [ ] JDK 17+ installed (`java -version`)
- [ ] Android Studio installed
- [ ] Android SDK installed
- [ ] Environment variables set (`ANDROID_HOME`)
- [ ] AVD created (Android Virtual Device)
- [ ] Emulator running (Android home screen visible)
- [ ] Metro bundler running (`npm start`)
- [ ] App running (`npm run android`)

## Useful Commands

```bash
# List all emulators
emulator -list-avds

# Start emulator
emulator -avd <AVD_NAME>

# Check connected devices
adb devices

# View logs
adb logcat

# Clear app data
adb shell pm clear com.budgora.mobile

# Uninstall app
adb uninstall com.budgora.mobile

# Install APK
adb install app-debug.apk

# Restart ADB
adb kill-server && adb start-server
```

## Next Steps

Once the app is running:
1. Test login/register functionality
2. Test API connectivity
3. Test all features
4. Check for any Android-specific issues

For production builds, see `BUILD_GUIDE.md`.



