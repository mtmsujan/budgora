# React Native Mobile App - Setup Instructions

## Option 1: Using React Native CLI (Recommended)

### Step 1: Initialize the Project

Use the updated command instead of the deprecated one:

```bash
npx @react-native-community/cli init BudgoraMobile --template react-native-template-typescript
```

Or if you prefer Expo (easier setup):

```bash
npx create-expo-app BudgoraMobile --template
```

### Step 2: Copy Application Files

After the project is initialized, copy all files from the `mobile-app` folder:

```bash
# Copy all source files
cp -r mobile-app/src BudgoraMobile/
cp mobile-app/App.tsx BudgoraMobile/
cp mobile-app/package.json BudgoraMobile/
cp mobile-app/README.md BudgoraMobile/
```

### Step 3: Install Dependencies

```bash
cd BudgoraMobile
npm install
```

### Step 4: Install iOS Pods (iOS only)

```bash
cd ios && pod install && cd ..
```

---

## Option 2: Use Existing Structure (Quick Start)

If you want to use the existing `mobile-app` folder structure:

### Step 1: Initialize React Native in the mobile-app folder

```bash
cd mobile-app
npx @react-native-community/cli init . --skip-install --template react-native-template-typescript
```

This will create the native iOS/Android folders while keeping your existing code.

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Install iOS Pods (iOS only)

```bash
cd ios && pod install && cd ..
```

---

## Option 3: Use Expo (Easiest - No Native Setup Required)

### Step 1: Create Expo Project

```bash
npx create-expo-app BudgoraMobile --template blank-typescript
```

### Step 2: Copy Files

```bash
cp -r mobile-app/src BudgoraMobile/
cp mobile-app/App.tsx BudgoraMobile/
```

### Step 3: Install Dependencies

```bash
cd BudgoraMobile
npm install @react-navigation/native @react-navigation/native-stack @react-native-async-storage/async-storage axios react-native-screens react-native-safe-area-context react-native-gesture-handler @react-native-community/datetimepicker
```

### Step 4: Update package.json scripts

Make sure your package.json has:
```json
{
  "scripts": {
    "start": "expo start",
    "ios": "expo start --ios",
    "android": "expo start --android"
  }
}
```

### Step 5: Run

```bash
npm start
# Then press 'i' for iOS or 'a' for Android
```

---

## Important: Update API URL

Before running, update `src/services/apiClient.ts`:

**For iOS Simulator:**
```typescript
const API_BASE_URL = 'http://localhost:8000/api/v1';
```

**For Physical iOS Device:**
```typescript
const API_BASE_URL = 'http://YOUR_MAC_IP:8000/api/v1';
```

**For Android Emulator:**
```typescript
const API_BASE_URL = 'http://10.0.2.2:8000/api/v1';
```

**For Physical Android Device:**
```typescript
const API_BASE_URL = 'http://YOUR_COMPUTER_IP:8000/api/v1';
```

---

## Running the App

**React Native CLI:**
```bash
npm run ios      # iOS
npm run android  # Android
```

**Expo:**
```bash
npm start
# Then press 'i' for iOS or 'a' for Android
```

---

## Troubleshooting

### If you see "Command not found"
Make sure you have Node.js installed:
```bash
node --version  # Should be v18 or higher
```

### If iOS build fails
```bash
cd ios && pod install && cd ..
```

### If Android build fails
Make sure Android Studio and Android SDK are installed.

### For Expo
No native setup needed! Just run `npm start` and scan the QR code with Expo Go app.

---

## Recommended: Use Expo

For fastest setup, I recommend using **Expo** as it:
- Doesn't require Xcode or Android Studio setup
- Works with Expo Go app on your phone
- Faster development cycle
- Easier deployment

