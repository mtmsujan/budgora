# Quick Setup Guide

## ✅ Recommended: Use Expo (Easiest)

```bash
# 1. Create Expo project
npx create-expo-app BudgoraMobile --template blank-typescript

# 2. Copy files from mobile-app folder
cd BudgoraMobile
cp -r ../mobile-app/src .
cp ../mobile-app/App.tsx .

# 3. Install dependencies
npm install @react-navigation/native @react-navigation/native-stack @react-native-async-storage/async-storage axios react-native-screens react-native-safe-area-context react-native-gesture-handler @react-native-community/datetimepicker

# 4. Update API URL in src/services/apiClient.ts
# Change to: http://localhost:8000/api/v1 (or your server IP)

# 5. Run
npm start
# Press 'i' for iOS or 'a' for Android
```

## 🔧 Alternative: React Native CLI

```bash
# Use the updated command (not deprecated)
npx @react-native-community/cli init BudgoraMobile --template react-native-template-typescript

# Then copy files from mobile-app folder
cp -r mobile-app/src BudgoraMobile/
cp mobile-app/App.tsx BudgoraMobile/
cp mobile-app/package.json BudgoraMobile/

cd BudgoraMobile
npm install
cd ios && pod install && cd ..
npm run ios
```

## 📝 Note About the Warning

The warning you saw is just informational. The `react-native init` command is deprecated in favor of:
- `npx @react-native-community/cli init` (React Native CLI)
- `npx create-expo-app` (Expo - recommended for beginners)

Both will work, but Expo is easier to get started!

